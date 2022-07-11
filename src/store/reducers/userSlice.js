import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		data: null,
	},
	reducers: {
		setData: (state, action) => {
			state.data = action.payload
		},
		updateData: (state, action) => {
			state.data = { ...state.data, ...action.payload }
		},
		addData(state, action) {
			const { fn, data } = action.payload
			state.data[fn].unshift(data)
		},
	},
})

// selector
export const userSelector = (state) => state.user.data

// actions
export const { setData, updateData, addData } = userSlice.actions

// reducer
export default userSlice.reducer
