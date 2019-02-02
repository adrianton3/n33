(() => {
	'use strict'

	function makeParticles (context, images) {
		let particles = []

		function explode (x, y, count) {
			particles = particles.filter(({ dead }) => !dead)

			for (let i = 0; i < count; i++) {
				particles.push({
					dead: false,
					x,
					y,
					dx: (Math.random() - 0.5) * 0.1,
					dy: (Math.random() - 0.5) * 0.1, // should normalise!!!
				})
			}
		}

		function tick (deltaTime) {
			particles.forEach((particle) => {
				if (particle.dead) {
					return
				}

				particle.dy += 0.00006 * deltaTime
				particle.x += particle.dx * deltaTime
				particle.y += particle.dy * deltaTime

				if (particle.y > 1000) {
					particle.dead = true
				}
			})
		}

		function draw (offsetX, offsetY) {
			const image = images['particle']

			particles.forEach(({ dead, x, y }) => {
				if (dead) {
					return
				}

				context.drawImage(
					image,
					Math.floor(x - offsetX),
					Math.floor(y - offsetY),
				)
			})
		}

		return { explode, tick, draw }
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		makeParticles,
	})
})()