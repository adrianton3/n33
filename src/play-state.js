(() => {
	'use strict'

	const cameraSize = {
		x: 7,
		y: 7,
	}

	const tileSize = {
		x: 8,
		y: 8,
	}

	const offset = {
		x: Math.floor(tileSize.x / 2),
		y: Math.floor(tileSize.y / 2),
	}

	const playState = {
		enter (game) {

		},
		draw ({ images, context, levels, world }) {
			const level = levels['l1']

			for (let i = 0; i < cameraSize.y; i++) {
				for (let j = 0; j < cameraSize.x; j++) {
					const cell = level[world.player.y - 4 + i][world.player.x - 4 + j]

					context.drawImage(
						images[cell.image],

						j * tileSize.x - offset.x,
						i * tileSize.y - offset.y,
					)
				}
			}

			// map
			// mobs
			// player
			// effects
			// border
			// side panel
			// stats
		},
		tick (game, { setState }) {
			// animation frame
		},
		handleKeyDown (game, { setState }, { key }) {

		},
		exit () {

		},
	}


	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		playState,
	})
})()