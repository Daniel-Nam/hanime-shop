import { memo } from 'react'
import { IoClose } from 'react-icons/io5'
import { formatDate, calcAndFormat } from '~/utils'
import Image from '~/components/Image'

function CartItem({ data, handleDelete }) {
	return (
		<div
			key={data.id}
			className='relative flex flex-col gap-2 p-2 bg-slate-100 border rounded-sm transition md:flex-row md:gap-5'>
			<button
				className='absolute top-1 right-1'
				onClick={() => handleDelete(data)}>
				<IoClose size='1.4em' />
			</button>

			<div>
				<Image
					src={data.images[0]}
					alt=''
					className='w-24 h-24 md:w-32 md:h-32 rounded-full border shadow object-cover mx-auto'
				/>
			</div>

			<div className='flex-1 flex flex-col gap-1 justify-evenly text-sm md:text-base md:gap-0'>
				<div className='text-lg font-bold line-clamp-2'>
					{data.name}
				</div>

				<div>
					Mã đơn hàng:{' '}
					<span className='font-semibold'>{data.id}</span>
				</div>

				{data.size && (
					<div>
						Size: <span className='font-semibold'>{data.size}</span>
					</div>
				)}

				<div>Đặt hàng lúc: {formatDate(data.createdAt)}</div>

				<div>
					<span>Giá: </span>

					<span className='font-bold text-red-500'>
						₫ {calcAndFormat(data.price, data.discount)} x{' '}
						{data.count}
					</span>

					{data.discount > 0 && (
						<span className='font-semibold'>
							{' '}
							({data.discount}% đã giảm)
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

export default memo(CartItem)
