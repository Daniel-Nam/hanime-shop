export { default as uniqueSlug } from './uniqueSlug'

export const priceAfterDiscount = (price, discount) => {
	return price - (price * discount) / 100
}

export const formatPrice = (count) => {
	return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const calcAndFormat = (price, discount) => {
	if (discount !== 0) {
		const priceAfterDiscount = price - price * (discount / 100)
		return formatPrice(priceAfterDiscount)
	}

	return formatPrice(price)
}

export const formatDate = (timestamp) => {
	const options = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: false,
	}

	return new Intl.DateTimeFormat('vi-VN', options).format(timestamp)
}

export const formatURL = (from, to) => {
	return window.location.href.replace(from, to)
}
