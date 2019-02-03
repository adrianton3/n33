(() => {
	'use strict'

	function makeBuzzer () {
		const context = new AudioContext()

		const gain = context.createGain()
		gain.gain.setValueAtTime(0.2, context.currentTime)

		gain.connect(context.destination)

		function tone (freq, duration) {
			const osc = context.createOscillator()
			osc.type = 'square'

			osc.frequency.setValueAtTime(freq, context.currentTime)
			osc.start()
			osc.stop(context.currentTime + duration)

			osc.connect(gain)

			osc.addEventListener('ended', () => { osc.disconnect() })
		}

		return {
			tone,
		}
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		makeBuzzer,
	})
})()