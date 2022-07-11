import { memo } from 'react'

function Footer() {
	return (
		<footer className='flex items-center justify-evenly flex-wrap p-4 md:px-7 text-gray-300 bg-gray-900'>
			<div>Admin: Nguyễn Hoàng Nam</div>
			<div>Email: hoangnam162007@gmail.com</div>
			<div>SĐT: 0335574737</div>
			<div>Địa chỉ: Bình Dương, Việt Nam</div>
		</footer>
	)
}

export default memo(Footer)
