import { memo, useState } from 'react'

function Description({ data }) {
	const [show, setShow] = useState(false)

	const handleShowMore = () => setShow(true)
	const handleShowLess = () => setShow(false)

	return (
		<div>
			<h3 className='text-xl md:text-2xl font-bold'>Mô tả sản phẩm</h3>

			{/* nếu nội dung quá dài hiển thị chữ xem thêm */}
			<div>
				<div
					className='break-words text-gray-600 text-sm md:text-base'
					dangerouslySetInnerHTML={{
						__html: show ? data : data.slice(0, 500) + '...',
					}}
				/>

				<div className='flex justify-center'>
					<button
						className='btn btn-outline-gray'
						onClick={show ? handleShowLess : handleShowMore}>
						{show ? 'Thu gọn' : 'Xem thêm'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default memo(Description)
