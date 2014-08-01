(function(){

    var areaConfig = {
        "color" : [ '#87e0b7' ],

        "xAxis": {
            "categories": [ "12Q2", "12Q3", "12Q4", "13Q1", "13Q2", "13Q3", "13Q4", "14Q1", "14Q2" ],

            "ticks" : {
                "enabled" : false
            },
            "margin" : {
                "right" : 10,
                "left" : 40
            },

            "axis" : {
                enabled : false
            },
            "padding" : {
                "left" : 10,
                "right" : 10
            },
            "label" : {
                "enabled" : true,
                "rotate" : 0,
                "font" : {
                    "color" : "#FFF",
                    fontSize : 10
                }
            },
            "min" : 0
        },

        "yAxis": {
            "min" : 0,
            grid : [0,1,2,3,4,5],
            "ticks" : {
                "enabled" : false
            },
            "label" : {
                "enabled" : true,
                "rotate" : 0,
                "font" : {
                    "color" : "#FFF",
                    fontSize : 10
                }
            },
            "axis" : {
                "enabled" : false
            },
            "padding" : {
                "top" : 0,
                "bottom" : 0
            }
        },

        "plotOptions" : {

            "area" : {

                stroke : {
                    width : 6
                },

                fill : {
                    grandient : [
                        { pos: 0, opacity: 1, color: '#d4c071' },
                        { pos: 1, opacity: 0, color: '#d4c071' }
                    ]
                },

                dot : {
                    enabled : false
                }  
            },

            line : {
                width : 6,
                dot : {
                    enabled : false
                }
            },

            "label" : {
                "enabled" : false
            }
        },

        "legend" : {
            "enabled" : false
        },

        "interaction" : {
            "onHover" : null
        },

        "series": [
            {
                "name": "中国智能手机",
                "data": [ 1.20, 1.63, 2.33, 2.79, 2.88, 3.27, 3.85, 4.43, 4.63 ]
            }
        ],
        animation : {
            enabled : false
        }
    };

    Charts.add('area', {
        init : function(){
            var inner = $('<div id="area-inner" style="width:100%;height:100%;visibility:hidden"></div>');
            $('#area').append(inner);
            var areachart = new kc.AreaChart( 'area-inner' );
            // var area = new kc.LineChart( 'area' );

            areachart.getPlots().drawPolygon = function( topPart, bottomPart, entry ){
                var self = this;

                var begin = topPart.concat(topPart.slice(0).reverse()).slice(0),
                    finish = topPart.concat(bottomPart).slice(0);

                var fill = self.config.plotOptions.area.fill.grandient;

                var area = new kc.Polyline({
                    points     : begin,
                    color      : '#ddd',
                    width      : 0,
                    factor     : +new Date,
                    animatedDir: 'y',
                    close: true,
                    fill: fill
                });
// #a7df1e
// #7be1f0
                this.addElement('area', area);
                area.update();
      
                setTimeout(function(){

                    area.update({
                        points     : finish,
                        color      : '#ddd',
                        width      : 0,
                        factor     : +new Date,
                        animatedDir: 'y',
                        close: true,
                        fill: fill
                    });

                }, 0);

                drawLines( topPart, bottomPart );
                area.polyline.container.bringRear();
            };

            var paper = areachart.getPaper();
            function drawLines( topPart, bottomPart ){
                var line = new kity.Path();
                var drawer = line.getDrawer();
                var i = 0, l = topPart.length;
                for(i = 0 ; i < l; i++){
                    drawer.moveTo(topPart[i][0], topPart[i][1]);
                    drawer.lineTo(bottomPart[l-i-1][0], bottomPart[l-i-1][1]);
                }
                
                var f = new kity.LinearGradientBrush().pipe( function() {
                    this.addStop( 0, '#dccfa7', 1 );
                    this.addStop( 1, '#dccfa7', 0 );
                    this.setStartPosition(0, 0);
                    this.setEndPosition(0, 1);
                    paper.addResource( this );
                });

                line.stroke(f);

                paper.addShape(line);
                line.bringRear();
            }

            areachart.update( areaConfig );
            var pl = areachart.getPlots().getPlotsElements().getElementList()[0];
            var g = new kity.LinearGradientBrush().pipe( function() {
                this.addStop( 0, '#a7df1e', 1 );
                this.addStop( 1, '#7be1f0', 1 );
                this.setStartPosition(0, 0);
                this.setEndPosition(1, 0);
                paper.addResource( this );
            });

            var pen = new kity.Pen();
            pen.setWidth( 6 );
            pen.setColor( g );
            pl.stroke(g, 6);

            inner.css({
                visibility: 'visible',
                width : '0px'
            });

            setTimeout(function(){
                inner.css({
                    webkitTransition: '3s',
                    width : '100%'
                });
            }, 0);
            
        }
    });

})();