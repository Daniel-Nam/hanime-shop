import { Link } from 'react-router-dom'

export default function SearchItem({ text, url, Icon }) {
	return (
		<Link
			to={url}
			className='block my-1 text-slate-500 hover:text-black transition'
			onClick={(e) => e.stopPropagation()}>
			{Icon}
			{text.length > 40 ? (
				<span>
					{text.substring(0, 37)}
					...
				</span>
			) : (
				text
			)}
		</Link>
	)
}
