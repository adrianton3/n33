(() => {
	'use strict'

	const startState = {
		draw ({ images, context }) {
			context.drawImage(images['start-screen'], 0, 0)
		},
		handleKeyDown ({ world, levels }, { setState }, { key }) {
			setState('play')
		},
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		startState,
	})
})()