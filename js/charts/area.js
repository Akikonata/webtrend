(function(){

    var areaConfig = {
        "color" : [ '#FFF' ],

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
                    width : 3,
                    color : '#a1df36'
                },

                fill : {
                    grandient : [
                        { pos: 0, opacity: 1, color: '#b3dba9' },
                        { pos: 1, opacity: 0, color: '#b3dba9' }
                    ]
                },

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
        ]

    };

    Charts.add('area', {
        init : function(){
            var area = new kc.AreaChart( 'area' );
            area.update( areaConfig );
        }
    });

})();