function start() {
  function isWeixin(){
    return navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0;
  }

  var pageHeight = $('body').height();
  if (pageHeight < 458) pageHeight = 458;
  var SwiperPages;
  var docs = [
    '<h1>智能机大盘：</h1>指智能机全体保有量中的日活跃（当天发生过至少一次联网行为的）设备数量',
    '<h1>日使用时长：</h1>指用户一天24小时中使用各类智能机应用的累计时长，不含短信和电话',
    '<h1>说明：</h1>娱乐类应用：包括游戏、视频、音乐和阅读类应用<br/>工具类应用：包括搜索、浏览器、地图导航、应用分发、办公/学习/生活工具、系统/安全/优化工具等',
    '<h1>说明：</h1>阿里：除阿里自有应用外，UC浏览器、高德地图等收购公司的应用也被纳入统计<br/>搜狐：腾讯入股搜狗后，搜狗继续作为搜狐的子公司独立运营，故仍将其纳入搜狐进行统计<br/>新浪：阿里入股新浪微博后，微博继续作为新浪子公司独立运营，故仍将其纳入新浪进行统计',
    '<h1>百度移动搜索MAU</h1>当月通过手机百度客户端或手机浏览器等方式使用过百度移动搜索的用户（包括Android、iPhone及其他系统平台）'
  ];
  var inited = [false, false, false, false, false, false, false, false];

  $('#page1').hammer().bind("pandown", function(ev) {
    cover.css({
      webkitTransform: 'translate3d(0px,0px,0px)'
    });
  });
  //当前过渡动画的className
  var duractionClassName = '';

  var style = $('style');
  // var pages = $('#pages').find('.swiper-slide');

  //第八页的动画
  var page8animate = function() {
    $('.p8-content .g').css({
      webkitTransform: 'translate3d(0px, 0px, 0px)',
      opacity: 1
    });
  };
  SwiperPages = new Swiper('#pages', {
    mode: 'vertical',
    resistance: '100%',
    slidesPerView: 'auto',
    onSlideChangeEnd: function(e) {
      var idx = e.activeIndex;
      if (inited[idx]) {
        return false;
      }
      inited[idx] = true;
      //初始化图表
      switch (idx) {
        case 0:
          break;
        case 1:
          Charts.get('donut').init();
          break;
        case 2:
          var _w = $('.pie').width();
          $('.pie').height(_w);
          var pie = Charts.get('pie');
          pie.init('pie-1', [47, 73], '通信&<br>社交');
          pie.init('pie-2', [33, 44], '娱乐');
          pie.init('pie-3', [44, 24], '工具');
          pie.init('pie-4', [19, 17], '其他');
          break;
        case 3:
          (Utils.once(function() {
            Charts.get('column').init();
            var Swiper2 = new Swiper('.scroll-container2', {
              scrollContainer: true,
              scrollbar: {
                container: '.scroll-scrollbar2'
              }
            });
          }))();
          break;
        case 4:
          Charts.get('bubble').init();
          break;
        case 5:
          Charts.get('p-donut').init();
          break;
        case 6:
          // Charts.get('round').init();
          break;
        case 7:
          page8animate();
          break;
        default:
          break;
      }
    },
    speed: 1000
  });
  /*测试代码*/
  // SwiperPages.swipeTo(7, 0);
  // page8animate();
  /**/
  //初始化提示弹窗
  var msgwindow = $('#alert').find('.msg-window');
  $('.swiper-slide').on('touchstart', '.toggle-tips', function() {
    var $this = $(this);
    var n = $this.data('n');
    var doc = docs[n];
    $('#alert').find('.msg-content').html(doc);
    $('#alert').show();
    setTimeout(function(){
      msgwindow.css({
        webkitTransition : '500ms',
        webkitTransform: 'translate3d(0px, -149px, 0px)',
        opacity:1
      })
    }, 0)

  })
  $('#alert').on('touchstart', '.btn-ok', function() {
    msgwindow.css({
      webkitTransition : '200ms',
      webkitTransform: 'translate3d(0px, 0px, 0px)',
      opacity:0
    });
    setTimeout(function() {
      $('#alert').hide();
    }, 200);
  });
  $(document).ready(function() {
    function stopScrolling(touchEvent) {
      touchEvent.preventDefault();
    }
    document.addEventListener('touchstart', stopScrolling, false);
    document.addEventListener('touchmove', stopScrolling, false);
  });
  $('.swiper-slide').height(pageHeight);

  var areaGap = 40;
  $('#area').height(300).width(800);
  $('.area-grid').width(areaGap);
  $('.area-container').width(document.body.clientWidth - areaGap).css({
    overflow: 'hidden',
    marginLeft: areaGap + 'px'
  });

  var colGap = 40;
  $('#column').height(270).width(800);
  $('.column-grid').width(colGap);
  $('.column-container').width(document.body.clientWidth - colGap).css({
    overflow: 'hidden',
    marginLeft: colGap + 'px'
  });
  //让全部图表居中
  var titles = $('.title');
  var filledSpace = [439, 439, 439, 499, 439, 439, 439, 439];
  for (var i = 0; i < 8; i++) {
    $(titles[i]).css({
      marginBottom: (pageHeight - filledSpace[i]) / 2
    });
  }
  //封面的拖动效果
  var cover = $('#cover');
  cover
    .hammer()
    .bind("panup", function(ev) {
      cover.css({
        webkitTransition: '500ms',
        webkitTransform: 'translate3d(0px, '+(-pageHeight)+'px, 0px)'
      });

      setTimeout(function(){
          (Utils.once(function() {

            Charts.get('area').init();

            window.areaSwipe = new Swiper('.scroll-container', {
              scrollContainer: true,
              scrollbar: {
                container: '.scroll-scrollbar'
              }
            });

            // setTimeout(function(){
            //   areaSwipe.params.speed=500;
            //   areaSwipe.setWrapperTranslate(-600,0,0, 600);
            // }, 0);
            

          }))();
      }, 500);

    });
  $('#page1').hammer().bind("pandown", function(ev) {
    cover.css({
      webkitTransform: 'translate3d(0px, 0px, 0px)'
    });
  });
  var pages = $("#pages");
  $('#page8').hammer().bind("panup", function(ev) {
    pages.css({
      webkitTransition: '500ms',
      webkitTransform: 'translate3d(0px, '+(-pageHeight)+'px, 0px)'
    });
  });
  $('#bcover').hammer().bind("pandown", function(ev) {
    pages.css({
      webkitTransform: 'translate3d(0px, 0px, 0px)'
    });
  });
  //重力感应效果
  var lastdeg = -25;
  var lastleft = 0,
    lastbottom = 0,
    lastright = -42,
    lasttop = 43;

  function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    if (Math.abs(acceleration.x) < 2 && Math.abs(acceleration.y) < 2) {
      return false;
    }
    var left = -acceleration.x * 3;
    var bottom = acceleration.y * 3;
    var dl = left - lastleft;
    var db = bottom - lastbottom;
    lastleft += dl / Math.abs(dl);
    lastbottom += db / Math.abs(db);
    $('#img1').css({
      left: lastleft,
      bottom: lastbottom
    }, 0);
    var right = acceleration.x * 3 - 42;
    var top = acceleration.y * 3 + 43;
    var dr = right - lastright;
    var dt = top - lasttop;
    lastright += dr / Math.abs(dr);
    lastbottom += dt / Math.abs(dt);
    $('#img2').animate({
      right: lastright,
      top: lasttop
    }, 0);
    var deg = -25 + acceleration.x * 10 / Math.PI;
    var dd = deg - lastdeg;
    lastdeg = deg;
    $('#img3').css({
      webkitTransform: 'rotateY(' + lastdeg + 'deg)'
    });
  }
  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);
  }

  if( !isWeixin() ){
    $('.weixin').hide();
  }
};