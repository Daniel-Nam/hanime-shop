import { memo } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { userSelector } from '~/store/reducers/userSlice'

function Guard({ children }) {
	const user = useSelector(userSelector)

	if (!user) {
		return <Navigate to='/login' replace />
	}

	return children
}

export default memo(Guard)
