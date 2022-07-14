import { memo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import clsx from 'clsx'

function Sizes({ selectedSize, setSelectedSize, sizes }) {
	return (
		<div className='flex items-center flex-wrap gap-5'>
			<div className='font-semibold'>Size:</div>
			<div className='flex items-center flex-wrap gap-3'>
				{sizes.map((size) => {
					return (
						<button
							key={uuidv4()}
							className={clsx(
								'block p-2 font-bold border rounded-sm transition',
								{
									'bg-gray-200': size === selectedSize,
								}
							)}
							onClick={() => setSelectedSize(size)}>
							{size}
						</button>
					)
				})}
			</div>
		</div>
	)
}

export default memo(Sizes)
