import { memo } from 'react'
import Image from '~/components/Image'
import clsx from 'clsx'

function Empty({ src, className }) {
	return (
		<div className={clsx('flex items-center justify-center', className)}>
			<Image src={src} alt='' className='block object-cover' />
		</div>
	)
}

export default memo(Empty)
