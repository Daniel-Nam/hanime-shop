import { memo, useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { IoCloseCircle } from 'react-icons/io5'
import { BiSearch } from 'react-icons/bi'
import { BsPatchCheckFill } from 'react-icons/bs'
import { toast } from 'react-toastify'
import HeadlessTippy from '@tippyjs/react/headless'

import { useDebounce } from '~/hooks'
import { collection, getDocs, db, updateDoc, doc } from '~/config'
import { updateData } from '~/store/reducers/userSlice'
import CustomLoading from '~/components/CustomLoading'
import Image from '~/components/Image'

function Search({ user, dispatch }) {
	const navigate = useNavigate()
	const inputRef = useRef()
	const [search, setSearch] = useState('')
	const [searchResult, setSearchResult] = useState([])
	const [showResult, setShowResult] = useState(false)
	const [loading, setLoading] = useState(false)
	const debouncedValue = useDebounce(search, 500)

	const fetchApi = async () => {
		setLoading(true)
		const arr1 = []
		const arr2 = []

		const users = await getDocs(collection(db, 'users'))
		const products = await getDocs(collection(db, 'products'))
		users.forEach((doc) => arr1.push(doc.data()))
		products.forEach((doc) => arr2.push(doc.data()))

		const usersFilter = arr1.filter((user) => {
			const { username, displayName, email, email_alt, uid } = user

			return (
				displayName
					.toLowerCase()
					.includes(debouncedValue.toLowerCase()) ||
				email.includes(debouncedValue) ||
				email_alt.includes(debouncedValue) ||
				uid.includes(debouncedValue) ||
				username.includes(debouncedValue)
			)
		})

		const productsFilter = arr2.filter((product) => {
			const { name, slug, id } = product
			return (
				name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
				slug.includes(debouncedValue) ||
				id.includes(debouncedValue)
			)
		})

		const results = [...usersFilter, ...productsFilter]
		setSearchResult(results)
		setLoading(false)
	}

	useEffect(() => {
		if (!debouncedValue.trim()) {
			setSearchResult([])
			return
		}

		fetchApi()
	}, [debouncedValue])

	const handleClear = () => {
		setSearch('')
		setSearchResult([])
		inputRef.current.focus()
	}

	const handleHideResult = () => setShowResult(false)

	const handleChange = (e) => {
		const searchValue = e.target.value
		if (!searchValue.startsWith(' ')) setSearch(searchValue)
	}

	const handleKeyDown = (e) => e.key === 'Enter' && handleSearch()

	const handleSearch = () => {
		if (!search.trim()) {
			toast.error('Vui lòng nhập từ khóa cần tìm kiếm')
			return
		}

		navigate(`/search/${encodeURIComponent(search)}`)
		handleHideResult()

		const newRecent = {
			...user.recent,
			search: [
				{
					id: uuidv4(),
					value: search,
				},
				...user.recent.search,
			],
		}

		updateDoc(doc(db, 'users', user.uid), {
			recent: newRecent,
		})
			.then(() => {
				dispatch(updateData({ recent: newRecent }))
			})
			.catch((err) => toast.error(err.message))
	}

	return (
		<div className='relative flex-1 hidden sm:block'>
			<HeadlessTippy
				interactive
				visible={showResult && searchResult.length > 0}
				render={(attrs) => (
					<div
						tabIndex='-1'
						{...attrs}
						className='animate-drop flex flex-col gap-2 w-[400px] rounded-md py-3 px-5 bg-white border shadow-lg'>
						{searchResult.slice(0, 6).map((result) => (
							<Link
								to={
									result.slug
										? '/product/' + result.slug
										: '/@' + result.username
								}
								key={uuidv4()}
								className='flex items-center gap-2'>
								<div className='shrink-0'>
									<Image
										src={
											result.images
												? result.images[0].url
												: result.photoURL
										}
										className='block w-8 h-8 rounded-full object-cover'
									/>
								</div>

								<div className='flex items-center gap-1'>
									<h4 className='line-clamp-1'>
										{result.name || result.displayName}
									</h4>
									{result.isTrusted && (
										<BsPatchCheckFill className='text-blue-500' />
									)}
								</div>
							</Link>
						))}

						{searchResult.length > 6 && (
							<div
								className='text-blue-500 text-center font-semibold'
								onClick={handleSearch}>
								Xem thêm
							</div>
						)}
					</div>
				)}
				onClickOutside={handleHideResult}>
				<div className='flex w-[400px] bg-gray-100 mx-auto border-2 rounded-full transition'>
					<div className='flex-1 flex items-center px-2 gap-2'>
						<input
							ref={inputRef}
							type='text'
							value={search}
							onChange={handleChange}
							onFocus={() => setShowResult(true)}
							onKeyDown={handleKeyDown}
							className='flex-1 block p-2 pr-0 rounded-full outline-none bg-transparent'
							placeholder='Tìm kiếm người dùng, sản phẩm,...'
						/>

						{loading ? (
							<CustomLoading />
						) : (
							search.length > 0 && (
								<button
									onClick={handleClear}
									className='text-gray-300'>
									<IoCloseCircle />
								</button>
							)
						)}
					</div>

					<button
						className='shrink-0 flex items-center justify-center w-12 hover:bg-gray-200 border border-transparent border-l-gray-200 rounded-tr-full rounded-br-full transition'
						onClick={handleSearch}>
						<BiSearch size='1.2em' />
					</button>
				</div>
			</HeadlessTippy>
		</div>
	)
}

export default memo(Search)
