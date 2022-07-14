import { memo } from 'react'
import { FaRegCreditCard } from 'react-icons/fa'
import FormGroup from './FormGroup'

function Checkout() {
	return (
		<div className='py-5 px-3 max-w-5xl mx-auto'>
			<header className='text-center mb-3'>
				<FaRegCreditCard size='3em' className='mx-auto' />
				<h1 className='text-3xl font-bold'>Thanh toán</h1>
				<p className='text-lg font-semibold'>
					Vui lòng kiểm tra thông tin Khách hàng, thông tin Giỏ hàng
					trước khi đặt hàng.
				</p>
			</header>
			<div>
				<div>
					<div className='text-xl font-bold'>
						Thông tin khách hàng
					</div>
				</div>
				<div>
					<FormGroup />
					<FormGroup />
					<FormGroup />
					<FormGroup />
					<FormGroup />
				</div>
			</div>
		</div>
	)
}

export default memo(Checkout)
