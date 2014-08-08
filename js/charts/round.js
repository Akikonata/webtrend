(function(){

    var data = {
        name : ['书籍文档', '生活服务', '在线工具服务', '健康保健', '教育', '成人', '人物', '影视动画', '新闻资讯', '商品购物', '音乐', '游戏', '其他'],
        value : [15.1, 14.0, 9.8, 9.7, 9.1, 8.0, 6.5, 4.9, 4.8, 3.3, 3.0, 2.9, 12.1]
    };

    var colors = [
        '#433769', '#333369', '#1f3164', '#0f376d', '#13426d', '#0f4d6c', '#125768', '#166164', '#1a6b5f', '#1e755a', '#238953', '#279350', '#29a54a'
    ];

    var roundConfig = {
        "color": colors,
        defaultColor : '#11722e',
        "plotOptions": {
            "pie": {
                "shadow": {
                    enabled: false,
                    size: 4,
                    x: 0,
                    y: 0,
                    color: "rgba( 0, 0, 0, 0.3 )"
                },
                "innerRadius": 90,
                "outerRadius": 110,
                "incrementRadius": 20,
                "stroke": {
                    "width": 0
                }
            },

            "label": {
                "enabled": false
            }
        },
        "legend": {
            "enabled": false,
            "level": "data"
        },

        animation: {
            enabled : false,
            duration: 600,
            mode: 'ease'
        },

        series : [{
            name : '搜索占比',
            data : [{
                name: "书籍文档",
                value: 15.1
            }, {
                name: "生活服务",
                value: 14.0
            }, {
                name: "在线工具服务",
                value: 9.8
            }, {
                name: "健康保健",
                value: 9.7
            },{
                name: "教育",
                value: 9.1
            }, {
                name: "成人",
                value: 8.0
            }, {
                name: "人物",
                value: 6.5
            }, {
                name: "影视动画",
                value: 4.9
            },{
                name: "新闻资讯",
                value: 4.8
            }, {
                name: "商品购物",
                value: 3.3
            }, {
                name: "音乐",
                value: 3.0
            }, {
                name: "游戏",
                value: 2.9
            },{
                name: "其他",
                value: 12.1
            }]
        }]

    };

    var curIndex = 1, total = data.name.length;

    var setCurIndex = function(){
        if(curIndex > total-1){
            curIndex = 0;
        }
    }

    function initData(count){
        var angles = [];
        var start = [];
        var valSum = Utils.arraySum(data.value);

        var tmp = 0;
        data.value.forEach(function(num, i){
            var a = num/valSum * 360;
            angles.push( a );

            start.push( tmp );
            tmp+=a;
        });

        data.angles = angles;
        data.start = start;
    }

    function setLabel(center, cw, ch){
        var lb = center.find('.label').css({
            position: 'absolute',
            top : (ch/2-50) +  'px',
            color : '#388742',
            fontSize : '20px'
        });

        lb.css({
            left: (cw-lb.width())/2 + 'px',
        });
    }

    function setSearchIcon(center, width, cw, ch){
        var oW = 164, oH = 145, hW = 71;

        var bz = width / 80 * 343;
        var icon = center.find('.search-icon').css({
            width: width + 'px',
            height: width/oW*oH + 'px',
            backgroundSize : 343 + 'px',
            left: (cw/2 - width/oW*hW) + 'px',
            top : (ch/2-width*0.15) +  'px'
        });
    }

    function addCenter(conf, timer){
        var con = conf.container;
        var r = conf.radius;

        var center = $('<div class="center"><div class="label">' + conf.label + '</div><div class="search-icon"></div></div>').css({

            position : 'absolute',
            width : 2*r + 'px',
            height : 2*r + 'px',
            left : (con.width()/2-r) + 'px',
            top : (con.height()/2-r) + 'px',
            webkitTransform : 'scale(' + conf.startScale + ')',
            zIndex : 100

        }).appendTo( con );

        var cw = center.width(), ch = center.height();
        setLabel(center, cw, ch);

        setSearchIcon(center, 80, cw, ch);


        setTimeout(function(){
            center.css({
                webkitTransform : 'scale(1)',
            });
        }, timer);

        center.on('touchstart', function(){
            center.animClass('beat2');
            select( curIndex );
            curIndex++;
            setCurIndex();
        });

        return center;
    }

    var fans, lastFan, lastIndex=0;
    function addRing( conf ){
        var con = conf.container;

        var round = new kc.PieChart('round');
        round.setConfig(roundConfig);
        round.setOption('plotOptions.pie.center', {
            "x": con.width() / 2,
            "y": con.height() / 2
        });

        round.update(roundConfig);

        fans = round.getPlots().getElement('pies').getElementList();
    }

    var tip = Utils.addTip({
        container : $('#round'),
        bgColor : '#116165',
        content : '',
        style : {
            backgroundColor : '#116165',
            display : 'none',
            zIndex : 600,
            textAlign : 'center',
            minWidth : '40px'
        }
    });

    function addLink(conf){
        var con = conf.container,
            sin = Math.sin,
            cos = Math.cos;

        data.angles.forEach(function(angle, i){

            var angle = angle/2 + data.start[i]-90,
                isRight = (angle < 90 && angle > -90 )||( angle < 360 && angle > 270 );

            // 链接文本位置
            var txt = data.name[i],
                txtWidth = txt.length * 16;
            var R = conf.r + 20, ww = con.width()/2, hh = con.height()/2;

            var radian = Utils.angle2radian(angle);//+5修复一下位置偏移

            var cosV = cos(radian), sinV = sin(radian)
            $('<div class="link-txt link-txt'+i+' link" index="' + i + '">' + txt + '</div>').css({
                top : hh + (R+(isRight?0:txtWidth)) * sinV - 6,
                left : ww + (R+(isRight?0:txtWidth)) * cosV,
                textAlign : isRight?'left':'right',
                width : txtWidth,
                webkitTransformOrigin: '0% 50%',
                webkitTransform : 'rotate('+(isRight? angle : angle-180)+'deg)',
            }).appendTo(con).attr({
                'tl' : ww + (R-10) * cosV,
                'tt' : hh + (R-10) * sinV
            });
        });

        $('body').delegate('.link-txt, .link-dot', 'touchstart', function(){
            var i = Number($(this).attr('index'));
            select( i );
            curIndex = i+1;
            setCurIndex();
        });

        setTimeout(function(){
            select( 0 );
        }, 500);
        
    }

    function select( i ){

        var s = data.start[i], c = data.name.length;

        lastFan && lastFan.update({color:colors[lastIndex]});
        fans[i].update({color:'#f3e50c'});
        lastIndex = i;

        lastFan = fans[i];

        $('.link-txt').show();
        var txt = $('.link-txt' + i).hide();

        tip.css({
            top : parseInt(txt.attr('tt')-50)+'px',
            display : 'block',

        }).find('.content').html( data.name[i] + '<br /><span style="font-size:16px">' + data.value[i] + '%</span>' );
    
        tip.css({
            left: (txt.attr('tl') - tip.width()/2) + 'px'
        }).removeClass('tip-anim');

        setTimeout(function(){
            tip.addClass('tip-anim');
        }, 0);
    }
    
    Charts.add('round', {

        init : function(){

            var con = $('#round');

            var conf = {
                w : 4,
                h : 20,
                rectCount : 48,
                container : con,
                rectInterval : 15,
                centerStartR : 0.2,
                centerRadius : 80,
                centerTimer : 800
            };

            conf.r = conf.centerRadius + 10

            var count = conf.rectCount;
            initData(count);
            
            var timer = conf.centerTimer;

            var center = addCenter({
                radius : conf.centerRadius,
                startScale : conf.centerStartR,
                container : con,
                label : '14Q2'
            }, timer);

            
            setTimeout(function(){

                addRing(conf);

                setTimeout(function(){
                    addLink(conf);
                }, count * conf.rectInterval);

            }, timer + 500);


        }

    });

})();


