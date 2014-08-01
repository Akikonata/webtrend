(function(){

    var donutConfig = {
            "color" : [ '#a2d429', '#f4e81a', '#7dd5d6', '#a8e0df' ],
            "plotOptions": {
                "pie": {
                    "shadow": {
                        enabled : false,
                        size : 4,
                        x : 0,
                        y : 0,
                        color : "rgba( 0, 0, 0, 0.3 )"
                    },
                    "innerRadius" : 40,
                    "outerRadius" : 90,
                    "incrementRadius" : 30,
                    "stroke" : {
                        "width" : 0
                    }
                },

                "label" : {
                    "enabled" : false
                }
            },
            "legend" : {
                "enabled" : false,
                "level" : "data"
            },

            animation:{
                duration: 600,
                mode : 'ease'
            }

        };

    function setConfig(radius){
        donutConfig.plotOptions.pie.outerRadius = radius;
        donutConfig.plotOptions.pie.innerRadius = radius - 50;
    }

    var allData = {
        '11Q2' : {
            name: "11Q2",
            data: [
                {
                    name: "iPhone",
                    value: 5
                },
                {
                    name: "Android",
                    value: 14
                },
                {
                    name: "Windows",
                    value: 8
                },
                {
                    name: "Others",
                    value: 73
                }
            ]
        },
        '12Q2' : {
            name: "12Q2",
            data: [
                {
                    name: "iPhone",
                    value: 8
                },
                {
                    name: "Android",
                    value: 45
                },
                {
                    name: "Windows",
                    value: 3
                },
                {
                    name: "Others",
                    value: 43
                }
            ]
        },
        '13Q2' : {
            name: "13Q2",
            data: [
                {
                    name: "iPhone",
                    value: 12
                },
                {
                    name: "Android",
                    value: 73
                },
                {
                    name: "Windows",
                    value: 1
                },
                {
                    name: "Others",
                    value: 14
                }
            ]
        },
        '14Q2' : {
            name: "14Q2",
            data: [
                {
                    name: "iPhone",
                    value: 13
                },
                {
                    name: "Android",
                    value: 79
                },
                {
                    name: "Windows",
                    value: 2
                },
                {
                    name: "Others",
                    value: 6
                }
            ]
        }
    };


    Charts.add('donut', {
        init : function(){
            var con = $('#donut');
            var w = con.width(), h = con.height(), padding = 30;

            var donut = new kc.PieChart( 'donut' );

            setConfig(Math.min(w, h)/2 - padding);

            donut.setConfig( donutConfig );
            donut.setOption( 'plotOptions.pie.center', {
                "x" : w/2,
                "y" : h/2
            });


            var center = donut.getCenter();
            var w = 100, h = 100;

            var middle = $('<div></div>').css({
                width : w + 'px',
                height : h + 'px',
                color : '#FFF',
                position : 'absolute',
                left : center.x - w/2 + 'px',
                top : center.y - h/2 + 'px',
                textAlign : 'center',
                lineHeight : h + 'px'

            }).appendTo($('#donut')[0]);
            

            var labels = ['iPhone', 'Android', 'Windows', '其他'];
            var label1, label2;
            function selectQ( data ) {
                donutConfig.series = [data];
                middle.html( data.name );
                donut.update(donutConfig);

                var list = donut.getPlots().pies.param.list;
                var label1Pos = ['right', 'left'];
                if( !label1 ){
                    label1 = [];

                    for(var i = 0; i<2; i++){
                        label1.push( Utils.addTip2({
                            bgColor: '#116165',
                            color : '#FFF',
                            left: center.x,
                            top: center.y,
                            pos: label1Pos[i],
                            container: con,
                            content: labels[i] + '<div style="font-size:16px">4%</div>',
                            delay: 0
                        }).css({
                            webkitTransition : '0.5s',
                            // opacity: 0
                        }) );
                    }
                }

                if( !label2 ){
                    label2 = [];

                    for(var i = 0; i<2; i++){
                        label2.push($('<div class="donut-label">11</div>').appendTo(con).css({
                            position : 'absolute',
                            opacity : 0,
                            webkitTransition : '0.5s',
                            left : center.x + 'px',
                            top : center.y + 'px'
                        }));
                    }
                }

                setTimeout(function(){
                    list.forEach(function(param, i){

                        var r = param.outerRadius + 4;
                        var a = Math.min((param.startAngle + 25), (param.startAngle + param.pieAngle/2));
                        var ra = (a - 90)/180*Math.PI;

                        var x = r * Math.cos(ra),
                            y = r * Math.sin(ra);

                        var l;
                        if(i<=1){
                            l = label1[i].html(labels[i] + '<div style="font-size:16px">'+data.data[i].value+'%<div class="hit" style="border-top-color:#116165"></div></div></div>');
                            l.css({
                                webkitTransform : 'translate3d('+(x-(label1Pos[i]=='left'?0:l.width()))+'px, '+(y-l.height()-8)+'px, 0px)',
                                // opacity : 1
                            });
                        }

                        if( i > 1 ){
                            l = label2[i-2].html(labels[i]);
                            l.css({
                                webkitTransform : 'translate3d('+((a>0&&a<180)?x:x-l.width())+'px, '+(y-8)+'px, 0px)',
                                opacity : 1
                            });
                        }
                    });
                }, donutConfig.animation.duration + 300);

            }

            $('.qselect li').click(function(){
                selectQ( allData[this.innerHTML] );
            });

            var j = 0;
            for(var i in allData){

                (function(k){
                    setTimeout(function(){
                        selectQ( allData[k] );
                    }, j*1500);
                })(i);

                j++;
            }
        }
    });

})();