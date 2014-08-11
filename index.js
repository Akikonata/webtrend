function start() {
  function isWeixin() {
    return navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0;
  }
  var pageHeight = $('body').height();
  if (pageHeight < 458) pageHeight = 458;
  var docs = [
    '<h1>智能机大盘：</h1>指智能机全体保有量中的日活跃（当天发生过至少一次联网行为的）设备数量',
    '<h1>日使用时长：</h1>指用户一天24小时中使用各类智能机应用的累计时长，不含短信和电话',
    '<h1>说明：</h1>娱乐类应用：包括游戏、视频、音乐和阅读类应用<br/>工具类应用：包括搜索、浏览器、地图导航、应用分发、办公/学习/生活工具、系统/安全/优化工具等',
    '<h1>说明：</h1>阿里：除阿里自有应用外，UC浏览器、高德地图等收购公司的应用也被纳入统计<br/>搜狐：腾讯入股搜狗后，搜狗继续作为搜狐的子公司独立运营，故仍将其纳入搜狐进行统计<br/>新浪：阿里入股新浪微博后，微博继续作为新浪子公司独立运营，故仍将其纳入新浪进行统计',
    '<h1>百度移动搜索MAU</h1>当月通过手机百度客户端或手机浏览器等方式使用过百度移动搜索的用户（包括Android、iPhone及其他系统平台）'
  ];
  var inited = [false, false, false, false, false, false, false, false];

  //当前过渡动画的className

  //第八页的动画
  var page8animate = function() {
    $('.p8-content .g').css({
      webkitTransform: 'translate3d(0px, 0px, 0px)',
      opacity: 1
    });
  };

  var colSwiper;

  function setColTip2() {
    var t = $('#tip-fixed');
    var x = colSwiper.getWrapperTranslate('x');
    if (x < -30) {

      var n = -x - 240;
      if (n < 0) n = 0;
      t.css('webkitTransform', 'translate3d(' + n + 'px, 0px, 0px)');
    }
  }

  var SwiperPages = new Swiper('#pages', {
    mode: 'vertical',
    resistance: '100%',
    slidesPerView: 'auto',
    moveStartThreshold : 80,
    speed: 1000,
    onSlideChangeEnd: function(e) {
      var idx = e.activeIndex;

      if (inited[idx]) {
        return false;
      }

      inited[idx] = true;
      //初始化图表
      initPage(idx);
    }
  });

  // var pp = $('.page');
  // var pageCount = pp.length;
  // var pageChildren = pp.children();
  // function togglePageContent(index){
  //   pageChildren.hide();

  //   for(var i=0; i<pageCount; i++){
  //     if(Math.abs(i-index)<3){

  //       if(i>=0 && i<pageCount  ){
  //         $('#page' + (i+1)).children().show();
  //       }
  //     }
  //   }
  // }

  function initPage(index){
    switch (index) {
      case 0:
        break;
      case 1:
        Charts.get('donut').init();
        break;
      case 2:
        var p = $('.pie');
        p.height( p.width() );
        var pie = Charts.get('pie');
        pie.init('pie-1', [47, 73], '通信&<br>社交');
        pie.init('pie-2', [33, 44], '娱乐');
        pie.init('pie-3', [44, 24], '工具');
        pie.init('pie-4', [19, 17], '其他');
        break;
      case 3:
        (Utils.once(function() {
          Charts.get('column').init();
          colSwiper = new Swiper('.scroll-container2', {
            scrollContainer: true,
            onTouchEnd: setColTip2
          });

          colSwiper.wrapperTransitionEnd(setColTip2, true);

          setTimeout(function() {
            $('.scroll-container2 .swiper-wrapper').css({
              webkitTransition: '3.5s'
            });
            colSwiper.setWrapperTranslate(-520, 0, 0);
          }, 800);

        }))();
        break;
      case 4:
        Charts.get('bubble').init();
        break;
      case 5:
        Charts.get('p-donut').init();
        break;
      case 6:
        Charts.get('round').init();
        break;
      case 7:
        page8animate();
        break;
      default:
        break;
    }
  }

  //初始化提示弹窗
  var alert = $('#alert');
  var msgwindow = $('.msg-window', alert);
  $('.swiper-slide').on('touchstart', '.toggle-tips', function() {
    var $this = $(this);
    var n = $this.data('n');
    var doc = docs[n];
    alert.find('.msg-content').html(doc);
    alert.show();
    setTimeout(function() {
      msgwindow.css({
        webkitTransition: '500ms',
        webkitTransform: 'translate3d(0px, -149px, 0px)',
        opacity: 1
      })
    }, 0)

  })

  alert.on('touchstart', '.btn-ok', function() {
    msgwindow.css({
      webkitTransition: '200ms',
      webkitTransform: 'translate3d(0px, 0px, 0px)',
      opacity: 0
    });

    setTimeout(function() {
      alert.hide();
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
        webkitTransition: '600ms',
        webkitTransform: 'translate3d(0px, ' + (-pageHeight) + 'px, 0px)',
        zoom:1
      });

      setTimeout(function() {
        (Utils.once(function() {

          Charts.get('area').init();

          var areaSwipe = new Swiper('.scroll-container', {
            scrollContainer: true,
            scrollbar: {
              container: '.scroll-scrollbar'
            }
          });

          setTimeout(function() {
            $('.scroll-container .swiper-wrapper').css({
              webkitTransition: '2s'
            });
            areaSwipe.setWrapperTranslate(-200, 0, 0);
            setTimeout(function() {
              areaSwipe.setWrapperTranslate(-520, 0, 0);
            }, 1500);
          }, 800);


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
      webkitTransform: 'translate3d(0px, ' + (-pageHeight) + 'px, 0px)'
    });
  });
  $('#bcover').hammer().bind("pandown", function(ev) {
    pages.css({
      webkitTransform: 'translate3d(0px, 0px, 0px)'
    });
  });

  //重力感应效果
  var img1 = $('#img1'),
      img2 = $('#img2'),
      img3 = $('#img3');

  function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;

    if (Math.abs(acceleration.x) < 2 && Math.abs(acceleration.y) < 2) {
      return false;
    }

    var left = -(acceleration.x|0) * 3;

    img1.css({
      webkitTransform : 'translate3d('+left+'px,0px,0px)'
    }, 0);


    img2.css({
      webkitTransform : 'translate3d('+left+'px,0px,0px)'
    }, 0);

    var deg = -25 + acceleration.x * 10 / Math.PI;

    img3.css({
      webkitTransform: 'rotateY(' + deg + 'deg)'
    });
    
  }

  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);
  }

  if (!isWeixin()) {
    $('.weixin').hide();
    $('.book').css({
      display : 'block',
      margin: '25px auto 25px'
    });
  }

  $('#pdf-link').hammer().on('tap', function(){
    var link = 'http://developer.baidu.com/static/assets/reportpdf/%E7%99%BE%E5%BA%A6%E7%A7%BB%E5%8A%A8%E8%B6%8B%E5%8A%BF%E6%8A%A5%E5%91%8A2014Q2.pdf';
    window.open(link, '_blank');
  });


  /*global WeixinJSBridge: true*/
  document.addEventListener('WeixinJSBridgeReady', function(e) {
    // if (configs.onWeixinReady) {
    //   configs.onWeixinReady(e);
    // }

    WeixinJSBridge.on('menu:share:appmessage', function() {
      WeixinJSBridge.invoke('sendAppMessage', {
        img_width: 300,
        img_height: 300,
        img_url: 'http://shushuo.baidu.com/act/webtrend/img/weixin_pic.jpg',
        link: 'http://shushuo.baidu.com/act/webtrend/',
        desc: '2014Q2百度移动互联网发展趋势报告',
        title: '2014Q2百度移动互联网发展趋势报告'
      });
    });

    WeixinJSBridge.on('menu:share:timeline', function() {
      WeixinJSBridge.invoke('shareTimeline', {
        img_width: 300,
        img_height: 300,
        img_url: 'http://shushuo.baidu.com/act/webtrend/img/weixin_pic.jpg',
        link: 'http://shushuo.baidu.com/act/webtrend/',
        desc: '2014Q2百度移动互联网发展趋势报告',
        title: '2014Q2百度移动互联网发展趋势报告'
      });
    });
  });

};