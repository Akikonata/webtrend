$.fn.animClass = function( cl ){
	var e = $(this).removeClass(cl);
	setTimeout(function(){
		e.addClass(cl);
	}, 50);
}

Utils = {
	addTip : function(conf){
		var hit = conf.hit === false ? '' : '<div class="hit" style="border-top-color: ' + conf.bgColor + '"></div>';
		return $('<div '+(conf.id?'id='+conf.id:'')+' class="tip" style="background-color:'+conf.bgColor+'"><span class="content">'+conf.content+'</span>' + hit + '</div>').appendTo(conf.container).css(conf.style);
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
	},

	once : function( func ){
		var tmp = func;
		return function(){
			tmp();
			tmp = function(){
				return false;
			}
		};
	}
};