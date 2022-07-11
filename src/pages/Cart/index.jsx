import { memo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MdOutlinePayment } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { animated, useSpring, config } from 'react-spring'
import { v4 as uuidv4 } from 'uuid'

import { doc, db, setDoc } from '~/config'
import { userSelector, setData } from '~/store/reducers/userSlice'
import {
	formatPrice,
	formatDate,
	priceAfterDiscount,
	calcAndFormat,
} from '~/utils'
import Loading from '~/components/Loading'
import Empty from '~/components/Empty'
import Image from '~/components/Image'
import images from '~/assets/images'

function Cart() {
	const user = useSelector(userSelector)
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)

	const { number } = useSpring({
		from: { number: 0 },
		number: user.cart.reduce(
			(acc, cur) =>
				acc + priceAfterDiscount(cur.price, cur.discount) * cur.count,
			0
		),
		delay: 200,
		config: config.molasses,
	})

	const handleDelete = async (data) => {
		setLoading(true)
		const id = toast.loading('Đang xóa...')
		const newCart = user.cart.filter((item) => item.id !== data.id)
		const newRecent = {
			...user.recent,
			cart: [
				{
					id: uuidv4(),
					value: `xoá ${data.name}`,
				},
				...user.recent.cart,
			],
		}

		await setDoc(doc(db, 'users', user.uid), {
			...user,
			cart: newCart,
			recent: newRecent,
		})
			.then(() => {
				dispatch(setData({ ...user, cart: newCart, recent: newRecent }))
				toast.update(id, {
					render: 'Đã xóa thành công!',
					type: 'success',
					isLoading: false,
					autoClose: 3000,
				})
			})
			.catch((err) => toast.error(err.message))
			.finally(() => setLoading(false))
	}

	if (loading) return <Loading />

	return (
		<>
			<div className='flex items-center justify-between flex-wrap mb-5'>
				<div className='sm:text-xl font-semibold'>
					Hiện đang có {user.cart.length} sản phẩm
				</div>
				<div className='flex items-center gap-2 sm:text-xl'>
					<div>Tổng mua:</div>
					<div className='text-red-500 font-semibold'>
						đ{' '}
						<animated.span className='text-red-500 font-semibold'>
							{/* khi chạy animation xong mới format */}
							{number.to((n) => formatPrice(n.toFixed(0)))}
						</animated.span>
					</div>
				</div>

				<button className='btn btn-secondary btn--rounded flex items-center gap-3'>
					<MdOutlinePayment size='1.4em' />
					<span>Thanh toán</span>
				</button>
			</div>

			{user.cart.length === 0 ? (
				<Empty src={images.emptyCart} />
			) : (
				<div className='flex flex-col gap-7'>
					{user.cart.map((item) => (
						<div
							key={item.id}
							className='relative flex flex-col gap-2 md:flex-row md:gap-5 p-3 border shadow-md rounded-md hover:shadow-xl transition'>
							<button
								className='absolute top-1 right-1'
								onClick={() => handleDelete(item)}>
								<IoClose size='1.4em' />
							</button>
							<div>
								<Image
									src={item.images[0]}
									alt=''
									className='w-24 h-24 md:w-32 md:h-32 rounded-full border shadow object-cover mx-auto'
								/>
							</div>
							<div className='flex-1 flex flex-col gap-1 justify-evenly text-sm md:text-base md:gap-0'>
								<div className='font-bold line-clamp-2'>
									{item.name}
								</div>
								<div>
									Mã đơn hàng:{' '}
									<span className='font-semibold'>
										{item.id}
									</span>
								</div>
								<div>
									Đặt hàng lúc: {formatDate(item.createdAt)}
								</div>
								<div className='flex items-center justify-between flex-wrap'>
									<div>
										<span>Giá: </span>
										<span className='font-bold text-red-500'>
											₫{' '}
											{calcAndFormat(
												item.price,
												item.discount
											)}
										</span>
										{item.discount > 0 && (
											<span className='font-semibold'>
												{' '}
												({item.discount}% đã giảm)
											</span>
										)}
									</div>
									<div>
										Số lượng:{' '}
										<span className='font-bold text-gray-8000'>
											{item.count}
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	)
}

export default memo(Cart)
