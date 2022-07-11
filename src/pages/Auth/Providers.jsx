import { memo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookSquare } from 'react-icons/fa'

import {
	auth,
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
} from '~/config'

function Providers({ handleError, handleAuth }) {
	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider()
		await signInWithPopup(auth, provider)
			.then((result) => {
				const credential =
					GoogleAuthProvider.credentialFromResult(result)

				const token = credential.accessToken
				localStorage.setItem('token', token)

				handleAuth(result.user)
			})
			.catch((err) => handleError(err.message))
	}

	const handleFacebookLogin = async () => {
		const provider = new FacebookAuthProvider()
		await signInWithPopup(auth, provider)
			.then((result) => {
				const credential =
					FacebookAuthProvider.credentialFromResult(result)

				const token = credential.accessToken
				localStorage.setItem('token', token)

				handleAuth(result.user)
			})
			.catch((err) => handleError(err.message))
	}

	const list = [
		{
			name: 'google',
			handleClick: handleGoogleLogin,
			icon: <FcGoogle size='1.5em' />,
		},
		{
			name: 'facebook',
			handleClick: handleFacebookLogin,
			icon: <FaFacebookSquare size='1.5em' className='text-blue-500' />,
		},
	]

	return (
		<div className='flex flex-col items-center gap-5 my-5'>
			{list.map(({ icon, handleClick, name }) => (
				<button
					key={uuidv4()}
					className='flex items-center justify-center gap-3 w-4/5 p-2 rounded-full bg-gray-200 hover:shadow-xl hover:bg-gray-700 hover:text-white transition'
					onClick={handleClick}>
					{icon}
					<span className='font-bold capitalize'>{name}</span>
				</button>
			))}
		</div>
	)
}

export default memo(Providers)
