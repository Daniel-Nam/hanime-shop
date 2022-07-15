import { memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AiFillHome, AiOutlineHistory } from 'react-icons/ai'
import { FaShoppingCart } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'
import { BiCloudUpload } from 'react-icons/bi'
import { BsShop } from 'react-icons/bs'

import { userSelector, setData } from '~/store/reducers/userSlice'
import { auth, signOut } from '~/config'
import images from '~/assets/images'
import Search from './Search'
import Actions from './Actions'
import MobileMenu from './Mobile'

function Header() {
	const user = useSelector(userSelector)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleSignOut = async () => {
		signOut(auth)
			.then(() => {
				navigate('/login')
				dispatch(setData(null))
			})
			.catch((err) => console.log(err.message))
	}

	const links = {
		default: [
			{ path: '/', text: 'Trang chủ', icon: <AiFillHome /> },
			{ path: '/profile', text: 'Trang cá nhân', icon: <ImProfile /> },
			{
				path: '/recent',
				text: 'Hoạt động gần đây',
				icon: <AiOutlineHistory />,
			},
			{ path: '/cart', text: 'Giỏ hàng', icon: <FaShoppingCart /> },
		],
		seller: [
			{
				path: '/shop',
				text: 'Cửa hàng của tôi',
				icon: <BsShop />,
			},
			{
				path: '/upload',
				text: 'Đăng sản phẩm',
				icon: <BiCloudUpload size='1.2em' />,
			},
		],
	}

	const settings = {
		user,
		links,
		handleSignOut,
	}

	return (
		<header className='sticky top-0 inset-x-0 z-20 flex items-center h-16 px-4 md:px-7 border-b bg-white'>
			{/* Logo and Web Name */}
			<div className='hidden flex-1 md:flex items-center gap-3'>
				<Link to='/'>
					<img
						src={images.logo}
						alt='Logo'
						className='w-10 object-cover rounded-full'
					/>
				</Link>
				<h1 className='uppercase text-lg font-semibold'>hanime shop</h1>
			</div>

			<MobileMenu {...settings} />
			<Search dispatch={dispatch} />
			<Actions {...settings} />
		</header>
	)
}

export default memo(Header)
