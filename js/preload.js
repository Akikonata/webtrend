(function(start) {
	var imgs = [
		'img/1-bg.jpg',
		'img/back-cover.jpg',
		'img/book.png',
		'img/donuts.png',
		'img/logos.png',
		'img/numbers.png',
		'img/p-donut.png',
		'img/pics1.png',
		'img/pics2.png',
		'img/pie-bg.png',
		'img/share.png'
	];

	var progress = '0%',
		loaded = 0,
		l = imgs.length,
		hasStarted = false,
		time = 1000;

	function finish(p) {
		if (p == '100%' && hasStarted == false) {
			hasStarted = true;
			go();
		}
	}

	function setProgress(p) {
		// console.log( p );
	}

	function go() {

		start();
	}

	imgs.forEach(function(url, i) {
		var pic = new Image();
		pic.onload = function() {
			loaded++;
			progress = (loaded / l * 100).toFixed(0) + '%';

			finish(progress);
			setProgress(progress);
		};
		pic.src = url;
	});

	setTimeout(function() {
		finish('100%');
	}, time);

})(start);