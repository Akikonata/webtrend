 (function() {

     function addTip2(container) {
         Utils.addTip2({
             left: 5,
             top: 4,
             pos: 'right',
             container: container,
             content: '偶尔使用<div style="font-size:16px">11%</div>',
             delay: 1000
         });

         Utils.addTip2({
             bgColor: '#fbf6f3',
             left: 80,
             top: -27,
             pos: 'right',
             container: container,
             content: '从未使用<div style="font-size:16px">4%</div>',
             delay: 1100
         });

         Utils.addTip2({
             bgColor: '#abd83e',
             left: 235,
             top: 8,
             pos: 'left',
             container: container,
             content: '经常使用<div style="font-size:16px">85%</div>',
             delay: 1200
         });
     }

     function addCenterText(delay) {
         setTimeout(function() {
             $('.p-donut-center').css({
                 opacity: 1
             });
         }, delay);
     }

     Charts.add('p-donut', {

         init: function() {
             var width = 86;

             var container = $('#p-donut');

             $('<img src="../img/p-donut.png" width="' + width + '%" />').css({
                 margin: ((100 - width) / 2) + '%'
             }).appendTo(container).addClass('p-donut-do-anim');

             addTip2(container);
             addCenterText(1400);

         }

     });

 })();