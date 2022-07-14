import { useId, memo } from 'react'

function FormGroup({ label, name }) {
	const id = useId()

	return (
		<div>
			<label htmlFor={id}>{label}</label>
			<input type='text' id={id} name={name} />
		</div>
	)
}

export default memo(FormGroup)
