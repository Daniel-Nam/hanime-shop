import { Link } from 'react-router-dom'

export default function LinkItem({ path, text }) {
	return (
		<Link
			to={path}
			className='block my-1 text-slate-400 hover:text-gray-800 transition'>
			{text}
		</Link>
	)
}
