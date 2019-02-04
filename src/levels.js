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
				attack: 4,
				armor: 1,
				...bundleImages(['m1', 'm1-1', 'm1-2', 'm1-3']),
				hurtImage: 'm1-d',
				xpReward: 30,
			},
			'm2': {
				health: 10,
				attack: 2,
				armor: 0,
				...bundleImages(['m2', 'm2-1']),
				hurtImage: 'm2-d',
				xpReward: 10,
			},
			'm3': {
				health: 6,
				attack: 3,
				armor: 0,
				...bundleImages(['m3', 'm3-1']),
				hurtImage: 'm3-d',
				xpReward: 10,
			},
			'boss': {
				health: 100,
				attack: 5,
				armor: 3,
				...bundleImages(['boss', 'boss-1']),
				// hurtImage: 'boss-d',
				xpReward: 0,
				boss: true,
			},
		}

		return {
			type: 'mob',
			behind,
			...mobTypes[mobType],
		}
	}

	const definitions = {
		'background1': [makeFloor, 'b1'],
		'background2': [makeFloor, 'b2'],
		'background3': [makeFloor, 'b3'],
		'background4': [makeFloor, 'b4'],
		'background5': [makeFloor, 'b5'],
		'wall1': [makeWall, 'w1'],
		'mob1': [makeMob, 'm1','b1'],
		'mob2': [makeMob, 'm2','b1'],
		'mob3': [makeMob, 'm3','b1'],
		'portal1-2': [makePortal, 's1', 'l2', 10, 6, 'stair-screen'],
		'portal2-3': [makePortal, 's1', 'l3', 3, 3, 'stair-screen'],
		'portal3-4': [makePortal, 's1', 'l4', 4, 4, 'stair-screen'],
		'portal4-5': [makePortal, 's1', 'l5', 3, 10, 'stair-screen'],
		'key1': [makeKey, 'k1', 'b1'],
		'door1': [makeDoor, 'd1', 'b1'],
	}

	function compileLevel (symbols, lines) {
		const compiled = lines.map((line) =>
			[...line].map((cell) => {
				const index = Math.floor(Math.random() * symbols[cell].length)
				const [ make, ...params ] = definitions[symbols[cell][index]]
				return make(...params)
			})
		)

		compiled.size = {
			x: lines[0].length,
			y: lines.length,
		}

		for (let i = 0; i < compiled.size.x; i++) {
			compiled[0][i] = makeWall('w-s')
			compiled[compiled.size.y - 1][i] = makeWall('w-n')
		}

		for (let i = 0; i < compiled.size.y; i++) {
			compiled[i][0] = makeWall('w-e')
			compiled[i][compiled.size.x - 1] = makeWall('w-w')
		}

		compiled[0][0] = makeWall('w-se')
		compiled[compiled.size.y - 1][0] = makeWall('w-ne')
		compiled[0][compiled.size.x - 1] = makeWall('w-sw')
		compiled[compiled.size.y - 1][compiled.size.x - 1] = makeWall('w-nw')

		return compiled
	}

	function compileLevels () {
		const levels = {}

		{
			const symbols = {
				'b': ['background1'],
				'B': ['background2'],
				'z': ['background1', 'background2', 'background3', 'background4', 'background5'],
				'w': ['wall1'],
				'm': ['mob1'],
				'M': ['mob2'],
				'W': ['mob3'],
				'p': ['portal1-2'],
				'k': ['key1'],
				'd': ['door1'],
			}

			levels['l1'] = compileLevel(symbols, [
				'wwwwwwwwwwwww',
				'wzbwbbbwwbbbw',
				'wbBMbBbbwbmbw',
				'wbbBbMbbwbbbw',
				'wbbzzbbbMbzzw',
				'wbbzzBbbwbbbw',
				'wbbbbbbbwzpbw',
				'wbbzzBbbwbBbw',
				'wwwwwwwwwwwww',
			])
		}

		{
			const symbols = {
				'b': ['background1'],
				'B': ['background2'],
				'z': ['background1', 'background2', 'background3', 'background4', 'background5'],
				'w': ['wall1'],
				'm': ['mob1'],
				'M': ['mob2'],
				'W': ['mob3'],
				'k': ['key1'],
				'd': ['door1'],
				'p': ['portal2-3'],
			}

			levels['l2'] = compileLevel(symbols, [
				'wwwwwwwwwwwww',
				'wkMbbbbbwbbbw',
				'wmbbbbbbwbbbw',
				'wbbbMbbbwbpbw',
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
				'z': ['background1', 'background2', 'background3', 'background4', 'background5'],
				'w': ['wall1'],
				'm': ['mob1'],
				'M': ['mob2'],
				'W': ['mob3'],
				'k': ['key1'],
				'd': ['door1'],
				'p': ['portal3-4'],
			}

			levels['l3'] = compileLevel(symbols, [
				'wwwwwwwwwwwww',
				'wbbbbbMbbbbmw',
				'wbbbbbwwwwwww',
				'wbbbbbMbbbbbw',
				'wwwwwmwbbbbbw',
				'wbbbwkwbbWbbw',
				'wbpbwwwbbbbbw',
				'wbbbdbbbbbbbw',
				'wwwwwwwwwwwww',
			])
		}

		{
			const symbols = {
				'b': ['background1'],
				'B': ['background2'],
				'z': ['background1', 'background2', 'background3', 'background4', 'background5'],
				'w': ['wall1'],
				'm': ['mob1'],
				'M': ['mob2'],
				'W': ['mob3'],
				'k': ['key1'],
				'd': ['door1'],
				'p': ['portal4-5'],
			}

			levels['l4'] = compileLevel(symbols, [
				'wwwwwwwwwwwww',
				'wbbbbbbWbWbbw',
				'wbbmbbbbWpWbw',
				'wwwwwwwbbWbbw',
				'wkwbbbwbbbbbw',
				'wmwbbbwbbbbbw',
				'wbwbbbwbbbWbw',
				'wbWbbbdbbbbbw',
				'wwwwwwwwwwwww',
			])
		}

		{
			const symbols = {
				'b': ['background1'],
				'B': ['background2'],
				'z': ['background1', 'background2', 'background3', 'background4', 'background5'],
				'w': ['wall1'],
				'm': ['mob1'],
				'M': ['mob2'],
				'k': ['key1'],
				'd': ['door1'],
			}

			levels['l5'] = compileLevel(symbols, [
				'wwwwwww',
				'wbbbbbw',
				'wzzbbbw',
				'wbbbzzw',
				'wbbbbbw',
				'wBbzzBw',
				'wwbbbww',
				'wBbbbBw',
				'wwzzbww',
				'wBbbbBw',
				'wwbbbww',
				'wBbbbBw',
				'wwwwwww',
			])

			const boss = makeMob('boss', 'b1')
			const bossFalse = {
				...boss,
				image: null,
				images: null,
				behind: null,
			}

			levels['l5'][2][2] = boss
			levels['l5'][2][3] = bossFalse
			levels['l5'][2][4] = bossFalse

			levels['l5'][3][2] = bossFalse
			levels['l5'][3][3] = bossFalse
			levels['l5'][3][4] = bossFalse

			levels['l5'][4][2] = bossFalse
			levels['l5'][4][3] = bossFalse
			levels['l5'][4][4] = bossFalse
		}

		return levels
	}

	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		compileLevels,
	})
})()