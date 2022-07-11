import { memo } from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import GoTop from '../components/GoTop'

function DefaultLayout({ children }) {
	return (
		<>
			<Header />
			<main className='flex min-h-screen'>
				<Sidebar />
				<div className='w-full md:max-w-[calc(100%-96px)] p-4'>
					{children}
				</div>
			</main>
			<GoTop />
			<Footer />
		</>
	)
}

export default memo(DefaultLayout)
