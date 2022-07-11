import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import { db, doc, setDoc, getDoc, storage, ref, getDownloadURL } from '~/config'
import { uniqueSlug } from '~/utils'
import Providers from './Providers'
import images from '~/assets/images'

export default function Register() {
	const navigate = useNavigate()
	const [err, setErr] = useState('')
	const [backgroundURL, setBackgroundURL] = useState('')

	useEffect(() => {
		getDownloadURL(ref(storage, 'profiles/background.webp'))
			.then((url) => setBackgroundURL(url))
			.catch((err) => console.log(err.message))
	}, [])

	const handleAuth = async (user) => {
		const id = toast.loading(
			'Đang kiểm tra đăng ký, vui lòng đợi một chút...'
		)

		const docRef = doc(db, 'users', user.uid)
		const docSnap = await getDoc(docRef)

		// ! nếu đã có tài khoản thì chỉ đăng nhập
		if (docSnap.exists()) {
			setErr(null)

			toast.update(id, {
				render: 'Đăng nhập thành công!',
				type: 'success',
				isLoading: false,
			})

			setTimeout(() => {
				toast.dismiss(id)
				navigate('/')
			}, 3000)

			return
		}

		// ! Trường hợp chưa có tài khoản
		// ? kiểm tra xem có slug đã tồn tại hay chưa
		if (backgroundURL === '') {
			toast.warn('Đang tải hình nền... Vui lòng tạo tài khoản lại!')
			toast.dismiss(id)
			return
		}

		toast.update(id, { render: 'Chưa có tài khoản, bắt đầu tạo...' })

		const username = await uniqueSlug({
			path: 'users',
			field: 'username',
			value: user.displayName,
		})
		const createdAt = new Date().getTime()

		await setDoc(doc(db, 'users', user.uid), {
			uid: user.uid,
			email: user.email,
			photoURL: user.photoURL,
			displayName: user.displayName,
			providerId: user.providerId,
			createdAt,
			backgroundURL,
			username,
			isTrusted: false,
			isSeller: false,
			isAdmin: false,
			email_alt: '',
			address: '',
			phoneNumber: '',
			bio: '',
			recent: {
				search: [],
				bookmarks: [],
				cart: [],
				profile: [],
				shop: [],
			},
			followers: [],
			following: [],
			likes: [],
			comments: [],
			bookmarks: [],
			cart: [],
			notifications: [
				{
					id: uuidv4(),
					text: 'Chào mừng bạn đến với Hanime-Shop 🎉',
					sender: 'hanime-shop',
					createdAt,
					read: false,
				},
			],
			socials: [
				{
					id: uuidv4(),
					name: 'website',
					url: '',
				},
				{
					id: uuidv4(),
					name: 'youtube',
					url: '',
				},
				{
					id: uuidv4(),
					name: 'facebook',
					url: '',
				},
				{
					id: uuidv4(),
					name: 'twitter',
					url: '',
				},
				{
					id: uuidv4(),
					name: 'github',
					url: '',
				},
			],
		})
			.then(() => {
				setErr(null)

				toast.update(id, {
					render: 'Đã tạo tài khoản thành công!',
					type: 'success',
					isLoading: false,
				})

				setTimeout(() => {
					toast.dismiss(id)
					navigate('/')
					window.location.reload()
				}, 3000)
			})
			.catch((err) => handleError(err.message))
	}

	const handleError = (msg) => {
		setErr(msg)
		toast.error(msg)
	}

	return (
		<div className='form-container'>
			<form
				action=''
				autoComplete='off'
				className='form'
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
						Đăng ký tài khoản Hanime Shop
					</h1>

					{err && <div className='text-red-500'>{err}</div>}
				</header>

				<Providers handleError={handleError} handleAuth={handleAuth} />

				<div className='text-center'>
					Bạn đã có tài khoản?{' '}
					<Link
						to='/login'
						className='text-indigo-500 font-bold hover:underline'>
						Đăng nhập
					</Link>
				</div>
			</form>
		</div>
	)
}
