(function(){
    var pieConfig = {
        "plotOptions": {
            "pie": {
                "center": {
                    "x" : $('#pie').width()/2,
                    "y" : $('#pie').height()/2
                },
                "innerRadius" : 26,
                "outerRadius" : 38,
                "incrementRadius" : 12,
                "stroke" : {
                    "width" : 0
                }
            },
            "label" : {
                "enabled" : false
            }
        },
        "legend" : {
            "enabled" : false
        }
    };

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
		    pieConfig.series = [
	            {
	                "name": "Android",
	                "data": [
	                    {
	                        "value": nums[0],
	                        "color": "#b6d766"
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
	                        "color": "#e0e765"
	                    },
	                    {
	                        "value": 100 - nums[1],
	                        "color": "rgba(0,0,0,0)"
	                    }
	                ]
	            }
	        ];
	        var c = $('#' + id);
        	pieConfig.plotOptions.pie.center = {
	                "x" : c.width()/2,
	                "y" : c.height()/2
	            };
		    pie.update(pieConfig);
		    addCenterText(pie, id, content);
        }
    });

})();