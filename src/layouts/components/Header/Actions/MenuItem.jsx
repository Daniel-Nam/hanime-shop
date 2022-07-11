import { memo } from 'react'
import { Link } from 'react-router-dom'

function MenuItem({ path, text }) {
	return (
		<Link
			to={path}
			className='block my-1 text-gray-500 hover:text-black transition'>
			{text}
		</Link>
	)
}

export default memo(MenuItem)
