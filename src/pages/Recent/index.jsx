import { memo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AiOutlineHistory } from 'react-icons/ai'
import { IoCloseCircle } from 'react-icons/io5'

import { userSelector, updateData } from '~/store/reducers/userSlice'
import { doc, updateDoc, db } from '~/config'

function Recent() {
	const user = useSelector(userSelector)
	const dispatch = useDispatch()

	const handleUpdate = (data) => {
		dispatch(updateData({ recent: data }))
		updateDoc(doc(db, 'users', user.uid), {
			recent: data,
		})
	}

	const arr = [
		{
			id: 1,
			title: 'tìm kiếm',
			data: user.recent.search,
			handleClick: (id) => {
				const newRecent = {
					...user.recent,
					search: user.recent.search.filter((item) => item.id !== id),
				}

				handleUpdate(newRecent)
			},
		},
		{
			id: 2,
			title: 'đánh dấu',
			data: user.recent.bookmarks,
			handleClick(id) {
				const newRecent = {
					...user.recent,
					bookmarks: user.recent.bookmarks.filter(
						(item) => item.id !== id
					),
				}

				handleUpdate(newRecent)
			},
		},
		{
			id: 3,
			title: 'giỏ hàng',
			data: user.recent.cart,
			handleClick: (id) => {
				const newRecent = {
					...user.recent,
					cart: user.recent.cart.filter((item) => item.id !== id),
				}

				handleUpdate(newRecent)
			},
		},
		{
			id: 4,
			title: 'trang cá nhân',
			data: user.recent.profile,
			handleClick: (id) => {
				const newRecent = {
					...user.recent,
					profile: user.recent.profile.filter(
						(item) => item.id !== id
					),
				}

				handleUpdate(newRecent)
			},
		},
		{
			id: 5,
			title: 'cửa hàng',
			data: user.recent.shop,
			handleClick: (id) => {
				const newRecent = {
					...user.recent,
					shop: user.recent.shop.filter((item) => item.id !== id),
				}

				handleUpdate(newRecent)
			},
		},
	]

	return (
		<div>
			<div className='flex items-center gap-3'>
				<AiOutlineHistory size='1.5em' />
				<h1 className='font-bold text-2xl'>Các hoạt động gần đây</h1>
			</div>
			<div className='flex flex-col gap-5 mt-5'>
				{arr.map((item) => (
					<div key={item.id}>
						<div className='first-letter:uppercase text-lg font-semibold mb-1'>
							{item.title}
						</div>
						<div className='flex items-center flex-wrap gap-3'>
							{item.data.map((child) => (
								<div
									key={child.id}
									className='flex items-center justify-center gap-1 w-fit py-1 px-3 border bg-gray-100 rounded-full'>
									<span className='text-sm sm:text-base'>
										{child.value}
									</span>
									<button
										className='text-gray-700 hover:text-red-500 transition'
										onClick={() =>
											item.handleClick(child.id)
										}>
										<IoCloseCircle size='1.2em' />
									</button>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default memo(Recent)
