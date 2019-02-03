(() => {
	'use strict'

	const deadState = {
		draw ({ images, context }) {
			context.drawImage(images['dead-screen'], 0, 0)
		},
		handleKeyDown ({ world, levels, init }, { setState }, { key }) {
			if (key === 'a') {
				const { player } = world

				if (player.lives > 0) {
					player.lives--

					player.level = player.checkpoint.level
					player.x = player.checkpoint.x
					player.y = player.checkpoint.y
				} else {
					init()
				}

				setState('play')
			}
		},
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		deadState,
	})
})()