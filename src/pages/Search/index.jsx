import { memo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BsPatchCheckFill } from 'react-icons/bs'

import { db, getDocs, collection } from '~/config'
import { calcAndFormat, formatPrice } from '~/utils'
import { BsFillEmojiHeartEyesFill } from 'react-icons/bs'
import Image from '~/components/Image'
import CustomLoading from '~/components/CustomLoading'

function Search() {
	const { query } = useParams()
	const [products, setProducts] = useState([])
	const [users, setUsers] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const fetchData = async () => {
		setIsLoading(true)

		const userSnapshot = await getDocs(collection(db, 'users'))
		const productSnapshot = await getDocs(collection(db, 'products'))

		const arr1 = userSnapshot.docs.map((doc) => doc.data())
		const arr2 = productSnapshot.docs.map((doc) => doc.data())

		const userFilter = arr1.filter((user) => {
			const { username, displayName, email, email_alt, uid } = user
			return (
				displayName.toLowerCase().includes(query) ||
				email.includes(query) ||
				email_alt.includes(query) ||
				uid.includes(query) ||
				username.includes(query)
			)
		})

		const productFilter = arr2.filter((product) => {
			const { name, slug, description, id } = product
			return (
				name.toLowerCase().includes(query) ||
				description.toLowerCase().includes(query) ||
				slug.includes(query) ||
				id.includes(query)
			)
		})

		setProducts(productFilter)
		setUsers(userFilter)
		setIsLoading(false)
	}

	useEffect(() => {
		fetchData()
	}, [query])

	return (
		<>
			<div>
				<div className='text-lg sm:text-2xl font-semibold break-words'>
					Kết quả cho: '{query}'
				</div>
				<div className='mt-2 my-5'>
					{isLoading ? (
						<div className='flex items-center gap-3 text-lg font-bold'>
							<CustomLoading />
							<div>Đang tìm kiếm....</div>
						</div>
					) : (
						<div className='max-w-fit text-lg'>
							{products.length + users.length === 0 ? (
								<div className='text-red-500'>
									Oops, không tìm thấy kết quả nào :{'(('}
								</div>
							) : (
								<div>
									Tìm thấy {products.length + users.length}{' '}
									kết quả
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<div className='flex flex-col gap-7'>
				{products.length > 0 && (
					<div>
						<div className='text-xl font-semibold mb-3'>
							Sản phẩm
						</div>
						<div className='grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
							{products.map((product) => (
								<div
									key={product.id}
									className='relative border shadow rounded-sm transition hover:shadow-xl hover:scale-105'>
									{product.isFavorite && (
										<div className='absolute -top-2 -left-2 p-1 bg-indigo-500 text-white rounded-full'>
											<BsFillEmojiHeartEyesFill />
										</div>
									)}

									{product.discount > 0 && (
										<div className='absolute top-0 right-0 text-sm text-white bg-blue-500 rounded-bl-md p-1'>
											{product.discount}% giảm
										</div>
									)}

									<div>
										<Link to={`/product/${product.slug}`}>
											<Image
												src={product.images[0]}
												alt={product.images[0]}
												className='w-full h-[140px] md:h-[200px] object-cover'
											/>
										</Link>
									</div>
									<div className='flex flex-col h-[calc(100%-140px)] md:h-[calc(100%-200px)] p-2'>
										<div className='line-clamp-2 font-bold'>
											<Link
												to={`/product/${product.slug}`}>
												{product.name}
											</Link>
										</div>

										{/* Price */}
										<div className='flex items-center justify-between flex-wrap w-full mt-auto'>
											<div className='text-red-500 font-semibold'>
												₫{' '}
												{calcAndFormat(
													product.price,
													product.discount
												)}
											</div>
											<div className='text-sm text-gray-600'>
												Đã bán{' '}
												{formatPrice(product.soldCount)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				{users.length > 0 && (
					<div>
						<div className='text-xl font-semibold mb-3'>
							Người dùng
						</div>
						<div className='flex flex-col gap-5'>
							{users.map((user) => (
								<div
									key={user.uid}
									className='border rounded-sm max-w-[600px] hover:shadow-md hover:scale-105 transition-all'>
									<Link
										to={`/@${user.username}`}
										className='flex items-center gap-3 py-2 px-4'>
										<div className='shrink-0'>
											<Image
												src={user.photoURL}
												className='w-16 h-16 border rounded-full object-cover'
											/>
										</div>
										<div>
											<div className='flex items-center gap-1'>
												<div className='text-lg font-bold line-clamp-1'>
													{user.displayName}
												</div>
												{user.isTrusted && (
													<BsPatchCheckFill
														size='1.5em'
														className='text-blue-500'
													/>
												)}
											</div>
											<div>
												{user.bio.length > 60
													? user.bio.substring(
															0,
															57 - 3
													  ) + '...'
													: user.username}
											</div>
										</div>
									</Link>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default memo(Search)
