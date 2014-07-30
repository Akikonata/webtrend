(function(){

    var data = {
        name : ['书籍文档', '生活服务', '在线工具服务', '健康保健', '教育', '成人', '人物', '影视动画', '新闻资讯', '商品购物', '音乐', '游戏', '其他'],
        value : [15.1, 14.0, 9.8, 9.7, 9.1, 8.0, 6.5, 4.9, 4.8, 3.3, 3.0, 2.9, 12.1]
    };

    function initData(count){
        var counts = [];
        var start = [];
        var valSum = Utils.arraySum(data.value);
        for(var i = 0; i < data.value.length; i++){
            start.push(Utils.arraySum(counts));
            counts.push( Math.round(data.value[i]/valSum * count) );
        }
        data.counts = counts;
        data.start = start;
    }

    function addCenter(conf, fin, timer){
        var con = conf.container;
        var r = conf.radius;

        var center = $('<div class="center"></div>').css({

            position : 'absolute',
            width : 2*r + 'px',
            height : 2*r + 'px',
            left : (con.width()/2-r) + 'px',
            top : (con.height()/2-r) + 'px'

        }).appendTo( con );

        setTimeout(function(){
            var fr = fin.radius;
            center.css({
                width : 2*fr + 'px',
                height : 2*fr + 'px',
                left : (con.width()/2-fr) + 'px',
                top : (con.height()/2-fr) + 'px'
            });
        }, timer);
    }

    function addRects(conf){
        var con = conf.container;
        var PI = Math.PI;
        var a = PI*2/conf.count;
        var sin = Math.sin, cos = Math.cos;
        var cX = con.width()/2, cY = con.height()/2;

        var x = y = 0;
        var tmpR = conf.r + conf.h/2;
        var tmpA, deg;
        for(var i = 0; i < conf.count; i++){
            tmpA = a*i;
            x = tmpR * cos(tmpA);
            y = tmpR * sin(tmpA);
            deg = tmpA/PI * 180;
            $('<div class="rect"></div>').css({
                backgroundColor : '#11722e',
                position : 'absolute',
                width : conf.w + 'px',
                height : conf.h + 'px',
                left : (cX + x - conf.w/2) + 'px',
                top : (cY + y - conf.h/2) + 'px',
                webkitTransform : 'rotate('+(deg+90)+'deg)',
                visibility : 'hidden'
            }).appendTo( con );
        }

        con.find('.rect').each(function( i, rect ){
            setTimeout(function(){
                $(rect).css('visibility', 'visible');
            }, conf.interval * i);
        });

    }

    function bindAction(container){
        container.ontouchstart = function(ev){
            var t = ev.touches[0];
            var x = t.pageX - container.offsetLeft;
            var y = t.pageY - container.offsetTop;

            var aY = y - $(container).height()/2;
            var aX = x - $(container).width()/2;

            var angle = Math.atan2(-aY, aX);
            console.log(angle);
        }
    }

    var tip = Utils.addTip({
        container : $('#round'),
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
        var con = conf.container;
        var rects = con.find('.rect');
        var sum = Utils.arraySum(data.counts);
        var sin = Math.sin, cos = Math.cos;

        data.counts.forEach(function(count, i){

            var index = parseInt( data.start[i] + count/2 );
            var re = rects[ index ],
                angle = index/sum * 360;

            var isRight = (angle < 90 && angle > 0 )||( angle < 360 && angle > 270 );


            $('<div class="link-dot link-dot'+i+' link"></div>').css({
                top : re.offsetTop+conf.h/2-3,
                left : re.offsetLeft+conf.w/2-3
            }).appendTo(con);



            // 链接文本位置
            var txt = data.name[i],
                txtWidth = txt.length * 12;
            var R = conf.r + 20, ww = con.width()/2, hh = con.height()/2;

            var radian = Utils.angle2radian(angle);

            $('<div class="link-txt link-txt'+i+' link" index="' + i + '">' + txt + '</div>').css({
                top : hh + (R+(isRight?0:txtWidth)) * sin(radian) - 6,
                left : ww + (R+(isRight?0:txtWidth)) * cos(radian),
                width : txtWidth,
                webkitTransformOrigin: '0% 50%',
                webkitTransform : 'rotate('+(isRight? angle-10 : angle-180)+'deg)',
            }).appendTo(con);
        });

        $('body').delegate('.link-txt', 'touchstart', function(){
            var i = Number($(this).attr('index'));
            var s = data.start[i], c = data.counts[i];
            rects.css('backgroundColor', '#11722e');
            for(var j = 0; j < c; j++){
                $(rects[j+s]).css('backgroundColor', '#f3e50c');
            }

            $('.link-txt').show();
            $('.link-txt' + i).hide();

            tip.css({
                // left : $('.link-dot' + i).css('left'),
                top : (parseInt($('.link-dot' + i).css('top'))-50)+'px',
                display : 'block',

            }).find('.content').html( data.name[i] + '<br /><span style="font-size:16px">' + data.value[i] + '%</span>' );
        
            tip.css({
                left: (parseInt($('.link-dot' + i).css('left')) - tip.width()/2) + 'px'
            });
        });

    }

    function addSearchIcon(conf){
        var con = conf.container,
            oW = 164, oH = 145, hW = 71,
            width = conf.width;

        var icon = $('<div class="search-icon"></div>').appendTo(con).css({
            width: width + 'px',
            height: width/oW*oH + 'px',
            backgroundSize : width + 'px',
            left: (con.width()/2 - width/oW*hW) + 'px',
            top : (con.height()/2-width*0.15) +  'px',
            webkitTransform: 'scale(0.1)'
        });

        setTimeout(function(){
            icon.css({
                 webkitTransform: 'scale(1)',
                 webkitTransition:'0.5s'
            });

        }, 50);
    }

    function addLabel(txt, con){
        return $('<div">' + txt + '</div>').appendTo(con).css({
            position: 'absolute',
            left: (con.width()/2-25) + 'px',
            top : (con.height()/2-50) +  'px',
            color : '#388742'
        });
    }

    function addLabel2(txt, con){
        return $('<div">' + txt + '</div>').appendTo(con).css({
            position: 'absolute',
            left: (con.width()/2-20) + 'px',
            top : (con.height()/2) +  'px',
            color : 'red',
            // opacity : 0,
            fontSize : '18px',
            
        });
    }
    
    Charts.add('round', {

        init : function(){

            var con = $('#round');
            var count = 72;

            var conf = {
                w : 4,
                h : 20,
                r : 90,
                count : count,
                container : con,
                interval : 15
            };

            initData(count);
            
            var timer = 800;

            addCenter({
                radius : 10,
                container : con
            }, {
                radius : 80
            }, timer);


            // var label = addLabel('13Q4', con);
            
            setTimeout(function(){

                var label = addLabel('14Q2', con);

                // label.html('14Q2').css({
                //     webkitTransition : '0.5s',
                //     top : parseInt(label.css('top')) - 20 + 'px'
                // });

                // var label2 = addLabel2('+48%', con);
                // setTimeout(function(){
                //     label2.css({
                //         webkitTransition : '0.5s',
                //         webkitTransform: 'scale(10)',
                //         opacity : 0
                //     });
                // }, 100);

                setTimeout(function(){
                    // label2.hide();
                    addRects(conf);

                    setTimeout(function(){
                        addLink(conf);
                        addSearchIcon({
                            container : con,
                            width : 80
                        });
                    }, count * conf.interval);
                    
                }, 500);



            }, timer);


        }

    });

})();


