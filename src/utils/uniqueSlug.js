import { db, query, collection, where, getDocs } from '~/config'

const slugify = (text) => {
	return (
		text
			.toString() // Cast to string (optional)
			.normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
			.toLowerCase() // Convert the string to lowercase letters
			.trim() // Remove whitespace from both sides of a string (optional)
			.replace(/\s+/g, '-') // Replace spaces with -
			// eslint-disable-next-line no-useless-escape
			.replace(/[^\w\-]+/g, '') // Remove all non-word chars
			// eslint-disable-next-line no-useless-escape
			.replace(/\-\-+/g, '-')
	) // Replace multiple - with single -
}

const uniqueSlug = async (options) => {
	const { value, path, field } = options
	let newSlug = slugify(value)

	const q = query(collection(db, path), where(field, '==', newSlug))
	const querySnapshot = await getDocs(q)

	if (querySnapshot.docs.length > 0) {
		newSlug = newSlug + '-' + querySnapshot.docs.length
	}

	return newSlug
}

export default uniqueSlug
