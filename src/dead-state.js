(() => {
	'use strict'

	const deadState = {
		draw ({ images, context }) {
			context.drawImage(images['dead-screen'], 0, 0)
		},
		handleKeyDown ({ world, levels }, { setState }, { key }) {
			if (key === 'a') {
				Object.assign(world.player, {
					x: 4,
					y: 4,
					direction: 'e',
					health: 100,
				})

				setState('play')
			}
		},
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		deadState,
	})
})()