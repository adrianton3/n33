(() => {
	'use strict'

	function bundleImages (imageOrImages) {
		return Array.isArray(imageOrImages)
			? {
				image: imageOrImages[0],
				images: imageOrImages,
			} : {
				image: imageOrImages,
			}
	}

	function makeFloor (imageOrImages) {
		return {
			type: 'floor',
			...bundleImages(imageOrImages)
		}
	}

	function makeWall (imageOrImages) {
		return {
			type: 'wall',
			...bundleImages(imageOrImages),
		}
	}

	function makeMob (mobType, behind) {
		const mobTypes = {
			'm1': {
				health: 30,
				attack: 1,
				armor: 0,
				...bundleImages(['m2', 'm2-1'],),
			},
		}

		return {
			type: 'mob',
			behind,
			...mobTypes[mobType],
		}
	}

	const definitions = {
		'background1': makeFloor('b1'),
		'background2': makeFloor(['b2', 'b2-1']),
		'wall1': makeWall('w1'),
		'mob1': makeMob('m1','b1'),
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