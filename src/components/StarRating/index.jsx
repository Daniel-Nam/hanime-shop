import { useState, memo } from 'react'
import { AiFillStar } from 'react-icons/ai'
import { updateDoc, doc, db } from '~/config'
import { toast } from 'react-toastify'

function StarRating({ rating, setRating, product, user, fetchData }) {
	const [hover, setHover] = useState(0)

	const handleRating = (index) => {
		if (!user) {
			toast.error('Bạn cần đăng nhập để đánh giá!')
			return
		}

		setRating(index)

		const data = {
			id: user.uid,
			count: index,
		}

		const toastId = toast.loading('Đang đánh giá! Vui lòng đợi ...')
		const newRating = [
			...product.rating.filter((x) => x.id !== user.uid),
			data,
		]

		updateDoc(doc(db, 'products', product.id), {
			rating: newRating,
		})
			.then(() => {
				toast.update(toastId, {
					render: 'Đánh giá thành công!',
					type: 'success',
					autoClose: 3000,
					isLoading: false,
				})
				fetchData()
			})
			.catch((err) => toast.error(err.message))
			.finally(() => toast.dismiss(toastId))
	}

	return (
		<div className='flex items-center'>
			{[...Array(5)].map((star, index) => {
				index += 1
				return (
					<button
						type='button'
						key={index}
						className={`transition
						${index <= (hover || rating) ? 'text-rose-500' : 'text-gray-400'}`}
						onClick={handleRating.bind(this, index)}
						onMouseEnter={() => setHover(index)}
						onMouseLeave={() => setHover(rating)}>
						<span className='star'>
							<AiFillStar />
						</span>
					</button>
				)
			})}
		</div>
	)
}

export default memo(StarRating)
