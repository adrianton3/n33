(() => {
	'use strict'

	// move out
	function drawText (context, images, string, x, y) {
		let cursor = x
		for (let i = 0; i < string.length; i++) {
			const image = images[string[i]]
			context.drawImage(image, cursor, y)
			cursor += image.width + 1
		}
	}

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

	let frameTime = 0
	const frameTimeMax = 300
	let frameIndex = 0

	const playState = {
		enter (game) {

		},
		draw ({ images, context, levels, world }) {
			const level = levels[world.player.level]
			const { player } = world

			const cameraPosition = {
				x: Math.min(Math.max(player.x - 4, 0), level.size.x - cameraSize.x),
				y: Math.min(Math.max(player.y - 4, 0), level.size.y - cameraSize.y),
			}

			for (let i = 0; i < cameraSize.y; i++) {
				for (let j = 0; j < cameraSize.x; j++) {
					const cell = level[cameraPosition.y + i][cameraPosition.x + j]

					if (cell.behind != null) {
						context.drawImage(
							images[cell.behind],
							j * tileSize.x - offset.x,
							i * tileSize.y - offset.y,
						)
					}

					const image = cell.images != null
						? cell.images[frameIndex % cell.images.length]
						: cell.image

					context.drawImage(
						images[image],
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

			context.drawImage(images['frame'], 0, 0)

			drawText(context, images, `${player.health}`, 52, 8)

			// map
			// mobs
			// player
			// effects
			// border
			// side panel
			// stats
		},
		tick (game, { setState }, deltaTime) {
			frameTime += deltaTime
			if (frameTime > frameTimeMax) {
				frameTime -= frameTimeMax
				frameIndex++
			}
		},
		handleKeyDown ({ world, levels }, { setState }, { key }) {
			const level = levels[world.player.level]
			const { player } = world

			const nextPosition = {
				x: player.x,
				y: player.y,
				direction: player.direction,
			}

			if (key === 'ArrowUp') {
				nextPosition.y--
				player.direction = 'n'
			} else if (key === 'ArrowLeft') {
				nextPosition.x--
				player.direction = 'w'
			} else if (key === 'ArrowDown') {
				nextPosition.y++
				player.direction = 's'
			} else if (key === 'ArrowRight') {
				nextPosition.x++
				player.direction = 'e'
			}

			if (
				nextPosition.x < 0 ||
				nextPosition >= level.size.x ||
				nextPosition.y < 0 ||
				nextPosition >= level.size.y
			) {
				return
			}

			const nextCell = level[nextPosition.y][nextPosition.x]

			if (nextCell.type === 'wall') {
				return
			}

			if (nextCell.type === 'floor') {
				player.x = nextPosition.x
				player.y = nextPosition.y

				player.health -= 5
				if (player.health <= 0) {
					setState('dead')
				}

				return
			}

			if (nextCell.type === 'mob') {
				nextCell.health -= Math.max(player.attack - nextCell.armor, 0)
				if (nextCell.health < 0) {
					nextCell.type = 'floor'
					nextCell.image = nextCell.behind
					return
				}

				player.health -= Math.max(nextCell.attack - player.armor, 0)
				if (player.health <= 0) {
					setState('dead')
				}
				return
			}

			if (nextCell.type === 'portal') {
				player.level = nextCell.level
				player.x = nextCell.x
				player.y = nextCell.y
				return
			}

			if (nextCell.type === 'key') {
				if (!player.key) {
					player.key = true
					nextCell.type = 'floor'
					nextCell.image = nextCell.behind
				}
				return
			}

			if (nextCell.type === 'door') {
				if (player.key) {
					player.key = false
					nextCell.type = 'floor'
					nextCell.image = nextCell.behind
				}
				return
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