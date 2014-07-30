 (function() {

    function addTip2(conf){
        var container = conf.container,
            side = conf.side,
            top = conf.topPos - 50,
            left = conf.leftPos;

        var pos = [[0.2, 0.09], [0.4, 0.01], [0.74, 0.05]];

        Utils.addTip2({
            left: left + side*pos[0][0],
            top: top + side*pos[0][1],
            pos: 'right',
            container: container,
            content: '偶尔使用<div style="font-size:16px">11%</div>',
            delay: 1000
        });

        Utils.addTip2({
            bgColor: '#fbf6f3',
            left: left + side*pos[1][0],
            top: top + side*pos[1][1],
            pos: 'right',
            container: container,
            content: '从未使用<div style="font-size:16px">4%</div>',
            delay: 1100
        });

        Utils.addTip2({
            bgColor: '#abd83e',
            left: left + side*pos[2][0],
            top: top + side*pos[2][1],
            pos: 'left',
            container: container,
            content: '经常使用<div style="font-size:16px">85%</div>',
            delay: 1200
        });
    }

     function addCenterText(delay, style) {
         setTimeout(function() {
             $('.p-donut-center').css(style);
         }, delay);
     }

     Charts.add('p-donut', {

         init: function() {
            var rate = 0.9;

            var container = $('#p-donut'), width = container.width(), height = container.height();
            var shortSide = Math.min(width, height);
            var side = shortSide * rate;

            var t = height - side,
                l = (width - side) / 2;
            $('<img src="../img/p-donut.png" width="' + side + '" />').css({
                marginLeft: l + 'px',
                marginTop: t + 'px',
            }).appendTo(container).addClass('p-donut-do-anim');

            addTip2({
                container : container,
                topPos : t,
                leftPos : l,
                side : side
            });
            addCenterText(0, {
                opacity : 1,
                top : (height - side/2 - 58) + 'px',
                webkitTransform : 'scale(1.5)'
            });

         }

     });

 })();