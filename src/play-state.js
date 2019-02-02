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
			const { player } = world

			const cameraPosition = {
				x: Math.min(Math.max(player.x - 4, 0), level[0].length),
				y: Math.min(Math.max(player.y - 4, 0), level.length),
			}

			for (let i = 0; i < cameraSize.y; i++) {
				for (let j = 0; j < cameraSize.x; j++) {
					const cell = level[cameraPosition.y + i][cameraPosition.x + j]

					context.drawImage(
						images[cell.image],

						j * tileSize.x - offset.x,
						i * tileSize.y - offset.y,
					)
				}
			}

			context.drawImage(
				images['p-e'],

				(player.x - cameraPosition.x) * tileSize.x - offset.x,
				(player.y - cameraPosition.y) * tileSize.y - offset.y,
			)

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