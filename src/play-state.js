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
				x: Math.min(Math.max(player.x - 4, 0), level.size.x - cameraSize.x),
				y: Math.min(Math.max(player.y - 4, 0), level.size.y - cameraSize.y),
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
				images[`p-${player.direction}`],

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
		handleKeyDown ({ world, levels }, { setState }, { key }) {
			const level = levels['l1']
			const { player } = world

			if (key === 'ArrowUp') {
				if (player.y > 0) {
					player.y--
					player.direction = 'n'
				}
			} else if (key === 'ArrowLeft') {
				if (player.x > 0) {
					player.x--
					player.direction = 'w'
				}
			} else if (key === 'ArrowDown') {
				if (player.y < level.size.y - 1) {
					player.y++
					player.direction = 's'
				}
			} else if (key === 'ArrowRight') {
				if (player.x < level.size.x - 1) {
					player.x++
					player.direction = 'w'
				}
			}


		},
		exit () {

		},
	}


	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		playState,
	})
})()