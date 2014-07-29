(function(){

    function addBubble( conf ){
        var valStr = '<li>' + conf.values.join('</li><li>') + '</li>';
        var comStr = '<li>' + conf.companies.join('</li><li>') + '</li>';

        var con  = $('#bubble');

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

        conf.values.forEach(function( val, i ){
            var r = val * conf.radiusBase;
            var l = conf.values.length;
            $('<div class="bubble"></div>').css({
                position : 'absolute',
                width : 0 + 'px',
                height : 0 + 'px',
                left : b.width()/2 + 'px',
                top : ((l-0.5)*conf.lineHeight-r/2) + 'px'
            }).appendTo(b).addClass(conf.className);
        });

        $('<div class="mobi-icon ' + conf.iconType + '"></div>').appendTo(b).css(conf.iconStyle);

        setTimeout(function(){
            var bbs = b.find('.bubble');
            conf.values.forEach(function( val, i ){
                var r = val * conf.radiusBase;

                $(bbs[i]).css({
                    width : r + 'px',
                    height : r + 'px',
                    left : (b.width()-r)/2 + 'px',
                    top : ((i+0.5)*conf.lineHeight-r/2) + 'px'
                });
            });

        }, 500);

        return b;
    }

    Charts.add('bubble', {

        init : function(){            
            addBubble({
                values : [3.43, 2.77, 0.80, 0.80, 0.70],
                companies : ['腾讯', '百度', '阿里', '搜狐', '新浪'],
                radiusBase : 18,
                lineHeight : 50,
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
                values : [3.70, 2.10, 0.90, 0.50, 0.40],
                companies : ['腾讯', '百度', '阿里', '美图', '新浪'],
                radiusBase : 18,
                lineHeight : 50,
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



