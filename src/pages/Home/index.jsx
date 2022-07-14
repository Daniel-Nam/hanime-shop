import { useState, useEffect, memo } from 'react'

import { db, collection, getDocs } from '~/config'
import Slider from './Slider'
import Loading from '~/components/Loading'
import RenderProducts from '~/components/RenderProducts'

function Home() {
	const [products, setProducts] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(db, 'products'))
			const data = querySnapshot.docs.map((doc) => doc.data())
			setProducts(data)
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
