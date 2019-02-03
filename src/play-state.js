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

	const bumpTimeMax = 100
	let bumpTime = -bumpTimeMax

	const hurtTimeMax = 100

	const playState = {
		enter (game) {

		},
		draw ({ images, context, levels, world, particles }) {
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

					if (
						cell.hurtTime != null &&
						cell.hurtImage != null &&
						performance.now() - cell.hurtTime < hurtTimeMax
					) {
						context.drawImage(
							images[cell.hurtImage],
							j * tileSize.x - offset.x,
							i * tileSize.y - offset.y,
						)
					} else {
						const image = cell.images != null
							? cell.images[frameIndex % cell.images.length]
							: cell.image

						if (image != null) {
							context.drawImage(
								images[image],
								j * tileSize.x - offset.x,
								i * tileSize.y - offset.y,
							)
						}
					}
				}
			}

			const playerImage = performance.now() - bumpTime > bumpTimeMax
				? `p-${player.direction}`
				: `p-${player.direction}-b`

			context.drawImage(
				images[playerImage],
				(player.x - cameraPosition.x) * tileSize.x - offset.x,
				(player.y - cameraPosition.y) * tileSize.y - offset.y,
			)

			particles.draw(
				cameraPosition.x * tileSize.x - offset.x,
				cameraPosition.y * tileSize.y - offset.y,
			)

			context.drawImage(images['frame'], 0, 0)

			for (let i = 0; i < player.lives; i++) {
				context.drawImage(images['heart'], 50 + i * 8 - 1, 2)
			}

			drawText(context, images, `xp ${player.xp}`, 50, 2 + 10)

			drawText(context, images, `hp ${player.health}`, 50, 21)
			drawText(context, images, `a ${player.attack}`, 50, 27)
			drawText(context, images, `d ${player.armor}`, 70, 27)

			{
				const front = {
					x: player.x + { 'n': 0, 'w': -1, 's': 0, 'e': 1 }[player.direction],
					y: player.y + { 'n': -1, 'w': 0, 's': 1, 'e': 0 }[player.direction],
				}

				const frontCell = level[front.y][front.x]
				if (frontCell.type === 'mob') {
					drawText(context, images, `hp ${frontCell.health}`, 50, 35)
					drawText(context, images, `a ${frontCell.attack}`, 50, 41)
					drawText(context, images, `d ${frontCell.armor}`, 70, 41)
				}
			}


		},
		tick ({ particles }, { setState }, deltaTime) {
			particles.tick(deltaTime)

			frameTime += deltaTime
			if (frameTime > frameTimeMax) {
				frameTime -= frameTimeMax
				frameIndex++
			}
		},
		handleKeyDown ({ world, levels, particles, audio }, { setState }, { key }) {
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
				bumpTime = performance.now()
				return
			}

			if (nextCell.type === 'floor') {
				player.x = nextPosition.x
				player.y = nextPosition.y

				player.health -= 1
				if (player.health <= 0) {
					setState('dead')
				}

				audio.tone(110, 0.05)

				return
			}

			if (nextCell.type === 'mob') {
				bumpTime = performance.now()
				nextCell.hurtTime = bumpTime

				nextCell.health -= Math.max(player.attack - nextCell.armor, 0)
				if (nextCell.health < 0) {
					player.xp += nextCell.xpReward

					nextCell.type = 'floor'
					nextCell.image = nextCell.behind
					nextCell.images = null

					audio.tone(220, 0.1)
					particles.explode(
						nextPosition.x * tileSize.x - offset.x,
						nextPosition.y * tileSize.y - offset.y,
						100,
					)

					return
				} else {
					audio.tone(440, 0.2)
					particles.explode(
						nextPosition.x * tileSize.x - offset.x,
						nextPosition.y * tileSize.y - offset.y,
						10,
					)
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

				player.checkpoint.level = nextCell.level
				player.checkpoint.x = nextCell.x
				player.checkpoint.y = nextCell.y

				setState('stair', { screenImage: nextCell.screenImage })
				return
			}

			if (nextCell.type === 'key') {
				bumpTime = performance.now()

				if (!player.key) {
					player.key = true
					nextCell.type = 'floor'
					nextCell.image = nextCell.behind
				}
				return
			}

			if (nextCell.type === 'door') {
				bumpTime = performance.now()

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