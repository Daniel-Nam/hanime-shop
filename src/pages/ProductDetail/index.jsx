import { useState, useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BsCart3 } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'

import {
	db,
	doc,
	getDocs,
	getDoc,
	collection,
	where,
	query,
	updateDoc,
	setDoc,
} from '~/config'
import { formatPrice, calcAndFormat } from '~/utils'
import { userSelector, setData } from '~/store/reducers/userSlice'
import Loading from '~/components/Loading'
import StarRating from './StarRating'
import giCungRe from '~/assets/images/gi-cung-re.svg'
import AuthorProfile from './AuthorProfile'
import Counter from './Counter'
import Sizes from './Sizes'
import ImageSlider from './ImageSlider'
import Comments from './Comments'
import Description from './Description'

function ProductDetail() {
	const { slug } = useParams()
	const user = useSelector(userSelector)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [product, setProduct] = useState()
	const [author, setAuthor] = useState()
	const [preview, setPreview] = useState()
	const [count, setCount] = useState(1)
	const [rating, setRating] = useState(0)
	const [loading, setLoading] = useState(true)
	const [selectedSize, setSelectedSize] = useState(null)

	const fetchData = async () => {
		setLoading(true)
		const q = query(collection(db, 'products'), where('slug', '==', slug))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			navigate('/not-found')
			return
		}

		const data = querySnapshot.docs[0].data()
		document.title = data.name
		setProduct(data)

		const docRef = doc(db, 'users', data.authorId)
		const authorDoc = await getDoc(docRef)
		setAuthor(authorDoc.data())

		const calcRating =
			data.rating.length > 0
				? Math.floor(
						data.rating.reduce((acc, cur) => acc + cur.count, 0) /
							data.rating.length
				  )
				: 0
		setRating(calcRating)
		setLoading(false)
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug])

	const handleAddToCart = async () => {
		if (!user) {
			toast.error('Vui l??ng ????ng nh???p ????? th???c hi???n ch???c n??ng n??y!')
			return
		}

		setLoading(true)
		const countNum = parseInt(count)

		if (count === '') {
			setLoading(false)
			toast.error('Vui l??ng ch???n s??? l?????ng!')
			return
		} else if (isNaN(count)) {
			setLoading(false)
			toast.error('S??? l?????ng s???n ph???m kh??ng h???p l???!')
			return
		} else if (countNum <= 0) {
			setLoading(false)
			toast.error('S??? l?????ng s???n ph???m ph???i l???n h??n 0 !')
			return
		} else if (countNum > product.productCount) {
			setLoading(false)
			toast.error('S??? l?????ng s???n ph???m nhi???u h??n s??? h??ng t???n t???i!')
			return
		} else if (product.sizes.length > 0 && !selectedSize) {
			setLoading(false)
			toast.error('Vui l??ng ch???n k??ch c???!')
			return
		}

		// ki???m tra s???n ph???m c?? ??? trong v??? h??ng hay kh??ng n???u c?? ch??? th??m s??? l?????ng
		const isExist = user.cart.find((item) => item.id === product.id)
		if (isExist) {
			if (countNum > product.productCount) {
				setLoading(false)
				toast.error('S??? l?????ng s???n ph???m nhi???u h??n s??? h??ng t???n t???i!')
				return
			} else if (countNum === isExist.count) {
				setLoading(false)
				toast.info('S??? l?????ng s???n ph???m kh??ng thay ?????i!')
				return
			}

			const id = toast.loading('??ang th??m v??o gi??? h??ng...')
			const aod = countNum - isExist.count > 0 ? 'th??m' : 'gi???m'
			const cc =
				countNum - isExist.count > 0
					? countNum - isExist.count
					: isExist.count - countNum

			const newData = {
				...user,
				recent: {
					...user.recent,
					cart: [
						...user.recent.cart,
						{
							id: uuidv4(),
							value: `${aod} ${cc} ${product.name}`,
						},
					],
				},
				cart: user.cart.map((item) => {
					if (item.id === product.id) {
						return {
							...item,
							count: countNum,
							size: selectedSize,
						}
					}

					return item
				}),
			}

			await setDoc(doc(db, 'users', user.uid), newData)
				.then(() => {
					dispatch(setData(newData))
					toast.update(id, {
						render: `???? ${aod} ${cc} s???n ph???m!`,
						type: 'success',
						autoClose: 3000,
						isLoading: false,
					})
				})
				.catch((err) => toast.error(err.message))
				.finally(() => setLoading(false))

			return
		}

		const id = toast.loading('??ang th??m v??o gi??? h??ng...')
		const data = {
			...product,
			count: countNum,
			createdAt: new Date().getTime(),
			size: selectedSize,
		}

		await updateDoc(doc(db, 'users', user.uid), {
			cart: [data, ...user.cart],
		})
			.then(() => {
				toast.update(id, {
					render: `???? th??m s???n ph???m v??o gi??? h??ng!`,
					type: 'success',
					autoClose: 3000,
					isLoading: false,
				})
				dispatch(
					setData({
						...user,
						cart: [data, ...user.cart],
						recent: {
							...user.recent,
							cart: [
								{
									id: uuidv4(),
									value: `th??m ${product.name}`,
								},
								...user.recent.cart,
							],
						},
					})
				)
			})
			.catch((err) => toast.error(err.message))
			.finally(() => setLoading(false))
	}

	if (loading) return <Loading />

	return (
		<div className='flex flex-col gap-7'>
			<div className='flex flex-col gap-5 lg:gap-10 lg:flex-row'>
				<div className='shrink-0 w-full max-w-[400px] mx-auto'>
					<div
						className='rounded-sm bg-cover bg-center bg-no-repeat h-[300px] md:h-[400px]'
						style={{
							backgroundImage: `url("${
								preview || product.images[0].url
							}")`,
						}}
					/>

					<ImageSlider
						data={product.images}
						setPreview={setPreview}
					/>
				</div>

				{/* Info */}
				<div className='flex-1 flex flex-col gap-5'>
					{/* Name */}
					<div>
						<div className='flex items-center flex-wrap gap-3'>
							{product.isFavorite && (
								<div className='max-w-fit py-1 px-2 text-white bg-orange-500 rounded-sm'>
									Y??u th??ch
								</div>
							)}
							<h1 className='text-xl md:text-2xl break-words font-bold'>
								{product.name}
							</h1>
						</div>
						<div className='flex items-center mt-3'>
							<div className='flex items-center gap-2 py-1 px-3 md:py-2 md:px-5 border-l-2'>
								<span>{rating}</span>
								<StarRating
									rating={rating}
									setRating={setRating}
									product={product}
									user={user}
									fetchData={fetchData}
								/>
							</div>

							<div className='py-1 px-3 md:py-2 md:px-5 border-x-2 text-gray-600'>
								<span>{product.rating.length}</span> ????nh gi??
							</div>

							<div className='py-1 px-3 md:py-2 md:px-5 border-r-2 text-gray-600'>
								<span>{product.soldCount}</span> ???? b??n
							</div>
						</div>
					</div>

					{/* Price */}
					<div className='flex items-center gap-5 py-2 px-3 md:py-3 md:px-5 bg-gray-100 rounded-lg'>
						{/* Ki???m tra xem c?? gi???m gi?? hay kh??ng */}
						{product.discount > 0 && (
							<div className='line-through'>
								{formatPrice(product.price)}
							</div>
						)}

						<div className='text-lg text-orange-500 font-semibold'>
							??? {calcAndFormat(product.price, product.discount)}
						</div>

						{/* N???u gi???m gi?? nhi???u h??n 0 */}
						{product.discount > 0 && (
							<div className='py-1 px-2 bg-orange-500 text-white font-semibold tracking-wide rounded-sm'>
								{product.discount}% gi???m
							</div>
						)}
					</div>

					{/* G?? c??ng r??? */}
					<div className='flex items-center gap-3'>
						<div>
							<img src={giCungRe} alt='' />
						</div>
						<div>
							<h4 className='font-bold text-orange-500'>
								G?? c??ng r???
							</h4>
							<span className='text-xs md:text-sm'>
								Gi?? t???t nh???t so v???i c??c s???n ph???m c??ng lo???i tr??n
								Hanime Shop
							</span>
						</div>
					</div>

					{product.sizes.length > 0 && (
						<Sizes
							selectedSize={selectedSize}
							setSelectedSize={setSelectedSize}
							sizes={product.sizes}
						/>
					)}

					<Counter
						productCount={product.productCount}
						count={count}
						setCount={setCount}
					/>

					<div>
						<button
							className='btn btn-primary'
							onClick={handleAddToCart}>
							<span className='flex items-center gap-3'>
								<BsCart3 />
								<span>Th??m v??o gi??? h??ng</span>
							</span>
						</button>
					</div>
				</div>
			</div>

			<Description data={product.description} />

			<AuthorProfile author={author} />

			<Comments user={user} product={product} fetchData={fetchData} />
		</div>
	)
}

export default memo(ProductDetail)
