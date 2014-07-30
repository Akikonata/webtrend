(function(){

    function addBubble( conf ){
        var con  = conf.container;

        var valStr = '<li>' + conf.values.join('</li><li>') + '</li>';
        var comStr = '<li>' + conf.companies.join('</li><li>') + '</li>';

        var posType = [['left', 'right'], ['right', 'left']];
        var pos = posType[conf.posType];

        var b = $('<div class="bubble-container"><ul class="value ' + pos[0] + '">' + valStr + '</ul><ul class="company ' + pos[1] + '">' + comStr + '</ul></div>')
            .css({
                height : conf.values.length * conf.lineHeight + 'px',
                width : (con.width()/2 - 1) + 'px'
            })
            .appendTo(con);

        b.find('li').css({
            height : conf.lineHeight + 'px',
            lineHeight : conf.lineHeight + 'px'
        });

        var l = conf.values.length;
        conf.values.forEach(function( val, i ){
            var r = val * conf.radiusBase;
            
            $('<div class="bubble"></div>').css({
                position : 'absolute',
                width : r + 'px',
                height : r + 'px',
                left : (b.width()-r)/2 + 'px',
                top : ((l-0.5)*conf.lineHeight-r/2) + 'px',
                webkitTransform : 'scale(0.1)'
            }).appendTo(b).addClass(conf.className);
        });

        $('<div class="mobi-icon ' + conf.iconType + '"></div>').appendTo(b).css(conf.iconStyle);

        setTimeout(function(){
            var bbs = b.find('.bubble');
            conf.values.forEach(function( val, i ){

                $(bbs[i]).css({
                    webkitTransform : 'translate3d(0px, ' + (i - l + 1) * conf.lineHeight + 'px, 0px) scale(1)'
                });
            });

        }, 500);

        return b;
    }

    Charts.add('bubble', {

        init : function(){
            var con = $('#bubble');
            var count = 5;
            var lineHeight = (con.height()-20)/count;

            addBubble({
                container : con,
                values : [3.43, 2.77, 0.80, 0.80, 0.70],
                companies : ['腾讯', '百度', '阿里', '搜狐', '新浪'],
                radiusBase : 18,
                lineHeight : lineHeight,
                className : 'color0',
                posType : 0,
                iconType : 'android',
                iconStyle : {
                    right : '25px'
                }
            }).css({
                borderRight: '#FFF 1px dashed'
            });

            addBubble({
                container : con,
                values : [3.70, 2.10, 0.90, 0.50, 0.40],
                companies : ['腾讯', '百度', '阿里', '美图', '新浪'],
                radiusBase : 18,
                lineHeight : lineHeight,
                className : 'color1',
                posType : 1,
                iconType : 'iphone',
                iconStyle : {
                    left : '25px'
                }
            });

        }

    });

})();



