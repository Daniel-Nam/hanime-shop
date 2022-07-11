import { Link } from 'react-router-dom'

export default function NotFound() {
	return (
		<div className='form-container'>
			<div className='text-center'>
				<h1 className='text-9xl text-white font-bold'>404</h1>
				<h2 className='text-white text-3xl font-semibold mb-5'>
					Oops! Xin lỗi, Không tìm thấy trang
				</h2>
				<Link to='/' className='btn btn-primary text-lg rounded-3xl'>
					Quay về trang chủ
				</Link>
			</div>
		</div>
	)
}
