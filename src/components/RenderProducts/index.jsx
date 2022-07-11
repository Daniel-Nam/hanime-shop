import { memo } from 'react'
import { Link } from 'react-router-dom'
import { BsFillEmojiHeartEyesFill } from 'react-icons/bs'

import { calcAndFormat, formatPrice } from '~/utils'
import Image from '~/components/Image'
import images from '~/assets/images'
import Empty from '~/components/Empty'

function RenderProducts({ data }) {
	if (data.length === 0) return <Empty src={images.emptyData} />

	return (
		<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-7'>
			{data
				.sort((a, b) => {
					if (a.isTrusted && !b.isTrusted) return -1
					if (!a.isTrusted && b.isTrusted) return 1
					return b.createdAt - a.createdAt
				})
				.map((product) => (
					<div
						key={product.id}
						className='relative border shadow rounded-sm transition hover:shadow-xl hover:scale-105'>
						{product.isFavorite && (
							<div className='absolute -top-2 -left-2 p-1 bg-indigo-500 text-white rounded-full'>
								<BsFillEmojiHeartEyesFill />
							</div>
						)}

						{product.discount > 0 && (
							<div className='absolute top-0 right-0 text-sm text-white bg-blue-500 rounded-bl-md p-1'>
								{product.discount}% giảm
							</div>
						)}

						<div>
							<Link to={`/product/${product.slug}`}>
								<Image
									src={product.images[0]}
									alt={product.images[0]}
									className='w-full h-[140px] md:h-[200px] object-cover'
								/>
							</Link>
						</div>
						<div className='flex flex-col h-[calc(100%-140px)] md:h-[calc(100%-200px)] p-2'>
							<div className='line-clamp-2 font-bold text-lg'>
								<Link to={`/product/${product.slug}`}>
									{product.name}
								</Link>
							</div>

							{/* Price */}
							<div className='flex items-center justify-between flex-wrap w-full mt-auto text-sm md:text-base'>
								<div className='text-red-500 font-semibold'>
									₫{' '}
									{calcAndFormat(
										product.price,
										product.discount
									)}
								</div>
								<div className='text-sm text-gray-600'>
									Đã bán {formatPrice(product.soldCount)}
								</div>
							</div>
						</div>
					</div>
				))}
		</div>
	)
}

export default memo(RenderProducts)
