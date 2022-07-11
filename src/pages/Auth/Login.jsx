import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { db, doc, getDoc } from '~/config'
import Providers from './Providers'
import images from '~/assets/images'

export default function Login() {
	const navigate = useNavigate()
	const [err, setErr] = useState('')

	const handleAuth = async (user) => {
		const id = toast.loading(
			'Đang kiểm tra đăng nhập, vui lòng đợi một chút...'
		)

		const docRef = doc(db, 'users', user.uid)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			setErr(null)

			toast.update(id, {
				render: 'Đã đăng nhập thành công, trở về trang chủ sau 3s...',
				type: 'success',
				isLoading: false,
			})

			setTimeout(() => {
				toast.dismiss(id)
				navigate('/')
			}, 3000)

			return
		}

		toast.update(id, {
			render: 'Vui lòng đăng ký tài khoản!',
			type: 'error',
			isLoading: false,
		})

		setTimeout(() => toast.dismiss(id), 3000)
	}

	const handleError = (msg) => {
		setErr(msg)
		toast.error(msg)
	}

	return (
		<div className='form-container'>
			<form
				action=''
				className='form'
				autoComplete='off'
				onSubmit={(e) => e.preventDefault()}>
				<header className='text-center'>
					<Link to='/' className='inline-block'>
						<img
							src={images.logo}
							alt=''
							className='block w-14 h-14 rounded-full object-cover'
						/>
					</Link>

					<h1 className='text-2xl font-bold'>
						Chào mừng đến với Hanime Shop
					</h1>

					{err && <div className='text-red-500'>{err}</div>}
				</header>

				<Providers handleAuth={handleAuth} handleError={handleError} />

				<div className='text-center'>
					Bạn chưa có tài khoản?{' '}
					<Link
						to='/register'
						className='text-indigo-500 font-bold hover:underline'>
						Đăng ký
					</Link>
				</div>
			</form>
		</div>
	)
}
