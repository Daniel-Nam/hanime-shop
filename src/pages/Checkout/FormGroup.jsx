import { useId, memo, useState } from 'react'

function FormGroup({ label, name, data, type, disabled }) {
	const [value, setValue] = useState(data)
	const id = useId()

	return (
		<div className='form-group'>
			<label htmlFor={id}>{label}</label>
			<input
				type={type || 'text'}
				id={id}
				name={name}
				className='form-input'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				disabled={disabled}
			/>
		</div>
	)
}

export default memo(FormGroup)
