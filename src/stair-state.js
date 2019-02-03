(() => {
	'use strict'

	const stairState = {
		draw ({ images, context }) {
			context.drawImage(images['stair-screen'], 0, 0)
		},
		handleKeyDown ({ world, levels }, { setState }, { key }) {
			if (key === 'a') {
				setState('play')
			}
		},
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		stairState,
	})
})()