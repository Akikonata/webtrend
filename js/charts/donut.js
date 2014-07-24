(function(){
    var donutConfig = {
            "color" : [ '#b6d766', '#e0e765', '#7dd5d6', '#a8e0df' ],
            "plotOptions": {
                "pie": {
                    "shadow": false,
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
            "enableAnimation" : {
                "enabled" : true,
                "time" : 300
            }
        };

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
            var donut = new kc.PieChart( 'donut' );

            donut.setConfig( donutConfig );
            donut.setOption( 'plotOptions.pie.center', {
                "x" : $('#donut').width()/2,
                "y" : $('#donut').height()/2
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
            
            function selectQ( data ) {
                donutConfig.series = [data];
                middle.html( data.name );
                donut.update(donutConfig);
            }

            $('.qselect li').click(function(){
                selectQ( allData[this.innerHTML] );
            });

            selectQ( allData['11Q2'] );
        }
    });

})();