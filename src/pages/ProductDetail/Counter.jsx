import { memo } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'

function Counter({ count, setCount, productCount }) {
	const handleDecrease = () => {
		if (count === '') return
		if (isNaN(count)) return

		const countNum = parseInt(count)
		if (countNum <= 0) return

		setCount(countNum - 1)
	}

	const handleIncrease = () => {
		if (count === '') return
		if (isNaN(count)) return

		setCount(parseInt(count) + 1)
	}

	return (
		<div className='flex items-center gap-5'>
			<div className='font-semibold'>Số lượng</div>

			<div className='flex items-center gap-3'>
				<div className='flex items-center border rounded-sm'>
					<button
						className='inline-block font-bold py-2 px-3 hover:bg-slate-300 rounded-tl-sm rounded-bl-sm transition'
						onClick={handleDecrease}>
						<AiOutlineMinus size='1.5em' />
					</button>

					<input
						type='text'
						className='block max-w-[100px] outline-none text-center font-bold'
						value={count}
						onChange={(e) => setCount(e.target.value)}
					/>

					<button
						className='inline-block font-bold py-2 px-3 hover:bg-slate-300 rounded-tr-sm rounded-br-sm transition'
						onClick={handleIncrease}>
						<AiOutlinePlus size='1.5em' />
					</button>
				</div>

				<div className='hidden lg:block text-sm font-semibold text-gray-600'>
					{productCount} sản phẩm có sẵn
				</div>
			</div>
		</div>
	)
}

export default memo(Counter)
