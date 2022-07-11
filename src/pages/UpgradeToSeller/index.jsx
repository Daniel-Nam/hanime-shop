import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { userSelector, updateData } from '~/store/reducers/userSlice'
import { db, doc, updateDoc } from '~/config'
import { BsCheckCircleFill } from 'react-icons/bs'
import { RiCloseCircleFill } from 'react-icons/ri'
import { toast } from 'react-toastify'

function UpgradeToSeller() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const user = useSelector(userSelector)

	const handleUpgrade = async () => {
		const { length } = user.socials.filter((social) => social.url !== '')
		if (
			user.bio !== '' &&
			user.email_alt !== '' &&
			user.address !== '' &&
			user.phoneNumber !== '' &&
			length >= 2
		) {
			await updateDoc(doc(db, 'users', user.uid), {
				isSeller: true,
			})
				.then(() => {
					dispatch(updateData({ isSeller: true }))

					toast.success('Đăng ký tài khoản bán hàng thành công!')

					setTimeout(() => {
						navigate('/')
					}, 3000)
				})
				.catch((err) => console.log(err))
		} else {
			toast.error('Chưa đủ điều kiện để trở thành người bán!')
			return
		}
	}

	const arr = [
		{
			text: 'bio',
			value: user.bio,
		},
		{ text: 'email phụ', value: user.email_alt },
		{
			text: 'địa chỉ',
			value: user.address,
		},
		{
			text: 'số điện thoại',
			value: user.phoneNumber,
		},
	]

	return (
		<div>
			<div className='mb-7'>
				<div className='text-3xl font-semibold'>
					Đăng ký bán hàng cùng Hanime Shop ✨✨✨
				</div>
				<p className='text-lg'>
					Hệ thống sẽ lấy ảnh đại diện, ảnh nền, tên, email của bạn
					đại diện cho cửa hàng của bạn.
				</p>
			</div>
			<div>
				<div className='text-xl font-semibold capitalize'>Yêu cầu:</div>
				<div className='flex items-center flex-wrap gap-5 my-3'>
					{arr.map((item) => (
						<div key={item.text} className='py-2 px-4 border'>
							<div className='capitalize text-lg font-semibold'>
								{item.text}:
							</div>
							<div className='flex items-center gap-2'>
								<div>Tình trạng: </div>
								{item.value !== '' ? (
									<div className='flex items-center gap-1 text-green-500'>
										<div>Hoàn thành</div>
										<BsCheckCircleFill />
									</div>
								) : (
									<div className='flex items-center gap-1 text-red-500'>
										<div>Chưa hoàn thành</div>
										<RiCloseCircleFill />
									</div>
								)}
							</div>
						</div>
					))}
					<div className='py-2 px-4 border'>
						<div className='text-lg font-semibold'>
							Mạng xã hội (ít nhất 2 cái)
						</div>
						<div className='flex items-center gap-2'>
							<div>Tình trạng: </div>
							{user.socials.filter((item) => item.url !== '')
								.length >= 2 ? (
								<div className='flex items-center gap-1 text-green-500'>
									<div>Hoàn thành</div>
									<BsCheckCircleFill />
								</div>
							) : (
								<div className='flex items-center gap-1 text-red-500'>
									<div>Chưa hoàn thành</div>
									<RiCloseCircleFill />
								</div>
							)}
						</div>
					</div>
				</div>

				<button className='btn btn-secondary' onClick={handleUpgrade}>
					Trở thành người bán
				</button>
			</div>
		</div>
	)
}

export default memo(UpgradeToSeller)
