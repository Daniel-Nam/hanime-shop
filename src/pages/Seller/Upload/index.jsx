import { memo, useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { FcAddImage } from 'react-icons/fc'
import { IoClose } from 'react-icons/io5'
import {
	AiOutlineLeft,
	AiOutlineDoubleLeft,
	AiOutlineCloudUpload,
} from 'react-icons/ai'
import clsx from 'clsx'
import TextareaAutosize from 'react-textarea-autosize'

import {
	db,
	setDoc,
	storage,
	ref,
	uploadBytes,
	getDownloadURL,
	doc,
} from '~/config'
import { uniqueSlug } from '~/utils'
import { updateData, userSelector } from '~/store/reducers/userSlice'
import Loading from '~/components/Loading'

function Upload() {
	const user = useSelector(userSelector)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const inputRef = useRef()
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [productCount, setProductCount] = useState('')
	const [discount, setDiscount] = useState('')
	const [isHover, setIsHover] = useState(false)
	const [loading, setLoading] = useState(false)
	const [previews, setPreviews] = useState([])
	const [files, setFiles] = useState([])
	const [sizes, setSizes] = useState([])

	useEffect(() => {
		if (!user.isSeller) {
			navigate('/upgrade-to-seller')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	useEffect(() => {
		document.title = name ? `${name} | Upload` : 'Upload'
	}, [name])

	useEffect(() => {
		return () => {
			for (const url of previews) URL.revokeObjectURL(url)
		}
	}, [previews])

	const handleChangeName = (e) => {
		if (e.target.value.startsWith(' ')) {
			setName(name)
			return
		}

		setName(e.target.value)
	}

	const handleChangeDesc = (e) => {
		const value = e.target.value.replace(/\r?\n/g, '<p><br></p>')
		setDescription(value)
	}

	const handleAddSize = (e) => {
		if (e.target.value.startsWith(' ')) return
		if (!e.target.value.trim()) return

		if (e.key === 'Enter') {
			const newSizes = [...sizes]
			newSizes.push(e.target.value.toUpperCase())
			const arr = new Set([...newSizes])
			setSizes(Array.from(arr))
			e.target.value = ''
		}
	}

	const handleDeleteSize = (i) =>
		setSizes(sizes.filter((_, index) => index !== i))

	const handleChangeImages = (e) => {
		const files = e.target.files
		setFiles(files)

		const arr = []
		for (const file of files) {
			const url = URL.createObjectURL(file)
			arr.push(url)
		}
		setPreviews(arr)
	}

	const handleUpload = async (e) => {
		e.preventDefault()
		setLoading(true)
		const arr = []
		const length = files.length

		// Ki???m tra t??n v?? m?? t???
		if (name.trim().length < 10) {
			setLoading(false)
			toast.error('T??n s???n ph???m ph???i l???n h??n 10 k?? t???')
			return
		} else if (description.trim().length < 30) {
			setLoading(false)
			toast.error('M?? t??? s???n ph???m ph???i l???n h??n 30 k?? t???')
			return
		} else if (length === 0) {
			setLoading(false)
			toast.error('Vui l??ng ch???n ??t nh???t 1 h??nh ???nh!')
			return
		} else if (length < 5) {
			setLoading(false)
			toast.error('Vui l??ng ch???n ??t nh???t 5 h??nh ???nh!')
			return
		}

		if (!price.trim() || !discount.trim() || !productCount.trim()) {
			setLoading(false)
			toast.error('Vui l??ng nh???p ?????y ????? th??ng tin!')
			return
		} else if (
			!/^\d+$/.test(price) ||
			!/^\d+$/.test(discount) ||
			!/^\d+$/.test(productCount)
		) {
			setLoading(false)
			toast.error(
				'Gi??, gi???m gi??, s??? l?????ng s???n ph???m ph???i l?? s??? v?? li???n nhau!'
			)
			return
		} else if (parseInt(price) <= 0 || parseInt(productCount) <= 0) {
			setLoading(false)
			toast.error('Gi?? v?? s??? l?????ng s???n ph???m kh??ng ???????c nh??? h??n 0!')
			return
		} else if (parseInt(discount) >= 100) {
			setLoading(false)
			toast.error('Gi???m gi?? kh??ng ???????c l???n h??n 100!')
			return
		}

		const id = toast.loading('??ang s???n ph???m c???a b???n! Vui l??ng ?????i ...')
		const slug = await uniqueSlug({
			path: 'products',
			field: 'slug',
			value: name,
		})

		for (const file of files) {
			const data = {}
			const storageRef = ref(storage, `images/${uuidv4()}`)

			await uploadBytes(storageRef, file).then((snapshot) => {
				toast.update(id, {
					render: `??ang t???i l??n h??nh ???nh ${Math.round(
						((arr.length + 1) / length) * 100
					)}%`,
				})
				data.path = snapshot.metadata.fullPath
			})

			const url = await getDownloadURL(storageRef)
			data.url = url

			arr.push(data)
		}

		const customId = uuidv4()
		await setDoc(doc(db, 'products', customId), {
			id: customId,
			slug,
			name,
			description,
			images: arr,
			price: parseInt(price),
			discount: parseInt(discount),
			productCount: parseInt(productCount),
			sizes,
			soldCount: 0,
			isFavorite: false,
			rating: [],
			comments: [],
			likes: [],
			authorId: user.uid,
			createdAt: new Date().getTime(),
		})
			.then(() => {
				toast.update(id, {
					render: 'T???i s???n ph???m l??n th??nh c??ng!',
					type: 'success',
					autoClose: 4000,
					isLoading: false,
				})

				dispatch(
					updateData({
						recent: {
							...user.recent,
							shop: [
								...user.recent.shop,
								{
									id: customId,
									value: `T???i s???n ph???m ${name}`,
								},
							],
						},
					})
				)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				toast.dismiss(id)
				setLoading(false)
				setName('')
				setDescription('')
				setPrice(0)
				setDiscount(0)
				setProductCount(0)
				setFiles([])
				setPreviews([])
				setSizes([])
			})
	}

	const inputClass =
		'block max-w-[400px] py-2 px-3 border rounded-full text-lg font-semibold outline-none focus:bg-gray-200 transition'

	if (loading) return <Loading />

	return (
		<>
			<div
				className={`sticky inset-x-0 top-0 z-20 flex items-center justify-between h-[64px] px-4 md:px-7 bg-white border-b`}>
				<Link
					to='/'
					className='flex items-center gap-1 text-gray-400 transition hover:text-gray-700'
					onMouseOver={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}>
					{isHover ? <AiOutlineDoubleLeft /> : <AiOutlineLeft />}

					<span
						className={clsx(
							'block font-semibold uppercase transition',
							{
								'translate-x-2': isHover,
							}
						)}>
						Quay l???i
					</span>
				</Link>
				<div>
					<button
						className='flex items-center gap-3 btn btn-secondary'
						onClick={handleUpload}>
						<AiOutlineCloudUpload size='1.4em' />
						<span className='uppercase'>t???i l??n</span>
					</button>
				</div>
			</div>
			<main className='flex flex-col gap-4 h-[calc(100vh-64px)] p-4 md:px-7  md:flex-row'>
				<div className='flex-1 flex flex-col gap-5 md:pr-4 md:border-r-2'>
					<TextareaAutosize
						cacheMeasurements
						className='shrink-0 block w-full font-bold text-xl md:text-2xl outline-none resize-none overflow-hidden bg-white'
						placeholder='T??n s???n ph???m'
						spellCheck='false'
						maxLength={300}
						value={name}
						onChange={handleChangeName}
					/>

					<TextareaAutosize
						cacheMeasurements
						className='shrink-0 block w-full bg-white text-gray-500 outline-none resize-none overflow-hidden'
						placeholder='M?? t??? s???n ph???m'
						minRows={10}
						spellCheck='false'
						onChange={handleChangeDesc}
					/>

					<div className='flex flex-col gap-3'>
						<div className='border max-w-[400px] p-2 rounded-md'>
							{sizes.length > 0 && (
								<div className='flex items-center flex-wrap gap-3 overflow-hidden mb-2'>
									{sizes.map((s, i) => (
										<div
											key={uuidv4()}
											className='flex items-center gap-2 w-fit p-1 px-2 bg-gray-200 rounded-full'>
											<span className='overflow-hidden font-bold break-words'>
												{s}
											</span>
											<button
												onClick={() =>
													handleDeleteSize(i)
												}>
												<IoClose />
											</button>
										</div>
									))}
								</div>
							)}

							<input
								type='text'
								className='block w-full text-lg outline-none bg-transparent rounded-md'
								placeholder='Nh???p v?? enter (Size)'
								maxLength={4}
								onKeyDown={handleAddSize}
							/>
						</div>

						<input
							type='text'
							className={inputClass}
							placeholder='S??? l?????ng s???n ph???m'
							value={productCount}
							onChange={(e) => setProductCount(e.target.value)}
						/>

						<input
							type='text'
							className={inputClass}
							placeholder='Gi?? s???n ph???m (??)'
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>

						<input
							type='text'
							className={inputClass}
							placeholder='Gi???m gi?? (%)'
							value={discount}
							onChange={(e) => setDiscount(e.target.value)}
						/>
					</div>
				</div>
				<div className='shrink-0 md:sticky md:top-[80px] md:bottom-0 md:right-0 w-full max-w-[300px] mx-auto'>
					<button
						className='flex items-center justify-center w-full h-full max-h-[200px] border-2 border-gray-500 border-dashed p-4 rounded-md focus:border-indigo-500'
						onClick={() => inputRef.current.click()}>
						<FcAddImage size='2.5em' />
					</button>

					<input
						ref={inputRef}
						type='file'
						className='hidden'
						onChange={handleChangeImages}
						accept='image/*'
						multiple
					/>

					{previews.length > 0 && (
						<div className='grid grid-cols-3 gap-3 mt-3'>
							{previews.map((preview) => (
								<div key={uuidv4()}>
									<img
										src={preview}
										alt={preview}
										className='block w-full h-16 rounded-md object-cover'
									/>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</>
	)
}

export default memo(Upload)
