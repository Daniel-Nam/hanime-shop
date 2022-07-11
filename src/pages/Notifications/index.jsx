import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import clsx from 'clsx'

import { doc, db, updateDoc } from '~/config'
import { userSelector, updateData } from '~/store/reducers/userSlice'
import { formatDate } from '~/utils'

export default function Notifications() {
	const user = useSelector(userSelector)
	const dispatch = useDispatch()

	const handleRead = (data) => {
		const { id, read } = data
		if (read) return

		const newNotifications = user.notifications.map((notify) => {
			if (notify.id === id) {
				return {
					...notify,
					read: true,
				}
			}

			return notify
		})

		updateDoc(doc(db, 'users', user.uid), {
			notifications: newNotifications,
		})
			.then(() => {
				dispatch(updateData({ notifications: newNotifications }))
				toast.success('Đã đọc thông báo!')
			})
			.catch((err) => console.log(err.message))
	}

	return (
		<>
			<p className='font-semibold text-xl text-indigo-500 mb-4'>
				Bấm vào tin nhắn cho chúng tôi biết bạn đã đọc. Cảm ơn!
			</p>
			<div>
				{user.notifications.length === 0
					? 'Không có tin nhắn nào'
					: // sắp sếp theo createdAt
					  user.notifications
							.sort((a, b) => b.createdAt - a.createdAt)
							.map((notify) => (
								<div
									key={notify.id}
									onClick={() => handleRead(notify)}
									className={clsx(
										'max-w-[600px] p-2 border rounded-md hover:scale-105 transition',
										{
											'bg-gray-100': notify.read,
										}
									)}>
									<div className='md:text-lg font-semibold'>
										{notify.text}
									</div>
									<div className='flex items-center justify-between flex-wrap'>
										<span className='text-sm text-gray-500'>
											{formatDate(notify.createdAt)}
										</span>
										<span className='text-sm md:text-base'>
											{notify.sender}
										</span>
									</div>
								</div>
							))}
			</div>
		</>
	)
}
