(() => {
	'use strict'

	const imageUrls = {
		'd1': 'art/d1.png',
		'k1': 'art/k1.png',
		'p1': 'art/p1.png',
		'b1': 'art/b1.png',
		'b2': 'art/b2.png',
		'b2-1': 'art/b2-1.png',
		'w1': 'art/w1.png',
		'w-n': 'art/w-n.png',
		'w-nw': 'art/w-nw.png',
		'w-w': 'art/w-w.png',
		'w-sw': 'art/w-sw.png',
		'w-s': 'art/w-s.png',
		'w-se': 'art/w-se.png',
		'w-e': 'art/w-e.png',
		'w-ne': 'art/w-ne.png',
		'm1': 'art/m1.png',
		'm1-1': 'art/m1-1.png',
		'm1-2': 'art/m1-2.png',
		'm1-3': 'art/m1-3.png',
		'm1-d': 'art/m1-d.png',
		'm2': 'art/m2.png',
		'm2-1': 'art/m2-1.png',
		'm2-d': 'art/m2-d.png',
		'p-n': 'art/p-n.png',
		'p-w': 'art/p-w.png',
		'p-s': 'art/p-s.png',
		'p-e': 'art/p-e.png',
		'p-n-b': 'art/p-n-b.png',
		'p-w-b': 'art/p-w-b.png',
		'p-s-b': 'art/p-s-b.png',
		'p-e-b': 'art/p-e-b.png',
		's1': 'art/s1.png',
		'0': 'art/font/0.png',
		'1': 'art/font/1.png',
		'2': 'art/font/2.png',
		'3': 'art/font/3.png',
		'4': 'art/font/4.png',
		'5': 'art/font/5.png',
		'6': 'art/font/6.png',
		'7': 'art/font/7.png',
		'8': 'art/font/8.png',
		'9': 'art/font/9.png',
		' ': 'art/font/space.png',
		'a': 'art/font/a.png',
		'd': 'art/font/d.png',
		'h': 'art/font/h.png',
		'p': 'art/font/p.png',
		'frame': 'art/ui/frame.png',
		'start-screen': 'art/ui/start-screen.png',
		'dead-screen': 'art/ui/dead-screen.png',
		'stair-screen': 'art/ui/stair-screen.png',
		'particle': 'art/particle.png',
		'heart': 'art/ui/heart.png',
	}

	function loadImages () {
		return Promise.all(Object.entries(imageUrls).map(([name, url]) =>
			new Promise((resolve, reject) => {
				const image = document.createElement('img')
				image.src = url
				image.addEventListener('load', () => { resolve({ name, image }) })
			})
		)).then((imagesArray) => {
			const images = {}
			imagesArray.forEach(({ name, image }) => {
				images[name] = image
			})

			return images
		})
	}


	window.n33 = window.n33 || {}
	Object.assign(window.n33, {
		loadImages,
	})
})()