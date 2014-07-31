Utils = {
	addTip : function(conf){
		return $('<div class="tip" style="background-color:'+conf.bgColor+'"><span class="content">'+conf.content+'</span><div class="hit" style="border-top-color: ' + conf.bgColor + '"></div></div>').appendTo(conf.container).css(conf.style);
	},

	addTip2 : function( conf ) {
		var delay = conf.delay || 0;

		if( delay ){
			setTimeout(function(){
				ele();
			}, delay);
		}else{
			return ele();
		}

		function ele(){
			return $('<div class="tip-2 hit-' + conf.pos + '">' + conf.content + '<div class="hit" style="border-top-color: ' + conf.bgColor + '"></div></div>').appendTo( conf.container ).css({
				left : conf.left + 'px',
				top : conf.top + 'px',
				right : conf.right + 'px',
				bottom : conf.bottom + 'px',
				backgroundColor : conf.bgColor,
				color : conf.color || '#000'
			}).addClass('tip-2-do-anim');
		}
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