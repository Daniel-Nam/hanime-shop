/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				login: 'url(/src/assets/images/background.gif)',
			},
			backgroundColor: {
				cream: 'rgb(245 247 252)',
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
				'count-up': {
					'0%': {
						opacity: 0,
						transform: 'translate3d(0, 10px, 0)',
					},
				},
				'count-down': {
					'0%': {
						opacity: 0,
						transform: 'translate3d(0, -10px, 0)',
					},
				},
			},
			animation: {
				drop: 'drop-down 0.3s ease-in-out',
				'slide-left': 'slide-left 0.6s ease-in-out',
				'count-up': 'count-up 0.3s ease-in-out',
				'count-down': 'count-down 0.3s ease-in-out',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
}
