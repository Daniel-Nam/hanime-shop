import { memo } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { userSelector } from '~/store/reducers/userSlice'
import images from '~/assets/images'
import Empty from '~/components/Empty'

function Bookmarks() {
	const user = useSelector(userSelector)

	if (user.bookmarks.length === 0)
		return <Empty src={images.emptyData} className='h-[calc(100vh-64px)]' />

	return (
		<div>
			{user.bookmarks.map((item) => (
				<div key={uuidv4()}>
					<img
						src={item.imageURL}
						alt={item.name}
						className='block w-full h-full'
					/>
				</div>
			))}
		</div>
	)
}

export default memo(Bookmarks)
