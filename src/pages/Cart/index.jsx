import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { MdOutlinePayment } from 'react-icons/md'
import { toast } from 'react-toastify'
import { animated, useSpring, config } from 'react-spring'
import { v4 as uuidv4 } from 'uuid'

import { doc, db, setDoc } from '~/config'
import { userSelector, setData } from '~/store/reducers/userSlice'
import { formatPrice, priceAfterDiscount } from '~/utils'
import Loading from '~/components/Loading'
import CartItem from './CartItem'
import Empty from '~/components/Empty'
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
					Đang có {user.cart.length} sản phẩm
				</div>

				<div className='flex items-center gap-2 sm:text-xl'>
					<div>Tổng mua:</div>
					<div className='text-red-500 font-semibold'>
						đ{' '}
						<animated.span className='text-red-500 font-semibold'>
							{number.to((n) => formatPrice(n.toFixed(0)))}
						</animated.span>
					</div>
				</div>

				<Link
					to='/checkout'
					className='flex items-center gap-3 py-2 px-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition'>
					<MdOutlinePayment size='1.4em' />
					<span>Thanh toán</span>
				</Link>
			</div>

			{user.cart.length === 0 && <Empty src={images.emptyCart} />}

			{user.cart.length > 0 && (
				<div className='flex flex-col gap-7'>
					{user.cart.map((item) => (
						<CartItem
							key={item.id}
							data={item}
							handleDelete={handleDelete}
						/>
					))}
				</div>
			)}
		</>
	)
}

export default memo(Cart)
