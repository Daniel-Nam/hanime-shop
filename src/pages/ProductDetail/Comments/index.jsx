import { memo, useState, useRef, useEffect } from 'react'
import { BsImages } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'
import { FiSend } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import CommentItem from './CommentItem'

import {
	getDownloadURL,
	ref,
	doc,
	db,
	uploadBytes,
	storage,
	updateDoc,
} from '~/config'

function Comments({ product, fetchData, user }) {
	const [value, setValue] = useState('')
	const [previews, setPreviews] = useState([])
	const [files, setFiles] = useState([])
	const inputRef = useRef()

	const handleChange = (e) => {
		if (e.target.value.startsWith(' ')) {
			setValue(value)
			return
		}

		setValue(e.target.value)
	}

	const handleClick = () => inputRef.current.click()
	const handleKeyDown = (e) => e.key === 'Enter' && handleSubmit()

	const handleChangeFile = (e) => {
		const files = e.target.files
		setFiles(files)
		const arr = []

		for (const file of files) {
			const url = URL.createObjectURL(file)
			arr.push(url)
		}

		setPreviews(arr)
	}

	const handleDelete = (i) => {
		const newPreviews = [...previews]
		const newFiles = [...files]
		newPreviews.splice(i, 1)
		newFiles.splice(i, 1)
		setFiles(newFiles)
		setPreviews(newPreviews)
	}

	const handleSubmit = async () => {
		if (!user) {
			toast.error('Bạn cần đăng nhập để đăng bình luận!')
			return
		} else if (!value.trim()) {
			toast.error('Bạn cần nhập nội dung bình luận!')
			return
		}

		const images = []
		const id = toast.loading('Đang gửi bình luận...')

		if (files.length > 0) {
			for (const file of files) {
				const storageRef = ref(storage, `images/${uuidv4()}`)
				const uploadTask = await uploadBytes(storageRef, file)
				const url = await getDownloadURL(storageRef)
				images.push(url)

				toast.update(id, {
					render: `Đang gửi bình luận... ${Math.floor(
						(images.length / files.length) * 100
					)}%`,
				})
			}
		}

		const data = {
			images,
			id: uuidv4(),
			author: {
				id: user.uid,
				photoURL: user.photoURL,
			},
			content: value,
			createdAt: new Date().getTime(),
			likes: [],
			dislikes: [],
			replies: [],
		}

		await updateDoc(doc(db, `products`, product.id), {
			comments: [data, ...product.comments],
		})

		toast.update(id, {
			render: 'Đã gửi bình luận!',
			type: 'success',
			autoClose: 2000,
			isLoading: false,
		})

		setValue('')
		setFiles([])
		setPreviews([])
		fetchData()
	}

	useEffect(() => {
		return () => {
			for (const url of previews) URL.revokeObjectURL(url)
		}
	}, [previews])

	return (
		<div>
			<h3 className='text-xl md:text-2xl font-bold mb-1'>
				Bình luận ({product.comments.length})
			</h3>
			<div className='p-3'>
				{product.comments.length === 0 && (
					<div className='text-center'>
						<h4 className='text-xl font-semibold'>
							Chưa có bình luận nào 🥲
						</h4>
						<p>
							Bạn có thể là người đầu tiên bình luận về sản phẩm
							này 😎
						</p>
					</div>
				)}

				<div className='flex flex-col gap-5'>
					{[...product.comments]
						.sort((a, b) => {
							if (a.likes.length > b.likes.length) return -1
							if (a.likes.length < b.likes.length) return 1
							return 0
						})
						.map((comment) => (
							<CommentItem
								key={comment.id}
								comment={comment}
								user={user}
								product={product}
							/>
						))}
				</div>

				<div className='mt-4 p-2 border bg-cream rounded-sm'>
					<div className='flex items-center gap-4 flex-wrap'>
						{previews.map((url, index) => (
							<div
								key={uuidv4()}
								className='relative w-12 h-12 md:w-16 md:h-16'>
								<img
									src={url}
									alt=''
									className='block w-full h-full object-cover rounded-sm border'
								/>

								<button onClick={() => handleDelete(index)}>
									<AiOutlineClose className='absolute top-1 right-1' />
								</button>
							</div>
						))}
					</div>

					<div className='flex items-center justify-between gap-4'>
						<input
							type='text'
							className='flex-1 block w-full resize-none outline-none bg-transparent'
							placeholder='Nhập gì đó...'
							value={value}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							maxLength={500}
						/>

						<input
							ref={inputRef}
							type='file'
							className='hidden'
							accept='image/*'
							onChange={handleChangeFile}
							multiple
						/>

						<button onClick={handleClick}>
							<BsImages size='1.2em' />
						</button>

						<button
							className='shrink-0 btn btn-secondary'
							onClick={handleSubmit}>
							<FiSend />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default memo(Comments)
