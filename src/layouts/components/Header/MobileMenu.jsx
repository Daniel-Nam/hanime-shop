import { memo, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { animated, useSpring } from 'react-spring'
import { BiMenu, BiLogIn } from 'react-icons/bi'
import { TbLogin } from 'react-icons/tb'
import { AiFillSetting } from 'react-icons/ai'
import { GiUpgrade } from 'react-icons/gi'
import { v4 as uuidv4 } from 'uuid'

import Divider from '~/components/Divider'

function MobileMenu({ links, user, handleSignOut }) {
	const [on, setOn] = useState(false)
	const toggle = () => setOn(!on)
	const { opacity, x } = useSpring({
		opacity: on ? 1 : 0,
		x: on ? 0 : 100,
	})

	return (
		<div className='flex-1 md:hidden'>
			<button
				className='flex items-center justify-center p-1 border-2 border-transparent focus:border-gray-700 rounded-sm transition'
				onClick={toggle}>
				<BiMenu size='1.4em' />
			</button>
			<animated.div
				className='absolute top-16 left-0 flex flex-col gap-3 w-full h-[calc(100vh-64px)] pt-4 pl-4 bg-white'
				style={{
					transform: x.to((x) => `translate3d(${x * -1}%,0,0)`),
					opacity,
				}}>
				{!user && (
					<div>
						<Link
							to='/login'
							className='flex items-center gap-2 text-lg p-2'>
							<BiLogIn />
							<span>Đăng nhập</span>
						</Link>

						<Divider />
					</div>
				)}

				{links.default.map((link) => (
					<NavLink
						key={uuidv4()}
						to={link.path}
						className={({ isActive }) => {
							return `flex items-center gap-2 text-lg p-2 rounded-tl-md rounded-bl-md ${
								isActive
									? 'text-white bg-gray-700'
									: 'text-gray-700'
							}`
						}}>
						{link.icon}
						<span>{link.text}</span>
					</NavLink>
				))}

				{user && !user.isSeller && (
					<NavLink
						to='/upgrade-to-seller'
						className={({ isActive }) => {
							return `flex items-center gap-2 text-lg p-2 rounded-tl-md rounded-bl-md ${
								isActive
									? 'text-white bg-gray-700'
									: 'text-gray-500'
							}`
						}}>
						<GiUpgrade />
						<span>Trở thành người bán</span>
					</NavLink>
				)}

				{user && user.isSeller && (
					<div className='flex flex-col gap-3'>
						<Divider />
						{links.seller.map((link) => (
							<NavLink
								to={link.path}
								key={uuidv4()}
								className={({ isActive }) => {
									return `flex items-center gap-2 text-lg p-2 rounded-tl-md rounded-bl-md ${
										isActive
											? 'text-white bg-gray-700'
											: 'text-gray-700'
									}`
								}}>
								{link.icon}
								<span>{link.text}</span>
							</NavLink>
						))}
					</div>
				)}

				<Divider />
				<NavLink
					to='/settings'
					className={({ isActive }) => {
						return `flex items-center gap-2 text-lg p-2 rounded-tl-md rounded-bl-md ${
							isActive
								? 'text-white bg-gray-700'
								: 'text-gray-700'
						}`
					}}>
					<AiFillSetting />
					<span>Cài đặt</span>
				</NavLink>

				{user && (
					<button
						onClick={handleSignOut}
						className='flex items-center gap-2 p-2 text-lg text-red-500 hover:text-red-700 transition'>
						<TbLogin size='1.5em' />
						<span>Đăng xuất</span>
					</button>
				)}
			</animated.div>
		</div>
	)
}

export default memo(MobileMenu)
