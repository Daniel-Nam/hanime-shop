import { memo, useEffect, useState } from 'react'
import { BsFillArrowUpCircleFill } from 'react-icons/bs'

function GoTop() {
	const [state, setState] = useState(false)

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [state])

	const handleScroll = () => setState(window.pageYOffset > 80)
	const handleGoTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

	return (
		<div className='fixed bottom-4 right-4 md:bottom-7 md:right-7'>
			{state && (
				<button
					className='block border-2 bg-white rounded-full shadow-lg transition'
					onClick={handleGoTop}>
					<BsFillArrowUpCircleFill size='2em' />
				</button>
			)}
		</div>
	)
}

export default memo(GoTop)
