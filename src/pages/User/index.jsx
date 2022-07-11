import { useState, useEffect, memo } from 'react'
import { useParams } from 'react-router-dom'
import { BsPatchCheckFill } from 'react-icons/bs'
import { MdAdminPanelSettings } from 'react-icons/md'

import { db, getDocs, collection, where, query } from '~/config'
import { formatDate, renderIcons } from '~/utils'
import Loading from '~/components/Loading'
import Image from '~/components/Image'

function User() {
	const { username } = useParams()
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const getUser = async () => {
			const q = query(
				collection(db, 'users'),
				where('username', '==', username)
			)
			await getDocs(q)
				.then((querySnapShot) => {
					querySnapShot.forEach((doc) => {
						if (doc.exists()) {
							const { displayName, username } = doc.data()
							document.title = `${displayName} (${username})`
							setUser(doc.data())
						} else {
							console.log('User not found')
						}
					})
				})
				.catch((err) => console.log(err))
			if (isLoading) return setIsLoading(false)
		}
		getUser()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username])

	if (isLoading) return <Loading />

	return (
		<div>
			<div className='relative'>
				<div>
					<Image
						src={user.backgroundURL}
						alt=''
						className='w-full max-h-[320px] rounded-sm object-cover select-none'
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
					<div className='self-end md:-translate-y-3'>
						{/* display name  */}
						<div className='flex items-center gap-2'>
							<h1 className='text-lg md:text-2xl font-bold line-clamp-2'>
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
						<span className='text-lg md:text-xl text-gray-500 font-semibold'>
							@{user.username}
						</span>
					</div>
				</div>
			</div>
			<div className='flex flex-col gap-2 mt-[100px]'>
				<h3 className='text-2xl font-bold'>Thông tin</h3>
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
				<div>UID: {user.uid}</div>
				<div>
					Địa chỉ: {user.address ? user.address : 'Chưa cập nhật'}
				</div>
				<div>Tạo vào lúc: {formatDate(user.createdAt)}</div>
			</div>
			<div className='mt-7'>
				<h3 className='text-2xl font-bold'>Mạng xã hội</h3>
				<div className='flex items-center gap-4 flex-wrap my-4'>
					{user.socials.map((item) => (
						<div
							key={item.id}
							className='flex items-center gap-3 py-2 px-3 border rounded-sm max-w-fit'>
							<div>{renderIcons(item.name)}</div>
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

export default memo(User)
