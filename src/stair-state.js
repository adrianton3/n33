(() => {
	'use strict'

	let screenImage = 'stair-screen'

	const stairState = {
		enter (game, { info }) {
			screenImage = info.screenImage
		},
		draw ({ images, context }) {
			context.drawImage(images[screenImage], 0, 0)
		},
		handleKeyDown ({ world, levels }, { setState }, { key }) {
			if (key === 'a') {
				setState('shop')
			}
		},
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		stairState,
	})
})()