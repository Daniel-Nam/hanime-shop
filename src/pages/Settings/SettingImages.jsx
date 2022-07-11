import { memo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import {
	doc,
	db,
	ref,
	setDoc,
	storage,
	getDownloadURL,
	uploadBytes,
} from '~/config'
import { setData } from '~/store/reducers/userSlice'
import Image from '~/components/Image'

function SettingImages({ user }) {
	const avatarRef = useRef()
	const backgroundRef = useRef()
	const dispatch = useDispatch()
	const [avatarFile, setAvatarFile] = useState(null)
	const [backgroundFile, setBackgroundFile] = useState(null)
	const [avatar, setAvatar] = useState(user.photoURL)
	const [background, setBackground] = useState(user.backgroundURL)
	const [isEditAvatar, setIsEditAvatar] = useState(false)
	const [isEditBackground, setIsEditBackground] = useState(false)

	const ButtonGroup = (props) => {
		return (
			<div>
				<button
					className='btn btn-primary btn--rounded mr-3'
					onClick={props.handleSave}>
					Lưu
				</button>
				<button
					className='btn btn-outline-danger btn--rounded'
					onClick={props.handleCancel}>
					Huỷ
				</button>
			</div>
		)
	}

	const EditButton = (props) => {
		return (
			<button
				className='btn btn-outline-gray btn--rounded'
				onClick={props.handleEdit}>
				Chỉnh sửa
			</button>
		)
	}

	const handleAvatarChange = (e) => {
		const file = e.target.files[0]
		setAvatarFile(file)
		const reader = new FileReader()
		reader.onload = (e) => {
			setAvatar(e.target.result)
		}
		reader.readAsDataURL(file)
	}

	const handleBackgroundChange = (e) => {
		const file = e.target.files[0]
		setBackgroundFile(file)
		const reader = new FileReader()
		reader.onload = (e) => {
			setBackground(e.target.result)
		}
		reader.readAsDataURL(file)
	}

	const handleEditAvatar = () => {
		setIsEditAvatar(true)
		avatarRef.current.click()
	}

	const handleEditBackground = () => {
		setIsEditBackground(true)
		backgroundRef.current.click()
	}

	const handleAvatarCancel = () => {
		setIsEditAvatar(false)
		setAvatar(user.photoURL)
	}

	const handleBackgroundCancel = () => {
		setIsEditBackground(false)
		setBackground(user.backgroundURL)
	}

	const handleAvatarSave = async () => {
		// upload to storage format user.uid_avatar
		const id = toast.loading('Đang tải ảnh lên...')

		const storageRef = ref(storage, `profiles/${user.uid}_avatar`)
		await uploadBytes(storageRef, avatarFile)
			.then(async (res) => {
				toast.update(id, {
					render: 'Đã tải lên thành công!',
					type: 'success',
					isLoading: false,
					autoClose: 3000,
				})

				const photoURL = await getDownloadURL(
					ref(storage, res.ref.fullPath)
				)

				const newData = {
					...user,
					photoURL,
					recent: {
						...user.recent,
						profile: [
							...user.recent.profile,
							{
								id: uuidv4(),
								value: 'cập nhật ảnh đại diện',
							},
						],
					},
				}

				await setDoc(doc(db, 'users', user.uid), newData)
				dispatch(setData(newData))
				setIsEditAvatar(false)
			})
			.catch((err) => toast.error(err))
			.finally(() => toast.dismiss(id))
	}

	const handleBackgroundSave = async () => {
		// upload to storage format user.uid_background
		const id = toast.loading('Đang tải ảnh lên...')

		const storageRef = ref(storage, `profiles/${user.uid}_background`)
		await uploadBytes(storageRef, backgroundFile)
			.then(async (res) => {
				toast.update(id, {
					render: 'Đã tải lên thành công!',
					type: 'success',
					isLoading: false,
				})

				const backgroundURL = await getDownloadURL(
					ref(storage, res.ref.fullPath)
				)

				const newData = {
					...user,
					backgroundURL,
					recent: {
						...user.recent,
						profile: [
							...user.recent.profile,
							{
								id: uuidv4(),
								value: 'cập nhật ảnh nền',
							},
						],
					},
				}

				await setDoc(doc(db, 'users', user.uid), newData)
				dispatch(setData(newData))
				setIsEditBackground(false)
			})
			.catch((err) => console.error(err))
			.finally(() => toast.dismiss(id))
	}

	return (
		<div className='flex flex-col gap-7 mb-7'>
			<div>
				<div className='flex items-center justify-between'>
					<h4 className='text-xl font-semibold capitalize'>avatar</h4>
					{isEditAvatar ? (
						<ButtonGroup
							handleCancel={handleAvatarCancel}
							handleSave={handleAvatarSave}
						/>
					) : (
						<EditButton handleEdit={handleEditAvatar} />
					)}
				</div>
				<input
					type='file'
					className='hidden'
					ref={avatarRef}
					onChange={handleAvatarChange}
					accept='image/*'
				/>
				<Image
					src={avatar}
					alt=''
					className='block w-20 h-20 rounded-full object-cover border cursor-pointer'
					onClick={() => avatarRef.current.click()}
				/>
			</div>
			<div>
				<div className='flex items-center justify-between mb-3'>
					<h4 className='text-xl font-semibold capitalize'>
						hình nền
					</h4>
					{isEditBackground ? (
						<ButtonGroup
							handleCancel={handleBackgroundCancel}
							handleSave={handleBackgroundSave}
						/>
					) : (
						<EditButton handleEdit={handleEditBackground} />
					)}
				</div>
				<input
					type='file'
					className='hidden'
					ref={backgroundRef}
					onChange={handleBackgroundChange}
					accept='image/*'
				/>
				<Image
					src={background}
					alt=''
					className='block max-h-[200px] object-cover rounded-sm cursor-pointer'
					onClick={() => backgroundRef.current.click()}
				/>
			</div>
		</div>
	)
}

export default memo(SettingImages)
