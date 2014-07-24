(function(){
	var columnConfig = {
        "color" : [ '#b6d766', '#e0e765', '#7dd5d6', '#a8e0df' ],

        "xAxis": {
            "categories": [ "浏览器", "生活娱乐", "社交&通信", "新闻", "地图导航", "音乐", "搜索", "视频", "阅读", "电商", "生活服务", "云存储", "游戏" ],

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
                "left" : 20,
                "right" : 20
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
            "ticks" : {
                "enabled" : false
            },
            grid : [-0.4, 0, 0.4, 0.8, 1.2, 1.6],
            "label" : {
                "enabled" : true,
                "rotate" : 0,
                "font" : {
                    "color" : "#FFF",
                    fontSize : 10
                },
                format : function(num) {
                    return parseInt(num*100) + '%';
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

            "column" : {
                "width" : 16,
                "margin": 1,
                "label" : {
                    "enabled" : true
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
            "onStickHover" : ""
        },

        "series": [
            {
                "name": "Android",
                "data": [-0.230560572, -0.116267018, -0.022364046, -0.055284462, 0.12, 0.144067376, 0.196909265, 0.237930968, 0.270339733, 0.770109129, 1.273410942, 0.106499724, 0.35]
            },
            {
                "name": "iPhone",
                "data": [-0.24, -0.12, -0.1, -0.05, 0.03, 0.175265871, 0.3, 0.31440714, 0.31440714, 0.384934529, 0.42, 0.51, 0.67]
            }
        ]

    };

    function addZeroLine(column){
        var margin = column.coordinate.param.margin;
        var width = column.getWidth() - margin.left - margin.right;
        var x = column.coordinate.param.x;
        var y = column.coordinate.measurePointY(0);
        column.addElement( 'zero', new kc.Line({
            x1: x,
            y1: y,
            x2: x + width,
            y2: y,
            width: 1,
            color: '#FFF'
        }) ).update();
    }

    function addDashLine(column){
        var margin = column.coordinate.param.margin;
        var height = column.getHeight() - margin.top - margin.bottom;
        var x = column.coordinate.measurePointX(4.5);
        var y = column.coordinate.param.y;
        column.addElement( 'separate', new kc.Line({
            x1: x,
            y1: y,
            x2: x,
            y2: y + height,
            width: 1,
            color: '#FFF',
            dash : [1]
        }) ).update();
    } 

    Charts.add('column', {
        init : function(){
		    var column = new kc.ColumnChart( 'column' );
		    column.update( columnConfig );
		    
		    addZeroLine(column);
		    addDashLine(column);
        }
    });

})();