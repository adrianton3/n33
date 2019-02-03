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

	const attackCost = [10, 20, 40, 60, 90, 100, 140, 180, 260, 300]
	const armorCost = [10, 15, 25, 40, 60, 80, 100, 130, 160, 200]
	const healthMaxCost = [10, 20, 40, 60, 90, 100, 140, 180, 260, 300]

	const shopState = {
		draw ({ images, context, world }) {
			const { player } = world

			context.drawImage(images['shop-screen'], 0, 0)

			drawText(context, images, `${player.xp}`, 71, 2)

			drawText(context, images, `${player.attack}`, 32, 14)
			drawText(context, images, `${healthMaxCost[player.attack]}`, 71, 14)

			drawText(context, images, `${player.armor}`, 32, 20)
			drawText(context, images, `${healthMaxCost[player.attack]}`, 71, 20)

			drawText(context, images, `${player.healthMax}`, 32, 26)
			drawText(context, images, `${healthMaxCost[player.healthMax / 10 - 10]}`, 71, 26)
		},
		handleKeyDown ({ world, levels, init }, { setState }, { key }) {
			const { player } = world

			if (key === 'a') {
				player.health = player.healthMax
				setState('play')
				return
			}

			if (key === 'ArrowUp') {
				if (player.xp >= attackCost[player.attack]) {
					player.xp -= attackCost[player.attack]
					player.attack++
				}

				return
			}

			if (key === 'ArrowLeft') {
				if (player.xp > armorCost[player.armor]) {
					player.xp -= armorCost[player.armor]
					player.armor++
				}

				return
			}

			if (key === 'ArrowRight') {
				const index = player.healthMax / 10 - 10
				if (player.xp > healthMaxCost[index]) {
					player.xp -= healthMaxCost[index]
					player.healthMax += 10
				}

				return
			}
		},
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		shopState,
	})
})()