import { useState, memo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import images from '~/assets/images'
import BtnSlider from './BtnSlider'

function Slider() {
	const [slideIndex, setSlideIndex] = useState(1)

	const nextSlide = () => {
		if (slideIndex !== dataSlider.length) {
			setSlideIndex(slideIndex + 1)
		} else if (slideIndex === dataSlider.length) {
			setSlideIndex(1)
		}
	}

	const prevSlide = () => {
		if (slideIndex !== 1) {
			setSlideIndex(slideIndex - 1)
		} else if (slideIndex === 1) {
			setSlideIndex(dataSlider.length)
		}
	}

	const moveDot = (index) => {
		setSlideIndex(index)
	}

	const dataSlider = [images.bannerOne, images.bannerTwo, images.bannerThree]

	return (
		<div className='relative flex items-center overflow-hidden mb-7'>
			{dataSlider.map((item, index) => (
				<div
					key={uuidv4()}
					className={
						slideIndex === index + 1
							? 'flex-1 block rounded-md bg-slate-100'
							: 'hidden'
					}>
					<img
						src={item}
						alt='slider'
						className='block w-full min-h-[140px] max-h-[300px] object-cover rounded-md animate-slide-left'
					/>
				</div>
			))}

			<div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3'>
				{Array.from({ length: dataSlider.length }).map(
					(item, index) => (
						<button
							key={uuidv4()}
							onClick={() => moveDot(index + 1)}
							className={`block py-1 px-3 rounded-full transition ${
								slideIndex === index + 1
									? 'px-5 bg-blue-500 shadow-md shadow-blue-500/50'
									: 'bg-gray-700'
							}`}
						/>
					)
				)}
			</div>

			<BtnSlider moveSlide={prevSlide} direction={'prev'} />
			<BtnSlider moveSlide={nextSlide} direction={'next'} />
		</div>
	)
}

export default memo(Slider)
