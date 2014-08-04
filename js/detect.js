(function(){
	// 判断系统版本，确定动画是否开启
	window.animFx = false;
	var ua = navigator.userAgent;
	l = ua.match(/Android[^]+?;/g);
	if(ua.indexOf('iPhone') >=0 || (ua.indexOf('Android') >=0 && l && Number( l[0].substring(8, l[0].length-1) ) >=4 )){
		window.animFx  = true;
	}
})();