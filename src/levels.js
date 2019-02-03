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

	function makePortal (image, level, x, y, screenImage) {
		return {
			type: 'portal',
			image,
			x,
			y,
			level,
			screenImage,
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
				...bundleImages(['m1', 'm1-1', 'm1-2', 'm1-3']),
				hurtImage: 'm1-d',
			},
			'm2': {
				health: 10,
				attack: 2,
				armor: 0,
				...bundleImages(['m2', 'm2-1']),
				hurtImage: 'm2-d',
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
		'wall-n': makeWall('w-n'),
		'wall-nw': makeWall('w-nw'),
		'wall-w': makeWall('w-w'),
		'wall-sw': makeWall('w-sw'),
		'wall-s': makeWall('w-s'),
		'wall-se': makeWall('w-se'),
		'wall-e': makeWall('w-e'),
		'wall-ne': makeWall('w-ne'),
		'mob1': makeMob('m1','b1'),
		'mob2': makeMob('m2','b1'),
		'portal1-2': makePortal('s1', 'l2', 10, 6, 'stair-screen'),
		'portal2-3': makePortal('s1', 'l3', 3, 3, 'stair-screen'),
		'portal3-4': makePortal('s1', 'l4', 4, 4, 'stair-screen'),
		'portal4-5': makePortal('s1', 'l5', 3, 10, 'stair-screen'),
		'key1': makeKey('k1', 'b1'),
		'door1': makeDoor('d1', 'b1'),
	}

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

		for (let i = 0; i < compiled.size.x; i++) {
			compiled[0][i] = definitions['wall-s']
			compiled[compiled.size.y - 1][i] = definitions['wall-n']
		}

		for (let i = 0; i < compiled.size.y; i++) {
			compiled[i][0] = definitions['wall-e']
			compiled[i][compiled.size.x - 1] = definitions['wall-w']
		}

		compiled[0][0] = definitions['wall-se']
		compiled[compiled.size.y - 1][0] = definitions['wall-ne']
		compiled[0][compiled.size.x - 1] = definitions['wall-sw']
		compiled[compiled.size.y - 1][compiled.size.x - 1] = definitions['wall-nw']

		return compiled
	}

	function compileLevels () {
		const levels = {}

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
				'wzbwbbbwwbbbw',
				'wbBMbBbbwbbbw',
				'wbbBbbbbwbbbw',
				'wbbbbbbbMbbbw',
				'wbbbbBbbwbbbw',
				'wbbbbbbbwbpbw',
				'wbbbbBbbwbBbw',
				'wwwwwwwwwwwww',
			])
		}

		{
			const symbols = {
				'b': ['background1'],
				'B': ['background2'],
				'z': ['background1', 'background2'],
				'w': ['wall1'],
				'm': ['mob1'],
				'M': ['mob2'],
				'k': ['key1'],
				'd': ['door1'],
				'p': ['portal2-3'],
			}

			levels['l2'] = compileLevel(symbols, [
				'wwwwwwwwwwwww',
				'wkMbbbbbwbbbw',
				'wmbbbbbbwbbbw',
				'wbbbbbbbwbpbw',
				'wbbbbbwbdbbbw',
				'wbbbbbbbwwwww',
				'wbbbMbbbbbbbw',
				'wbbbbbbbwbbbw',
				'wwwwwwwwwwwww',
			])
		}

		{
			const symbols = {
				'b': ['background1'],
				'B': ['background2'],
				'z': ['background1', 'background2'],
				'w': ['wall1'],
				'm': ['mob1'],
				'M': ['mob2'],
				'k': ['key1'],
				'd': ['door1'],
				'p': ['portal3-4'],
			}

			levels['l3'] = compileLevel(symbols, [
				'wwwwwwwwwwwww',
				'wbbbbbbbbbbbw',
				'wbbbbbwwwwwww',
				'wbbbbbMbbbbbw',
				'wwwwwmwbbbbbw',
				'wbbbwkwbbbbbw',
				'wbpbwwwbbbbbw',
				'wbbbdbbbbbbbw',
				'wwwwwwwwwwwww',
			])
		}

		{
			const symbols = {
				'b': ['background1'],
				'B': ['background2'],
				'z': ['background1', 'background2'],
				'w': ['wall1'],
				'm': ['mob1'],
				'M': ['mob2'],
				'k': ['key1'],
				'd': ['door1'],
				'p': ['portal4-5'],
			}

			levels['l4'] = compileLevel(symbols, [
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

		{
			const symbols = {
				'b': ['background1'],
				'B': ['background2'],
				'z': ['background1', 'background2'],
				'w': ['wall1'],
				'm': ['mob1'],
				'M': ['mob2'],
				'k': ['key1'],
				'd': ['door1'],
			}

			levels['l5'] = compileLevel(symbols, [
				'wwwwwww',
				'wbbbbbw',
				'wbbbbbw',
				'wbbbbbw',
				'wbbbbbw',
				'wBbbbBw',
				'wwbbbww',
				'wBbbbBw',
				'wwbbbww',
				'wBbbbBw',
				'wwbbbww',
				'wBbbbBw',
				'wwwwwww',
			])
		}

		return levels
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		compileLevels,
	})
})()