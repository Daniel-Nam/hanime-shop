/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				login: 'url(/src/assets/images/background.gif)',
			},
			keyframes: {
				'drop-down': {
					'0%': {
						opacity: 0,
						transform: 'translateY(-20%)',
					},
				},
				'slide-left': {
					'0%': {
						transform: 'translateX(100%)',
					},
				},
			},
			animation: {
				drop: 'drop-down 0.3s ease-in-out',
				'slide-left': 'slide-left 0.6s ease-in-out',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
}
