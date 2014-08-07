(function(){
	// 判断系统版本，确定动画是否开启
	window.animFx = false;
	var ua = navigator.userAgent,
		l = ua.match(/Android[^]+?;/g);


	if(ua.indexOf('iPhone') >=0){
		window.animFx  = true;
	}else if( ua.indexOf('Android') >=0 && l ){
		var s = l[0].substring(8, l[0].length-1);
		var arr = s.split('.');
		var ver = arr[0]+'.'+arr[1];

		if(ver >= 4){
			window.animFx  = true;
		}
	}

})();

