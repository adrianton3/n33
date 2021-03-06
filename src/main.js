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
		const ignore = new Set([
			'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
			'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
		])

		const keys = {}

		window.addEventListener('keydown', (event) => {
			if (ignore.has(event.key)) {
				return
			}

			keys[event.key] = true
			machine.handleKeyDown(event)
		})

		window.addEventListener('keyup', (event) => {
			if (ignore.has(event.key)) {
				return
			}

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

		function init () {
			game.world = {
				player: {
					x: 4,
					y: 4,
					level: 'l1',
					direction: 's',
					lives: 3,
					health: 100,
					healthMax: 100,
					attack: 1,
					armor: 0,
					checkpoint: {
						x: 4,
						y: 4,
						level: 'l1',
					},
					xp: 0,
				},
			}

			game.levels = n33.compileLevels()
		}

		const machine = makeMachine(game)
		game.keys = setupInputHandlers(game.context.canvas, machine)

		game.particles = n33.makeParticles(game.context, game.images)
		game.audio = n33.makeBuzzer()

		init()
		game.init = init

		return { game, machine }
	}

	{
		const context = setupContext(document.getElementById('can'))

		n33.loadImages().then((images) => {
			const { machine } = setup({ context, images })

			machine.addState('start', n33.startState)
			machine.addState('play', n33.playState)
			machine.addState('dead', n33.deadState)
			machine.addState('stair', n33.stairState)
			machine.addState('shop', n33.shopState)
			machine.addState('win', n33.winState)

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
	}
})()