import { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FaEdit, FaTrash, FaCopy } from 'react-icons/fa'
import { HiOutlineMenuAlt3, HiOutlineMenuAlt2 } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { useSpring, animated } from 'react-spring'
import { v4 as uuidv4 } from 'uuid'

import { updateData } from '~/store/reducers/userSlice'
import { doc, db, deleteDoc, deleteObject, ref, storage } from '~/config'
import { formatPrice } from '~/utils'
import Image from '~/components/Image'

function PostItem({ post, user, setLoading, fetchData }) {
	const [on, setOn] = useState(false)
	const toggle = () => setOn(!on)
	const dispatch = useDispatch()

	const { opacity, x } = useSpring({
		opacity: on ? 1 : 0,
		x: on ? 0 : 100,
	})

	const handleDelete = async () => {
		setLoading(true)
		const id = toast.loading('Đang xoá...')
		await deleteDoc(doc(db, 'products', post.id))

		for (let i = 0; i < post.images.length; i++) {
			await deleteObject(ref(storage, post.images[i].path)).then(() => {
				toast.update(id, {
					render: `Đã xoá ${i + 1}/${post.images.length} ảnh`,
				})
			})
		}

		dispatch(
			updateData({
				recent: {
					...user.recent,
					shop: [
						...user.recent.shop,
						{
							id: uuidv4(),
							value: `Xóa sản phẩm ${post.name}`,
						},
					],
				},
			})
		)

		fetchData()

		toast.update(id, {
			render: 'Đã xoá thành công',
			type: 'success',
			autoClose: 3000,
			isLoading: false,
		})
		setLoading(false)
	}

	const handleCopy = () => {
		// copy to clipboard post.id
		dispatch(
			updateData({
				recent: {
					...user.recent,
					shop: [
						...user.recent.shop,
						{
							id: uuidv4(),
							value: `Sao chép ID sản phẩm ${post.name}`,
						},
					],
				},
			})
		)

		navigator.clipboard.writeText(post.id)
		toast.info('Đã sao chép ID sản phẩm')
	}

	return (
		<div className='flex max-w-[600px]'>
			<div className='relative flex items-center gap-3 p-2 pr-6 border overflow-hidden'>
				<div className='shrink-0'>
					<Image
						src={post.images[0].url}
						alt=''
						className='block w-20 h-20 object-cover rounded-sm'
					/>
				</div>

				<div className='flex-1 overflow-hidden'>
					<h4 className='font-bold break-words line-clamp-2 leading-none'>
						{post.name}
					</h4>
					<div className='text-sm line-clamp-1'>ID: {post.id}</div>
					<div className='flex items-center justify-between flex-wrap text-sm'>
						<div>Giá: {formatPrice(post.price)} đ</div>
						<div>Đã bán {post.soldCount}</div>
					</div>
				</div>
				<div className='absolute top-0 right-0'>
					<button
						onClick={toggle}
						className='block p-1 rounded-bl-sm hover:bg-gray-200 transition'>
						{on ? (
							<HiOutlineMenuAlt2 size={'1.2em'} />
						) : (
							<HiOutlineMenuAlt3 size={'1.2em'} />
						)}
					</button>
				</div>
			</div>

			<animated.div
				className='flex flex-col justify-between items-center bg-gray-200'
				style={{
					transform: x.to((x) => `translate3d(${x * -1}%,0,0)`),
					opacity,
					visibility: opacity.to((o) =>
						o < 0.2 ? 'hidden' : 'visible'
					),
				}}>
				<button
					className='block p-2 hover:bg-amber-500 hover:text-white transition'
					onClick={handleCopy}>
					<FaCopy />
				</button>
				<button className='block p-2 hover:bg-blue-500 hover:text-white transition'>
					<FaEdit />
				</button>
				<button
					className='block p-2 hover:bg-red-500 hover:text-white transition'
					onClick={handleDelete}>
					<FaTrash />
				</button>
			</animated.div>
		</div>
	)
}

export default memo(PostItem)
