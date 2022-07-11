import { memo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BiSearch } from 'react-icons/bi'
import { BsBellFill } from 'react-icons/bs'
import { toast } from 'react-toastify'

import Image from '~/components/Image'
import Divider from '~/components/Divider'
import MenuItem from './MenuItem'

function Actions({ user, links, handleSignOut }) {
	const [isOpen, setIsOpen] = useState(false)
	const navigate = useNavigate()

	const handleSearch = () => {
		const q = window.prompt('Tìm kiếm người dùng, sản phẩm,...')

		if (q && q.trim().length >= 3) {
			navigate(`/search/${encodeURIComponent(q)}`)
			return
		} else if (q && q.trim().length < 3) {
			toast.error('Từ khóa tìm kiếm phải có ít nhất 3 ký tự!')
		}
	}

	const handleClick = (e) => {
		if (!e.target.classList.contains('animate-drop')) {
			setIsOpen(false)
		}
	}

	const LoginButton = () => {
		return (
			<Link
				to='/login'
				className='btn btn-secondary btn--rounded text-sm md:text-base'>
				Đăng nhập
			</Link>
		)
	}

	const Menu = () => {
		return (
			<div className='hidden sm:block relative'>
				<div
					onClick={(e) => {
						e.stopPropagation()
						setIsOpen(!isOpen)
					}}>
					<Image
						src={user.photoURL}
						alt=''
						className='w-8 h-8 cursor-pointer object-cover rounded-full'
					/>
				</div>

				{isOpen && (
					<div className='animate-drop absolute top-full right-0 translate-y-2 min-w-[200px] py-3 px-5 bg-white border rounded-lg shadow-xl'>
						{links.default.map((link) => (
							<MenuItem
								key={link.path}
								path={link.path}
								text={link.text}
							/>
						))}

						<Divider />

						{user.isSeller && (
							<div>
								{links.seller.map((link) => (
									<MenuItem
										key={link.path}
										path={link.path}
										text={link.text}
									/>
								))}

								<Divider />
							</div>
						)}

						<MenuItem path='/settings' text='Cài đặt' />
						<div
							onClick={handleSignOut}
							className='cursor-pointer text-red-500 hover:text-red-700 transition'>
							Đăng xuất
						</div>
					</div>
				)}
			</div>
		)
	}

	useEffect(() => {
		document.addEventListener('click', handleClick)
		return () => document.removeEventListener('click', handleClick)
	}, [isOpen])

	return (
		<div className='flex-1 flex items-center justify-end gap-5'>
			<button className='sm:hidden' onClick={handleSearch}>
				<BiSearch size='1.2em' />
			</button>

			{user && (
				<Link
					to='/notifications'
					className='relative hover:scale-105 transition'>
					<BsBellFill size='1.2em' />
					{user.notifications.filter((n) => !n.read).length > 0 && (
						<div className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full shadow shadow-red-500/50'></div>
					)}
				</Link>
			)}

			{user ? <Menu /> : <LoginButton />}
		</div>
	)
}

export default memo(Actions)
