import { memo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { BsPatchCheckFill } from 'react-icons/bs'
import { BiCopy } from 'react-icons/bi'
import { MdAdminPanelSettings } from 'react-icons/md'

import { formatDate, formatURL } from '~/utils'
import { userSelector } from '~/store/reducers/userSlice'
import Image from '~/components/Image'
import RenderIcons from '~/components/RenderIcons'

function Profile() {
	const linkRef = useRef()
	const user = useSelector(userSelector)

	const handleCopy = (e) => {
		e.preventDefault()

		navigator.clipboard.writeText(linkRef.current.innerText)
		toast.info('Đã Sao chép liên kết')
	}

	return (
		<div>
			<div className='relative'>
				<div>
					<Image
						src={user.backgroundURL}
						alt=''
						className='w-full max-h-[360px] rounded-sm object-cover select-none'
					/>
				</div>

				<div className='absolute bottom-0 left-4 md:left-10 translate-y-1/2 flex items-center gap-4 md:gap-7'>
					<div className='shrink-0'>
						<Image
							src={user.photoURL}
							alt=''
							className='w-20 h-20 md:w-40 md:h-40 rounded-full border-2 border-white shadow-md object-cover select-none'
						/>
					</div>
					<div className='self-end translate-y-1 md:-translate-y-3'>
						{/* display name  */}
						<div className='flex items-center gap-2'>
							<h1 className='leading-none text-lg md:text-2xl font-bold line-clamp-2'>
								{user.displayName}
							</h1>
							{user.isTrusted && (
								<BsPatchCheckFill
									size='1.5em'
									className='text-blue-500'
								/>
							)}
						</div>
						{/* username */}
						<span className='md:text-lg text-gray-500 font-semibold'>
							@{user.username}
						</span>
					</div>
				</div>
			</div>
			<div className='flex flex-col gap-3 mt-[100px]'>
				<h3 className='text-2xl font-bold'>Thông tin:</h3>
				<div className='flex gap-2'>
					<div>Vai trò: </div>
					<div className='flex items-center gap-1'>
						<div>
							{user.isAdmin
								? 'Quản trị viên'
								: user.isSeller
								? 'Người bán'
								: 'Người dùng'}
						</div>
						{user.isAdmin && <MdAdminPanelSettings size='1.5em' />}
					</div>
				</div>
				<div>Bio: {user.bio ? user.bio : 'Chưa cập nhật'}</div>
				<div>
					Địa chỉ: {user.address ? user.address : 'Chưa cập nhật'}
				</div>
				<div>
					Số điện thoại:{' '}
					{user.phoneNumber ? user.phoneNumber : 'Chưa cập nhật'}
				</div>
				<div>UID: {user.uid}</div>
				<div>Email: {user.email}</div>
				<div>
					Email phụ:{' '}
					{user.email_alt ? user.email_alt : 'Chưa cập nhật'}
				</div>
				<div>Tạo vào lúc: {formatDate(user.createdAt)}</div>
				<div className='flex items-center flex-wrap gap-3'>
					<Link
						ref={linkRef}
						to={'/@' + user.username}
						className='inline-block text-lg text-blue-500'>
						{formatURL('profile', `@${user.username}`)}
					</Link>
					<button onClick={handleCopy} className='btn btn-primary'>
						<BiCopy />
					</button>
				</div>
			</div>
			<div className='mt-7'>
				<h3 className='text-2xl font-bold'>Mạng xã hội</h3>
				<div className='flex items-center gap-4 flex-wrap my-4'>
					{user.socials.map((item) => (
						<div
							key={item.id}
							className='flex items-center gap-3 py-2 px-3 border rounded-sm max-w-fit'>
							<div>
								<RenderIcons name={item.name} />
							</div>
							<div>
								{item.url ? (
									<a
										href={item.url}
										target='_blank'
										rel='noopener noreferrer'
										className='text-blue-500'>
										{item.url}
									</a>
								) : (
									'Chưa cập nhật'
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default memo(Profile)
