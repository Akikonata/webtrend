(function(){
	// 判断系统版本，确定动画是否开启
	window.animFx = false;
	var p = location.search.match(/p=[^.]+/g);
	if(p){
		var arr = p[0].substr(2).split('_');
		var os = arr[0], ver = Number(arr[1]);

		if(os == 'ios' || (os == 'android' && ver >= 4)){
			window.animFx = true;
		}
	}
})();