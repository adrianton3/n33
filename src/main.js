(() => {
	'use strict'

	function makeMachine (game) {
		let state = 'start'
		let oldState = null

		const machine = {}

		function setState (newState, info) {
			if (machine[state].exit != null) {
				machine[state].exit(game, { newState })
			}

			oldState = state
			state = newState

			if (machine[state].enter != null) {
				machine[state].enter(game, { oldState, info })
			}
		}

		function addState (name, state) {
			machine[name] = state
		}

		function tick (deltaTime) {
			if (machine[state].tick != null) {
				machine[state].tick(game, { setState }, deltaTime)
			}
		}

		function draw () {
			if (machine[state].draw != null) {
				machine[state].draw(game)
			}
		}

		function handleKeyUp (event) {
			if (machine[state].handleKeyUp != null) {
				event.preventDefault()
				machine[state].handleKeyUp(game, { setState }, event)
			}
		}

		function handleKeyDown (event) {
			if (machine[state].handleKeyDown != null) {
				event.preventDefault()
				machine[state].handleKeyDown(game, { setState }, event)
			}
		}

		return { addState, tick, draw, handleKeyUp, handleKeyDown }
	}

	function setupInputHandlers (canvas, machine) {
		const keys = {}

		window.addEventListener('keydown', (event) => {
			keys[event.key] = true
			machine.handleKeyDown(event)
		})

		window.addEventListener('keyup', (event) => {
			keys[event.key] = false
			machine.handleKeyUp(event)
		})

		return keys
	}

	function setupContext (canvas) {
		canvas.width = 84
		canvas.height = 48

		const scale = 8

		canvas.style.width = `${canvas.width * scale}px`
		canvas.style.height = `${canvas.height * scale}px`
		canvas.style.imageRendering = 'pixelated'

		return canvas.getContext('2d')
	}

	function setup (extras) {
		const game = { ...extras }
		const canvas = document.getElementById('can')
		game.context = setupContext(canvas)

		const machine = makeMachine(game)
		game.keys = setupInputHandlers(canvas, machine)

		game.world = {
			player: {
				x: 4,
				y: 4,
				level: 'l1',
				direction: 'e',
				health: 100,
				attack: 2,
				armor: 1,
			},
		}

		game.levels = n33.levels
		game.particles = n33.makeParticles(game.context, game.images)
		game.audio = n33.makeBuzzer()

		return { game, machine }
	}

	n33.loadImages().then((images) => {
		const { machine } = setup({ images })

		machine.addState('start', { tick (game, { setState }) { setState('play') } })
		machine.addState('play', n33.playState)
		machine.addState('dead', n33.deadState)
		machine.addState('stair', n33.stairState)

		;(() => {
			let lastTime = performance.now()

			;(function loop() {
				requestAnimationFrame(loop)

				const now = performance.now()
				machine.tick(now - lastTime)
				lastTime = now

				machine.draw()
			})()
		})()
	})
})()