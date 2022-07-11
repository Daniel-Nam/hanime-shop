import { memo } from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '~/store/reducers/userSlice'

import { toast } from 'react-toastify'
import { db, doc, deleteDoc } from '~/config'
import { handleURL } from '~/utils'
import SettingField from './SettingField'
import SettingImages from './SettingImages'

function Settings() {
	const user = useSelector(userSelector)

	const arr1 = [
		{
			title: 'họ tên',
			data: user.displayName,
			fn: 'displayName',
			desc: 'Tên của bạn xuất hiện trên trang cá nhân và bên cạnh các bình luận của bạn.',
		},
		{
			title: 'bio',
			data: user.bio,
			fn: 'bio',
			ex: 'Đây là một người thích đọc sách và có thể chia sẻ với bạn những câu chuyện đẹp về cuộc sống.',
			max: 120,
		},
		{
			title: 'tên người dùng',
			data: user.username,
			fn: 'username',
			desc: handleURL('settings', `@${user.username}`),
			isUsername: true,
		},
		{
			title: 'email',
			data: user.email,
			fn: 'email',
			desc: 'Email của bạn sẽ được sử dụng để đăng nhập vào hệ thống.',
			readOnly: true,
		},
		{
			title: 'email phụ',
			data: user.email_alt,
			fn: 'email_alt',
			ex: 'anonymous123@gmail.com',
			regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
			errorText: 'Email không hợp lệ!',
			duplicate: user.email,
		},
		{
			title: 'số điện thoại',
			data: user.phoneNumber,
			fn: 'phoneNumber',
			ex: '0987654321',
			regex: /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
			errorText: 'Số điện thoại phải đúng định dạng và là số Việt Nam',
		},
		{
			title: 'địa chỉ',
			data: user.address,
			fn: 'address',
			ex: 'Hồ Tây, Hà Nội',
		},
	]

	const arr2 = user.socials.map((item) => {
		return {
			id: item.id,
			title: item.name,
			data: item.url,
			ex: 'https://hanime-shop.web.app/',
			fn: 'socials',
			// check url
			regex: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
			errorText: 'Liên kết không hợp lệ!',
		}
	})

	const handleDeleteAccount = async () => {
		const isConfirm = window.confirm(
			'Bạn có chắc chắn muốn xóa tài khoản này?'
		)
		if (isConfirm) {
			const isCorrect = window.prompt(
				`Vui lòng nhập '${user.username}' để xác nhận `
			)

			if (isCorrect === user.username) {
				await deleteDoc(doc(db, 'users', user.uid))
					.then(() => {
						toast.success(
							'Đã xóa tài khoản, sẽ tự động đăng xuất sau 3s!'
						)
						setTimeout(() => {
							window.location.reload()
						}, 3000)
					})
					.catch((err) => {
						toast.error(err.message)
					})
			}
		}
	}

	return (
		<>
			<h1 className='text-4xl font-bold mb-7'>Cài đặt</h1>
			<div>
				<h3 className='text-2xl font-bold pb-3 mb-7 border-b-2'>
					Thông tin cá nhân
				</h3>
				<div>
					{arr1.map((item) => (
						<SettingField key={item.fn} {...item} />
					))}
				</div>
				<SettingImages user={user} />
			</div>
			<div>
				<h3 className='text-2xl font-bold pb-3 mb-7 border-b-2'>
					Mạng xã hội
				</h3>
				<div>
					{arr2.map((item) => (
						<SettingField key={item.id} {...item} />
					))}
				</div>
			</div>
			<button onClick={handleDeleteAccount} className='btn btn-danger'>
				Xoá tài khoản
			</button>
		</>
	)
}

export default memo(Settings)
