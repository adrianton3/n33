(() => {
	'use strict'

	const imageUrls = {
		'b1': 'art/b1.png',
		'b2': 'art/b2.png',
		'b2-1': 'art/b2-1.png',
		'w1': 'art/w1.png',
		'm1': 'art/m1.png',
		'p-n': 'art/p-n.png',
		'p-w': 'art/p-w.png',
		'p-s': 'art/p-s.png',
		'p-e': 'art/p-e.png',
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