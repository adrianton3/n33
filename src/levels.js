(() => {
	'use strict'

	function makeFloor (image) {
		return {
			type: 'floor',
			image,
		}
	}

	function makeWall (image) {
		return {
			type: 'wall',
			image,
			blocking: true,
		}
	}

	function makeMob () {
		return {
			type: 'mob',
			image: 'm1', // mobType
			behind: 'background1',
		}
	}

	const definitions = {
		'background1': makeFloor('b1'),
		'background2': makeFloor('b2'),
		'wall1': makeWall('w1'),
		'mob1': makeMob(),
	}

	const levels = {}

	function compileLevel (symbols, lines) {
		const compiled = lines.map((line) =>
			[...line].map((cell) =>
				definitions[symbols[cell]]
			)
		)

		compiled.size = {
			x: lines[0].length,
			y: lines.length,
		}

		return compiled
	}

	{
		const symbols = {
			'b': 'background1',
			'B': 'background2',
			'w': 'wall1',
			'm': 'mob1',
		}

		levels['l1'] = compileLevel(symbols, [
			'wwwwwwwwwwwww',
			'wbbwbbbbbbbbw',
			'wbBbbBbbwbbbw',
			'wbbBbbbbwbbbw',
			'wbbbbbmbwbbbw',
			'wbbbbBbbbbbbw',
			'wwwwwwwwwwwww',
		])
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		levels,
	})
})()