import { memo } from 'react'
import {
	BsTwitter,
	BsYoutube,
	BsFacebook,
	BsGithub,
	BsLink45Deg,
} from 'react-icons/bs'

function RenderIcons({ name }) {
	switch (name) {
		case 'twitter':
			return <BsTwitter className='text-sky-500' />
		case 'youtube':
			return <BsYoutube className='text-red-500' />
		case 'facebook':
			return <BsFacebook className='text-blue-500' />
		case 'github':
			return <BsGithub />
		case 'website':
			return <BsLink45Deg />
		default:
			throw new Error('Unknown icon name')
	}
}

export default memo(RenderIcons)
