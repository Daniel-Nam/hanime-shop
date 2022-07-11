import { useState, useEffect, Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { setData } from './store/reducers/userSlice'
import { publicRoutes, privateRoutes } from './routes'
import { DefaultLayout } from './layouts'
import { onAuthStateChanged, auth, getDoc, doc, db } from '~/config'
import Guard from './components/Guard'
import Loading from './components/Loading'

export default function App() {
	const dispatch = useDispatch()
	const [initializing, setInitializing] = useState(true)

	async function handleStateChanged(user) {
		if (user) {
			const docRef = doc(db, 'users', user.uid)
			const docSnap = await getDoc(docRef)
			dispatch(setData(docSnap.data()))
		}

		if (initializing) setInitializing(false)
	}

	useEffect(() => {
		const subscriber = onAuthStateChanged(auth, handleStateChanged)
		return subscriber
	}, [])

	if (initializing) return <Loading />

	return (
		<BrowserRouter>
			<Routes>
				{publicRoutes.map((route) => {
					let Layout = DefaultLayout
					if (route.layout) {
						Layout = route.layout
					} else if (route.layout === null) {
						Layout = Fragment
					}

					return (
						<Route
							key={route.path}
							path={route.path}
							element={
								<Layout>
									<route.component />
								</Layout>
							}
						/>
					)
				})}

				{privateRoutes.map((route) => {
					let Layout = DefaultLayout
					if (route.layout) {
						Layout = route.layout
					} else if (route.layout === null) {
						Layout = Fragment
					}

					return (
						<Route
							key={route.path}
							path={route.path}
							element={
								<Layout>
									<Guard>
										<route.component />
									</Guard>
								</Layout>
							}
						/>
					)
				})}
			</Routes>
			<ToastContainer />
		</BrowserRouter>
	)
}
