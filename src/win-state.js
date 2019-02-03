(() => {
	'use strict'

	const winState = {
		draw ({ images, context }) {
			context.drawImage(images['win-screen'], 0, 0)
		},
		handleKeyDown ({ init }, { setState }, { key }) {
			init()
			setState('start')
		},
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		winState,
	})
})()