import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai'

export default function BtnSlider({ direction, moveSlide }) {
	const defaultClass =
		'flex items-center justify-center p-1 md:p-2 rounded-full bg-gray-800 text-white border-2 border-transparent focus:border-indigo-500 transition'
	const nextClass = 'absolute right-2 top-1/2 -translate-y-1/2'
	const prevClass = 'absolute left-2 top-1/2 -translate-y-1/2'

	return (
		<button
			onClick={moveSlide}
			className={
				direction === 'next'
					? `${defaultClass} ${nextClass}`
					: `${defaultClass} ${prevClass}`
			}>
			{direction === 'next' ? (
				<AiOutlineDoubleRight />
			) : (
				<AiOutlineDoubleLeft />
			)}
		</button>
	)
}
