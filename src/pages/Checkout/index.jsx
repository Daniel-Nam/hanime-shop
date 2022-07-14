import { memo } from 'react'
import { FaRegCreditCard } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { userSelector } from '~/store/reducers/userSlice'
import { formatPrice, priceAfterDiscount } from '~/utils'
import { toast } from 'react-toastify'
import Image from '~/components/Image'
import FormGroup from './FormGroup'

function Checkout() {
	const user = useSelector(userSelector)
	const info = [
		{ label: 'Họ tên', name: 'name', data: user.displayName },
		{ label: 'Số điện thoại', name: 'phone', data: user.phoneNumber },
		{ label: 'Email', name: 'email', data: user.email },
		{ label: 'Địa chỉ', name: 'address', data: user.address },
		{
			label: 'Ngày thanh toán',
			name: 'date',
			type: 'date',
			data: new Date().toISOString().split('T')[0],
			disabled: true,
		},
		{ label: 'Thẻ tín dụng', name: 'card', data: '' },
		{ label: 'Mã CVV', name: 'cvv', data: '' },
		{ label: 'Căn cước công dân', name: 'cccd', data: '' },
	]

	const handleSubmit = () => {
		if (user.cart.length === 0) {
			toast.error('Giỏ hàng trống!')
			return
		}
	}

	return (
		<div className='flex flex-col gap-5 py-5 px-3 max-w-5xl mx-auto'>
			<header className='text-center'>
				<FaRegCreditCard size='3em' className='mx-auto' />
				<h1 className='text-3xl font-bold'>Thanh toán</h1>
				<p className='text-lg font-semibold'>
					Vui lòng kiểm tra thông tin Khách hàng, thông tin Giỏ hàng
					trước khi đặt hàng.
				</p>
			</header>

			<div>
				<div className='text-xl font-bold'>Thông tin khách hàng</div>
				<div>
					{info.map((item) => (
						<FormGroup key={item.name} {...item} />
					))}
				</div>
			</div>
			<div>
				<div className='text-xl font-bold'>
					Vỏ hàng ({user.cart.length})
				</div>

				<div className='my-2'>
					<span className='text-lg font-bold'>Tổng tiền: </span>
					<span>
						{formatPrice(
							user.cart.reduce(
								(acc, cur) =>
									acc +
									priceAfterDiscount(
										cur.price,
										cur.discount
									) *
										cur.count,
								0
							)
						)}
						₫
					</span>
				</div>

				<div>
					{user.cart.map((item) => (
						<div
							key={item.id}
							className='flex justify-between p-2 rounded-sm bg-cream border'>
							<div className='flex items-center gap-3'>
								<div className='shrink-0'>
									<Image
										src={item.images[0].url}
										alt={item.name}
										className='w-16 h-16 object-cover rounded-sm'
									/>
								</div>
								<div>
									<div className='text-lg font-bold'>
										{item.name}
									</div>
									<div className='font-semibold text-rose-500'>
										{formatPrice(item.price)}₫ x{' '}
										{item.count}
									</div>
								</div>
							</div>
							<div className='font-semibold'>
								{formatPrice(
									priceAfterDiscount(
										item.price,
										item.discount
									) * item.count
								)}
								₫
							</div>
						</div>
					))}
				</div>
			</div>

			<button
				className='btn btn--full btn-primary'
				onClick={handleSubmit}>
				Đặt hàng
			</button>
		</div>
	)
}

export default memo(Checkout)
