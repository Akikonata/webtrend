Utils = {
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
		
	}
};