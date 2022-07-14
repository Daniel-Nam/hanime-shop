import Image from '~/components/Image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

function ImageSlider({ data, setPreview }) {
	const options = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 4,
		autoplay: true,
		autoplaySpeed: 3000,
	}

	return (
		<div className='mt-3 overflow-hidden sm:px-6'>
			<Slider {...options}>
				{data.map((img) => (
					<div
						key={img}
						className='p-1 pb-0 border border-transparent hover:border-orange-500 transition'>
						<Image
							src={img.url}
							alt={img.url}
							className='block w-full h-16 object-cover mx-auto'
							onClick={() => setPreview(img.url)}
						/>
					</div>
				))}
			</Slider>
		</div>
	)
}

export default ImageSlider
