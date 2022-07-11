import { useState, useEffect, useRef, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import { setData, userSelector } from '~/store/reducers/userSlice'
import { collection, where, db, getDocs, query, doc, setDoc } from '~/config'

function SettingField(props) {
	const {
		data,
		title,
		desc,
		fn,
		regex,
		errorText,
		max = 50,
		duplicate,
		ex, // ? if data === empty string
		id, // ? id of data
		isUsername, // ? if username
		readOnly = false, // ? read only
	} = props
	const [value, setValue] = useState(data)
	const [isEdit, setIsEdit] = useState(false)
	const user = useSelector(userSelector)
	const dispatch = useDispatch()
	const inputRef = useRef()

	useEffect(() => {
		if (isEdit) {
			inputRef.current.focus()
		}
	}, [isEdit])

	const reset = () => {
		setValue(data)
		setIsEdit(false)
	}

	const handleUpdate = async () => {
		const str = value.trim()
		const docRef = doc(db, 'users', user.uid)

		if (str === data) {
			toast.error('Giá trị không thay đổi!')
			return
		} else if (regex && !regex.test(str)) {
			toast.error(errorText)
			return
		} else if (fn === 'socials' && id) {
			const newData = {
				...user,
				socials: user.socials.map((social) => {
					if (social.id === id) {
						return { ...social, url: str }
					}

					return social
				}),
				recent: {
					...user.recent,
					profile: [
						...user.recent.profile,
						{
							id: uuidv4(),
							value: `cập nhật ${title} => ${str}`,
						},
					],
				},
			}

			await setDoc(docRef, newData)
			dispatch(setData(newData))
			toast.success('Cập nhật thành công!')
			setIsEdit(false)

			return
		} else if (duplicate && str === duplicate) {
			toast.error(`${title} không được giống ${duplicate}`)
			return
		} else if (isUsername) {
			// ? Check if username is existed
			const doc = await getDocs(
				query(collection(db, 'users'), where('username', '==', str))
			)

			if (doc.docs.length > 0) {
				toast.error(`${title} đã tồn tại!`)
				return
			}
		}

		const newData = {
			...user,
			[fn]: str,
			recent: {
				...user.recent,
				profile: [
					...user.recent.profile,
					{
						id: uuidv4(),
						value: `cập nhật ${title} => ${str}`,
					},
				],
			},
		}

		await setDoc(docRef, newData)
		dispatch(setData(newData))
		toast.success(`${title} đã được cập nhật!`)
		setIsEdit(false)
	}

	const handleEdit = () => setIsEdit(true)

	const ButtonGroup = () => {
		return (
			<div>
				<button
					className='btn btn-primary btn--rounded mr-3'
					onClick={handleUpdate}>
					Lưu
				</button>
				<button
					className='btn btn-outline-danger btn--rounded'
					onClick={() => reset()}>
					Huỷ
				</button>
			</div>
		)
	}

	const EditButton = () => {
		return (
			<button
				className='btn btn-outline-gray btn--rounded'
				onClick={handleEdit}>
				Chỉnh sửa
			</button>
		)
	}

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') handleUpdate()
	}

	return (
		<div className='mb-7'>
			<div className='flex items-center justify-between'>
				<h4 className='text-xl font-semibold capitalize'>{title}</h4>
				{!readOnly && (isEdit ? <ButtonGroup /> : <EditButton />)}
			</div>
			<div className='flex flex-col gap-3'>
				<input
					type='text'
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className='block w-full py-2 border-b text-gray-600 outline-none'
					maxLength={max}
					disabled={!isEdit}
					ref={inputRef}
					placeholder={ex ? 'Eg: ' + ex : null}
					onKeyDown={handleKeyDown}
				/>
				{desc && <span className='text-sm text-gray-400'>{desc}</span>}
			</div>
		</div>
	)
}

export default memo(SettingField)
