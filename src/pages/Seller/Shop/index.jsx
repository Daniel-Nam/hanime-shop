import { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaPiggyBank } from 'react-icons/fa'
import { FcSalesPerformance } from 'react-icons/fc'
import { BsCashCoin } from 'react-icons/bs'
import { BiPieChartAlt2 } from 'react-icons/bi'
import { useSpring, animated, config } from 'react-spring'

import { userSelector } from '~/store/reducers/userSlice'
import { formatPrice, priceAfterDiscount } from '~/utils'
import { collection, query, where, getDocs, db } from '~/config'
import PostItem from './PostItem'
import images from '~/assets/images'
import Empty from '~/components/Empty'
import Loading from '~/components/Loading'

function Shop() {
	const user = useSelector(userSelector)
	const navigate = useNavigate()
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)

	const { soldCount } = useSpring({
		from: { soldCount: 0 },
		soldCount: posts.reduce((acc, post) => acc + post.soldCount, 0),
		config: config.molasses,
		delay: 200,
	})

	const { total } = useSpring({
		from: { total: 0 },
		total: posts.reduce((acc, post) => {
			return acc + post.price * post.soldCount
		}, 0),
		delay: 200,
		config: config.molasses,
	})

	const { sale } = useSpring({
		from: { sale: 0 },
		sale:
			posts.reduce((acc, post) => {
				return acc + post.price * post.soldCount
			}, 0) -
			posts.reduce((acc, post) => {
				const sale = priceAfterDiscount(post.price, post.discount)
				return acc + sale * post.soldCount
			}, 0),
		delay: 200,
		config: config.molasses,
	})

	const { profit } = useSpring({
		from: { profit: 0 },
		profit: posts.reduce((acc, post) => {
			const sale = priceAfterDiscount(post.price, post.discount)
			return acc + sale * post.soldCount
		}, 0),
		delay: 200,
		config: config.molasses,
	})

	const fetchData = async () => {
		setLoading(true)

		const q = query(
			collection(db, 'products'),
			where('authorId', '==', user.uid)
		)
		const querySnapshot = await getDocs(q)
		const data = querySnapshot.docs.map((doc) => doc.data())

		setPosts(data)
		setLoading(false)
	}

	useEffect(() => {
		fetchData()
	}, [])

	if (!user.isSeller) {
		navigate('/upgrade-to-seller')
		return
	}

	if (loading) return <Loading />

	return (
		<>
			<h1 className='text-xl md:text-2xl font-bold'>
				Cửa hàng của{' '}
				<span className='text-blue-500'>{user.displayName}</span>
			</h1>

			<div className='my-5'>
				<h2 className='text-xl font-semibold'>Doanh thu</h2>
				<div className='flex items-center justify-evenly flex-wrap gap-2 md:gap-0'>
					<div className='flex items-center justify-center gap-3 p-4 text-white bg-amber-500 shadow-md shadow-amber-500/50 rounded-md'>
						<BiPieChartAlt2 size='1.5em' />
						<div>
							<animated.span>
								{soldCount.to((n) => formatPrice(n.toFixed(0)))}
							</animated.span>{' '}
							sản phẩm đã bán
						</div>
					</div>

					<div className='flex items-center justify-center gap-3 p-4 text-white bg-emerald-500 shadow-md shadow-emerald-500/50 rounded-md'>
						<FaPiggyBank size='1.5em' />
						<div>
							₫{' '}
							<animated.span>
								{total.to((n) => formatPrice(n.toFixed(0)))}
							</animated.span>
						</div>
					</div>

					<div className='flex items-center justify-center gap-3 p-4 text-white bg-sky-500 shadow-md shadow-sky-500/50 rounded-md'>
						<FcSalesPerformance size='1.2em' />
						<div>
							₫{' '}
							<animated.span>
								{sale.to((n) => formatPrice(n.toFixed(0)))}
							</animated.span>
						</div>
					</div>
					<div className='flex items-center justify-center gap-3 p-4 text-white bg-indigo-500 shadow-md shadow-indigo-500/50 rounded-md'>
						<BsCashCoin size='1.5em' />
						<div>
							₫{' '}
							<animated.span>
								{profit.to((n) => formatPrice(n.toFixed(0)))}
							</animated.span>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h2 className='text-xl font-semibold mb-3'>Sản phẩm</h2>

				<div className='flex flex-col gap-5'>
					{/* sắp sếp theo số hàng bán được */}
					{posts &&
						posts.length > 0 &&
						posts
							.sort((a, b) => b.soldCount - a.soldCount)
							.map((post) => (
								<PostItem
									key={post.id}
									post={post}
									user={user}
									setLoading={setLoading}
									fetchData={fetchData}
								/>
							))}

					{posts.length === 0 && <Empty src={images.emptyData} />}
				</div>
			</div>
		</>
	)
}

export default memo(Shop)
