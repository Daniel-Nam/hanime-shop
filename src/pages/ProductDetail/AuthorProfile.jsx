import { memo } from 'react'
import { Link } from 'react-router-dom'

function AuthorProfile({ author }) {
	return (
		<div>
			<h3 className='text-xl md:text-2xl font-bold mb-1'>
				Thông tin người bán
			</h3>

			<div className='flex items-center gap-3 md:pr-7 md:border-r-2'>
				<div className='shrink-0'>
					<Link to={`/@${author.username}`}>
						<img
							src={author.photoURL}
							alt=''
							className='w-12 h-12 md:w-20 md:h-20 object-cover rounded-full border shadow'
						/>
					</Link>
				</div>
				<div>
					<h4 className='text-lg font-bold'>{author.displayName}</h4>
					<span>@{author.username}</span>
				</div>
			</div>
		</div>
	)
}

export default memo(AuthorProfile)
