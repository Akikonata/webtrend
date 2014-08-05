(function(){

    var rate = 1;
    var pieConfig = {};

    function R(num){
        return rate * num;
    }

    function setConfig(){
        pieConfig = {
            plotOptions: {
                pie: {
                    innerRadius : R(26),
                    outerRadius : R(38),
                    incrementRadius : R(12),
                    stroke : {
                        width : 0
                    },
                    shadow : {
                        enabled : false,
                        size : 1,
                        x : 0,
                        y : 0,
                        color : "rgba( 0, 0, 0, 0.3 )"
                    }
                },
                label : {
                    enabled : false
                }
            },
            legend : {
                enabled : false
            },
            animation:{
                enabled : window.animFx,
                duration: 1000,
                mode : 'ease'
            }
        };
    }

    function addCenterText(chart, containerId, content) {
        var center = chart.getCenter();
        var w = 40, h = 32;
        var middle = $('<div></div>').css({
            width : w + 'px',
            height : h + 'px',
            color : '#FFF',
            position : 'absolute',
            left : center.x - w/2 + 'px',
            top : center.y - h/2 + 'px',
            textAlign : 'center',
            lineHeight : content.indexOf('<br') >=0 ? '16px' : '33px',
            fontSize : '10px'

        }).appendTo($('#' + containerId)[0]);

        middle.html(content);
    }
    

    Charts.add('pie', {
        init : function( id, nums, content ){

		    var pie = new kc.PieChart( id );

            var c = $('#' + id);
            var w = c.width(), h = c.height(); 
            rate = c.width()/100*0.95;
            c.css('backgroundSize', R(100));
            
            setConfig();
            var center = {
                    x : w/2,
                    y : h/2
                };

            pieConfig.plotOptions.pie.center = center;

		    pieConfig.series = [
	            {
	                "name": "Android",
	                "data": [
	                    {
	                        "value": nums[0],
	                        "color": "#3ed58c"
	                    },
	                    {
	                        "value": 100 - nums[0],
	                        "color": "rgba(0,0,0,0)"
	                    }
	                ]
	            },
	            {
	                "name": "iPhone",
	                "data": [
	                    {
	                        "value": nums[1],
	                        "color": "#f4dd1a"
	                    },
	                    {
	                        "value": 100 - nums[1],
	                        "color": "rgba(0,0,0,0)"
	                    }
	                ]
	            }
	        ];

		    pie.update(pieConfig);
		    addCenterText(pie, id, content);

            var list = pie.getPlots().pies.param.list;

            setTimeout(function(){
                list.forEach(function(param, i){
                    if(i%2!=0) return;

                    var r = (param.innerRadius + param.outerRadius)/2;
                    var a = (param.startAngle + param.pieAngle - 90)/180*Math.PI;

                    var x = r * Math.cos(a) + center.x - 6,
                        y = r * Math.sin(a) + center.y - 6;

                    $('<div class="pie-num">'+nums[i/2]+'</div>').appendTo(c).css({
                        left : x + 'px',
                        top : y + 'px'
                    });

                });
            }, pieConfig.animation.duration + 300);

        }
    });

})();