import { useState, useEffect, memo } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import clsx from 'clsx'

import { AiFillHome } from 'react-icons/ai'
import { BsPlus, BsBookmarkFill } from 'react-icons/bs'
import { BiCloudUpload } from 'react-icons/bi'
import { FaShoppingCart } from 'react-icons/fa'
import { GiUpgrade } from 'react-icons/gi'
import { BsShop } from 'react-icons/bs'
import { userSelector } from '~/store/reducers/userSlice'

function Sidebar() {
	const user = useSelector(userSelector)
	const [isShow, setIsShow] = useState(false)

	const pages = [
		{
			path: '/',
			name: 'Trang chủ',
			Icon: AiFillHome,
		},
		{
			path: '/bookmarks',
			name: 'Đánh dấu',
			Icon: BsBookmarkFill,
		},
		{
			path: '/cart',
			name: 'Giỏ hàng',
			Icon: FaShoppingCart,
		},
		{
			path: '/shop',
			name: 'Cửa hàng',
			Icon: BsShop,
		},
	]

	const handleClick = (e) => {
		if (!e.target.classList.contains('sidebar-dropdown')) {
			setIsShow(false)
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleClick)
		return () => document.removeEventListener('click', handleClick)
	}, [isShow])

	const SidebarItem = ({ text, path, Icon }) => {
		return (
			<Tippy content={text} placement='left' arrow={false}>
				<NavLink
					to={path}
					className={({ isActive }) =>
						clsx(
							'block p-4 transition rounded-lg hover:bg-gray-200',
							{
								'bg-gray-200': isActive,
							}
						)
					}>
					<Icon size='1.2em' />
				</NavLink>
			</Tippy>
		)
	}

	return (
		<div className='shrink-0 hidden md:block'>
			<nav className='sticky top-[64px] left-0 bottom-0 z-10 flex flex-col items-center justify-center w-[96px] gap-4 p-4'>
				<div className='relative'>
					<button
						className='p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition'
						onClick={(e) => {
							e.stopPropagation()
							setIsShow(!isShow)
						}}>
						<BsPlus size='1.5em' />
					</button>

					{isShow && (
						<div className='animate-drop sidebar-dropdown absolute top-full left-0 translate-y-2 py-3 px-5 min-w-[240px] rounded-lg bg-white border shadow-2xl'>
							<Link
								to='/upload'
								className='flex items-center gap-3 font-semibold text-gray-500 hover:text-gray-700 transition'>
								<BiCloudUpload size='1.5em' />
								<span>Tải sản phẩm lên</span>
							</Link>
						</div>
					)}
				</div>

				{pages.map((page) => (
					<SidebarItem
						key={uuidv4()}
						text={page.name}
						path={page.path}
						Icon={page.Icon}
					/>
				))}

				{user && !user.isSeller && (
					<Tippy content={'Người bán'} placement='left' arrow={false}>
						<NavLink
							to='/upgrade-to-seller'
							className={({ isActive }) =>
								clsx(
									'block p-4 transition rounded-lg hover:bg-gray-100',
									{
										'bg-gray-200': isActive,
									}
								)
							}>
							<GiUpgrade />
						</NavLink>
					</Tippy>
				)}
			</nav>
		</div>
	)
}

export default memo(Sidebar)
