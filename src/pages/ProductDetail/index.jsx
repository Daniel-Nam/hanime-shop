import { useState, useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BsCart3 } from 'react-icons/bs'
import { MdPayment } from 'react-icons/md'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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
import Image from '~/components/Image'
import StarRating from '~/components/StarRating'
import giCungRe from '~/assets/images/gi-cung-re.svg'

function ProductDetail() {
	const user = useSelector(userSelector)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { slug } = useParams()
	const [product, setProduct] = useState()
	const [author, setAuthor] = useState()
	const [posts, setPosts] = useState([])
	const [preview, setPreview] = useState()
	const [count, setCount] = useState(1)
	const [rating, setRating] = useState(0)
	const [isLoading, setIsLoading] = useState(true)

	const fetchData = async () => {
		setIsLoading(true)
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
		const authorData = authorDoc.data()
		setAuthor(authorData)

		const q2 = query(
			collection(db, 'products'),
			where('authorId', '==', data.authorId)
		)
		const querySnapshot2 = await getDocs(q2)
		const posts = querySnapshot2.docs.map((doc) => doc.data())
		setPosts(posts)

		const calcRating =
			data.rating.length > 0
				? Math.floor(
						data.rating.reduce((acc, cur) => acc + cur.count, 0) /
							data.rating.length
				  )
				: 0
		setRating(calcRating)
		setIsLoading(false)
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug])

	useEffect(() => {
		if (product && user && user.cart.length > 0) {
			const isExist = user.cart.find((item) => item.id === product.id)
			if (isExist) setCount(isExist.count)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [product])

	const handleAddToCart = async () => {
		if (!user) {
			toast.error('Vui lòng đăng nhập để thực hiện chức năng này!')
			return
		}

		setIsLoading(true)
		const countNum = parseInt(count)

		if (count === '') {
			setIsLoading(false)
			toast.error('Vui lòng chọn số lượng!')
			return
		} else if (isNaN(count)) {
			setIsLoading(false)
			toast.error('Số lượng sản phẩm không hợp lệ!')
			return
		} else if (countNum <= 0) {
			setIsLoading(false)
			toast.error('Số lượng sản phẩm phải lớn hơn 0 !')
			return
		} else if (countNum > product.productCount) {
			setIsLoading(false)
			toast.error('Số lượng sản phẩm nhiều hơn số hàng tồn tại!')
			return
		}

		// kiểm tra sản phẩm có ở trong vỏ hàng hay không nếu có chỉ thêm số lượng
		const isExist = user.cart.find((item) => item.id === product.id)
		if (isExist) {
			if (countNum > product.productCount) {
				setIsLoading(false)
				toast.error('Số lượng sản phẩm nhiều hơn số hàng tồn tại!')
				return
			} else if (countNum === isExist.count) {
				setIsLoading(false)
				toast.info('Số lượng sản phẩm không thay đổi!')
				return
			}

			const id = toast.loading('Đang thêm vào giỏ hàng...')
			const aod = countNum - isExist.count > 0 ? 'thêm' : 'giảm'
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
							...isExist,
							count: countNum,
						}
					}
					return item
				}),
			}

			await setDoc(doc(db, 'users', user.uid), newData)
				.then(() => {
					dispatch(setData(newData))
					toast.update(id, {
						render: `Đã ${aod} ${cc} sản phẩm!`,
						type: 'success',
						autoClose: 3000,
						isLoading: false,
					})
				})
				.catch((err) => toast.error(err.message))
				.finally(() => setIsLoading(false))

			return
		}

		const id = toast.loading('Đang thêm vào giỏ hàng...')
		const data = {
			...product,
			count: countNum,
			createdAt: new Date().getTime(),
		}

		await updateDoc(doc(db, 'users', user.uid), {
			cart: [data, ...user.cart],
		})
			.then(() => {
				toast.update(id, {
					render: `Đã thêm sản phẩm vào giỏ hàng!`,
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
									value: `thêm ${product.name}`,
								},
								...user.recent.cart,
							],
						},
					})
				)
			})
			.catch((err) => toast.error(err.message))
			.finally(() => setIsLoading(false))
	}

	const options = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 4,
		autoplay: true,
		autoplaySpeed: 3000,
	}

	const handleDecrease = () => {
		if (count === '') return
		if (isNaN(count)) return

		const countNum = parseInt(count)
		if (countNum <= 0) return

		setCount(countNum - 1)
	}

	const handleIncrease = () => {
		if (count === '') return
		if (isNaN(count)) return

		const countNum = parseInt(count)
		setCount(countNum + 1)
	}

	const imgClass = 'block w-full h-16 object-cover mx-auto'

	if (isLoading) return <Loading />

	return (
		<>
			<div className='flex flex-col gap-5 lg:gap-10 lg:flex-row'>
				{/* Images */}
				<div className='w-full max-w-[400px] mx-auto'>
					{/* Main images */}
					<div className='mb-3'>
						<Image
							src={preview || product.images[0]}
							alt={product.images[0]}
							className='block w-full object-cover rounded-md mx-auto h-[300px] md:h-[400px]'
						/>
					</div>

					{/* sub images */}
					{product.images.length > 1 && product.images.length < 5 && (
						<div className='flex items-center justify-center gap-3'>
							{product.images.map((image) => (
								<div
									key={image}
									className='p-1 pb-0 border border-transparent hover:border-orange-500 transition'>
									<Image
										src={image}
										alt={image}
										className={imgClass}
										onMouseEnter={() => setPreview(image)}
									/>
								</div>
							))}
						</div>
					)}

					{/* images slider */}
					{product.images.length >= 5 && (
						<div className='overflow-hidden sm:px-6'>
							<Slider {...options}>
								{product.images.map((image) => (
									<div
										key={image}
										className='p-1 pb-0 border border-transparent hover:border-orange-500 transition'>
										<Image
											src={image}
											alt={image}
											className={imgClass}
											onMouseEnter={() =>
												setPreview(image)
											}
										/>
									</div>
								))}
							</Slider>
						</div>
					)}
				</div>

				{/* Info */}
				<div className='flex-1 flex flex-col gap-5'>
					{/* Name */}
					<div>
						<div className='flex items-center flex-wrap gap-3'>
							{product.isFavorite && (
								<div className='max-w-fit py-1 px-2 text-white bg-orange-500 rounded-sm'>
									Yêu thích
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
								<span>{product.rating.length}</span> đánh giá
							</div>

							<div className='py-1 px-3 md:py-2 md:px-5 border-r-2 text-gray-600'>
								<span>{product.soldCount}</span> đã bán
							</div>
						</div>
					</div>

					{/* Price */}
					<div className='flex items-center gap-5 py-2 px-3 md:py-3 md:px-5 bg-slate-100 rounded-lg'>
						{/* Kiểm tra xem có giảm giá hay không */}
						{product.discount > 0 && (
							<div className='line-through'>
								{formatPrice(product.price)}
							</div>
						)}

						<div className='text-lg text-blue-500 font-semibold'>
							₫ {calcAndFormat(product.price, product.discount)}
						</div>

						{/* Nếu giảm giá nhiều hơn 0 */}
						{product.discount > 0 && (
							<div className='py-1 px-2 bg-orange-500 text-white font-semibold tracking-wide rounded-sm'>
								{product.discount}% giảm
							</div>
						)}
					</div>

					{/* Gì cũng rẻ */}
					<div className='flex items-center gap-3'>
						<div>
							<Image src={giCungRe} alt='' />
						</div>
						<div>
							<h4 className='font-semibold text-orange-500'>
								Gì cũng rẻ
							</h4>
							<span className='text-xs md:text-sm'>
								Giá tốt nhất so với các sản phẩm cùng loại trên
								Hanime Shop
							</span>
						</div>
					</div>

					{/* Tăng / Giảm số lượng */}
					<div className='flex items-center gap-7'>
						<div className='font-semibold'>Số lượng</div>
						<div className='flex items-center gap-3'>
							<div className='flex items-center border rounded-sm'>
								<button
									className='inline-block font-bold py-2 px-3 hover:bg-slate-300 rounded-tl-sm rounded-bl-sm transition'
									onClick={handleDecrease}>
									<AiOutlineMinus size='1.5em' />
								</button>
								<input
									type='text'
									className='block max-w-[100px] outline-none text-center font-bold'
									value={count}
									onChange={(e) => setCount(e.target.value)}
								/>
								<button
									className='inline-block font-bold py-2 px-3 hover:bg-slate-300 rounded-tr-sm rounded-br-sm transition'
									onClick={handleIncrease}>
									<AiOutlinePlus size='1.5em' />
								</button>
							</div>
							<div className='hidden lg:block text-sm font-semibold text-gray-600'>
								{product.productCount} sản phẩm có sẵn
							</div>
						</div>
					</div>

					{/* Mua Hàng / Thanh toán */}
					<div className='flex items-center flex-wrap gap-5'>
						<button
							className='btn btn-outline-primary flex items-center gap-3'
							onClick={handleAddToCart}>
							<BsCart3 />
							<span>Thêm vào giỏ hàng</span>
						</button>
						<button className='btn btn-secondary flex items-center gap-3'>
							<MdPayment />
							<span>Mua ngay</span>
						</button>
					</div>
				</div>
			</div>

			{/* Mô tả sản phẩm */}
			<div className='mt-7 max-w-full'>
				<h3 className='text-xl md:text-2xl font-bold'>
					Mô tả sản phẩm
				</h3>

				<div
					className='break-words text-gray-700 text-sm md:text-base'
					dangerouslySetInnerHTML={{ __html: product.description }}
				/>
			</div>

			{/* Thông tin người bán  */}
			<div className='mt-7'>
				<h3 className='text-xl md:text-2xl font-bold mb-1'>
					Thông tin người bán
				</h3>

				<div className='flex flex-col gap-3 p-2 md:max-w-fit rounded-md border shadow md:p-4 md:gap-0 md:flex-row md:items-center'>
					<div className='flex items-center gap-3 md:pr-7 md:border-r-2'>
						<div className='shrink-0'>
							<img
								src={author.photoURL}
								alt=''
								className='w-12 h-12 md:w-20 md:h-20 object-cover rounded-full border shadow'
							/>
						</div>
						<div>
							<h4 className='text-lg font-bold'>
								{author.displayName}
							</h4>
							<Link to={'/@' + author.username}>
								@{author.username}
							</Link>
						</div>
					</div>
					<div className='flex items-center flex-wrap gap-3 md:block md:pl-7'>
						<div className='flex gap-3 text-sm capitalize'>
							<span>lượt đánh giá</span>
							<span className='font-bold text-indigo-500'>
								{posts.reduce((acc, post) => {
									return acc + post.rating.length
								}, 0)}
							</span>
						</div>

						<div className='flex gap-3 text-sm capitalize'>
							<span>số sản phẩm</span>
							<span className='font-bold text-indigo-500'>
								{posts.length}
							</span>
						</div>

						<div className='flex gap-3 text-sm capitalize'>
							<span>đánh giá TB</span>
							<span className='font-bold text-indigo-500'>
								{/* kiểm tra xem có đánh giá chx  */}
								{posts.reduce((acc, post) => {
									return acc + post.rating.length
								}, 0) > 0
									? posts.reduce((acc, post) => {
											return (
												acc +
												post.rating.reduce(
													(acc, cur) => {
														return acc + cur.count
													},
													0
												)
											)
									  }, 0) /
									  posts.reduce((acc, post) => {
											return acc + post.rating.length
									  }, 0)
									: 0}
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default memo(ProductDetail)
