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

	function makePortal (image, level, x, y) {
		return {
			type: 'portal',
			image,
			x,
			y,
			level,
		}
	}

	function makeKey (image, behind) {
		return {
			type: 'key',
			image,
			behind,
		}
	}

	function makeDoor (image, behind) {
		return {
			type: 'door',
			image,
			behind,
		}
	}

	function makeMob (mobType, behind) {
		const mobTypes = {
			'm1': {
				health: 30,
				attack: 2,
				armor: 0,
				...bundleImages(['m1', 'm1-1', 'm1-2', 'm1-3'],),
			},
			'm2': {
				health: 10,
				attack: 2,
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
		'mob2': makeMob('m2','b1'),
		'portal1-2': makePortal('p1', 'l2', 4, 4),
		'portal2-1': makePortal('p1', 'l1', 4, 4),
		'key1': makeKey('k1', 'b1'),
		'door1': makeDoor('d1', 'b1'),
	}

	const levels = {}

	function compileLevel (symbols, lines) {
		const compiled = lines.map((line) =>
			[...line].map((cell) => {
				const index = Math.floor(Math.random() * symbols[cell].length)
				return definitions[symbols[cell][index]]
			})
		)

		compiled.size = {
			x: lines[0].length,
			y: lines.length,
		}

		return compiled
	}

	{
		const symbols = {
			'b': ['background1'],
			'B': ['background2'],
			'z': ['background1', 'background2'],
			'w': ['wall1'],
			'm': ['mob1'],
			'M': ['mob2'],
			'p': ['portal1-2'],
			'k': ['key1'],
			'd': ['door1'],
		}

		levels['l1'] = compileLevel(symbols, [
			'wwwwwwwwwwwww',
			'wzbwbbbbmbbbw',
			'wbBbbBbkwbbbw',
			'wbbBbbbbwbbbw',
			'wbbbbbbbwbbbw',
			'wbbdbBbbMbbbw',
			'wbbbbbmbwbbbw',
			'wbbbbBbbbbpbw',
			'wwwwwwwwwwwww',
		])
	}

	{
		const symbols = {
			'b': ['background1'],
			'w': ['wall1'],
			'm': ['mob1'],
			'p': ['portal2-1'],
		}

		levels['l2'] = compileLevel(symbols, [
			'wwwwwwwwwwwww',
			'wbbbbbbbbbbbw',
			'wbbbbbbbbpbbw',
			'wbbbbbbbbbbbw',
			'wbbbbbwbbbbbw',
			'wbbbbbbbbbbbw',
			'wbbbbbbbbbbbw',
			'wbbbbbbbbbbbw',
			'wwwwwwwwwwwww',
		])
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		levels,
	})
})()