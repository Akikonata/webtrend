Utils = {
	addTip : function(conf){
		return $('<div class="tip"><span class="content">'+conf.content+'</span><div class="hit"></div></div>').appendTo(conf.container).css(conf.style);
	},

	addTip2 : function( conf ) {
		var delay = conf.delay || 0;

		setTimeout(function(){
			$('<div class="tip-2 hit-' + conf.pos + '">' + conf.content + '<div class="hit" style="border-top-color: ' + conf.bgColor + '"></div></div>').appendTo( conf.container ).css({
				left : conf.left + 'px',
				top : conf.top + 'px',
				right : conf.right + 'px',
				bottom : conf.bottom + 'px',
				backgroundColor : conf.bgColor
			}).addClass('tip-2-do-anim');
		}, delay);
		
	},

	arraySum : function(arr){
		var sum = 0;
		arr.forEach(function(num, i){
			sum += num;
		});
		return sum;
	},

	angle2radian : function( a ){
		return a/180 * Math.PI;
	}
};