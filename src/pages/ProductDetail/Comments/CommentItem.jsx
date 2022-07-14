import { memo, useState } from 'react'
import { AiFillDislike, AiFillLike } from 'react-icons/ai'
import { BsFillReplyFill } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'
import { doc, db, updateDoc } from '~/config'
import clsx from 'clsx'

function CommentItem({ comment, user, product }) {
	const [isLike, setIsLike] = useState(comment.likes.includes(user.uid))
	const [isDislike, setIsDislike] = useState(
		comment.dislikes.includes(user.uid)
	)
	const [likeLength, setLikeLength] = useState(comment.likes.length)
	const [dislikeLength, setIsDislikeLength] = useState(
		comment.dislikes.length
	)

	const handleOpen = (url) => window.open(url, '_blank')

	const handleLike = async () => {
		setIsLike(!isLike)
		setLikeLength(likeLength + (isLike ? -1 : 1))
		setIsDislike(false)
		if (isDislike) {
			setIsDislikeLength(dislikeLength - 1)
		}

		const newComment = {
			...comment,
			likes: comment.likes.find((id) => id === user.uid)
				? [...comment.likes.filter((id) => id !== user.uid)]
				: [...comment.likes, user.uid],
			dislikes: comment.dislikes.includes(user.uid)
				? [...comment.dislikes.filter((id) => id !== user.uid)]
				: [...comment.dislikes],
		}

		await updateDoc(doc(db, 'products', product.id), {
			comments: [
				...product.comments.filter((c) => c.id !== comment.id),
				newComment,
			],
		})
	}

	const handleDislike = async () => {
		setIsDislike(!isDislike)
		setIsDislikeLength(dislikeLength + (isDislike ? -1 : 1))
		setIsLike(false)
		if (isLike) {
			setLikeLength(likeLength - 1)
		}

		const newComment = {
			...comment,
			dislikes: comment.dislikes.find((id) => id === user.uid)
				? [...comment.dislikes.filter((id) => id !== user.uid)]
				: [...comment.dislikes, user.uid],
			likes: comment.likes.includes(user.uid)
				? [...comment.likes.filter((id) => id !== user.uid)]
				: [...comment.likes],
		}

		await updateDoc(doc(db, 'products', product.id), {
			comments: [
				...product.comments.filter((c) => c.id !== comment.id),
				newComment,
			],
		})
	}

	return (
		<div className='flex items-center gap-3'>
			<div className='shrink-0'>
				<img
					src={comment.author.photoURL}
					alt=''
					className='w-10 h-10 rounded-full object-cover'
				/>
			</div>

			<div className='flex-1 p-2 border rounded-sm bg-cream'>
				{comment.images.length > 0 && (
					<div className='flex items-center gap-1 md:gap-4 flex-wrap mb-1'>
						{comment.images.map((url) => (
							<img
								key={uuidv4()}
								src={url}
								alt={url}
								className='w-12 h-12 md:w-20 md:h-20 object-cover rounded-sm border'
								onClick={() => handleOpen(url)}
							/>
						))}
					</div>
				)}
				<div className='flex items-center justify-between flex-wrap'>
					<p>{comment.content}</p>
					<div className='flex items-center gap-3'>
						<button
							className={clsx(
								'flex items-center gap-1 hover:text-yellow-500 transition',
								{
									'cursor-pointer': !isLike,
									'text-yellow-500': isLike,
								}
							)}
							onClick={handleLike}>
							<AiFillLike />
							<span
								className={clsx({
									'animate-count-up': isLike,
									'animate-count-down': !isLike,
								})}>
								{likeLength}
							</span>
						</button>
						<button
							className={clsx(
								'flex items-center gap-1  hover:text-red-500 transition',
								{
									'cursor-pointer': !isDislike,
									'text-red-500': isDislike,
								}
							)}
							onClick={handleDislike}>
							<AiFillDislike />
							<span
								className={clsx({
									'animate-count-up': isDislike,
									'animate-count-down': !isDislike,
								})}>
								{dislikeLength}
							</span>
						</button>
						<button className='flex items-center gap-1 hover:text-blue-500 transition'>
							<BsFillReplyFill />
							<span>{comment.replies.length}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default memo(CommentItem)
