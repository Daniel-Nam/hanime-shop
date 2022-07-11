import { useState, useEffect, memo } from 'react'

import { db, collection, getDocs } from '~/config'
import Slider from '~/components/Slider'
import Loading from '~/components/Loading'
import RenderProducts from '~/components/RenderProducts'

function Home() {
	const [products, setProducts] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			const arr = []

			const querySnapshot = await getDocs(collection(db, 'products'))
			querySnapshot.forEach((doc) => {
				arr.push(doc.data())
			})

			setProducts(arr)
			setIsLoading(false)
		}

		fetchData()
	}, [])

	if (isLoading) return <Loading />

	return (
		<>
			<Slider />
			<RenderProducts data={products} />
		</>
	)
}

export default memo(Home)
