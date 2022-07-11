import { memo } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function NoSidebar({ children }) {
	return (
		<>
			<Header />
			<main className='min-h-screen py-5 px-7 md:py-10 md:px-12'>
				{children}
			</main>
			<Footer />
		</>
	)
}

export default memo(NoSidebar)
