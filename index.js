function start() {
  var pageHeight = $('body').height();
  if (pageHeight < 458) pageHeight = 458;
  var SwiperCover, SwiperPages, SwiperEnd;
  var docs = [
    '<h1>智能机大盘：</h1>指智能机全体保有量中的日活跃（当天发生过至少一次联网行为的）设备数量',
    '<h1>日使用时长：</h1>指用户一天24小时中使用各类智能机应用的累计时长，不含短信和电话',
    '<h1>说明：</h1>娱乐类应用：包括游戏、视频、音乐和阅读类应用<br/>工具类应用：包括搜索、浏览器、地图导航、应用分发、办公/学习/生活工具、系统/安全/优化工具等',
    '<h1>说明：</h1>阿里：除阿里自有应用外，UC浏览器、高德地图等收购公司的应用也被纳入统计<br/>搜狐：腾讯入股搜狗后，搜狗继续作为搜狐的子公司独立运营，故仍将其纳入搜狐进行统计<br/>新浪：阿里入股新浪微博后，微博继续作为新浪子公司独立运营，故仍将其纳入新浪进行统计',
    '<h1>百度移动搜索MAU</h1>当月通过手机百度客户端或手机浏览器等方式使用过百度移动搜索的用户（包括Android、iPhone及其他系统平台）'
  ];
  var inited = [false, false, false, false, false, false, false, false];

  var gennerrateCssStyle = function(idx, direction, colors) {
    var before;
    if (direction === 'prev') {
      before = idx + 1;
    } else {
      before = idx - 1;
    }
    var prefix = ['', '-webkit-', '-moz-', '-o-'];
    var from = [],
      to = [];
    var cssCont = 'from{';
    for (var k = 0; k < prefix.length; k++) {
      from.push('background:' + prefix[k] + 'linear-gradient(135deg,' + colors[before][0] + ',' + colors[before][1] + ')');
      to.push('background:' + prefix[k] + 'linear-gradient(135deg,' + colors[idx][0] + ',' + colors[idx][1] + ')');
    }
    cssCont += from.join(';');
    cssCont += '}to{';
    cssCont += to.join(';');
    cssCont += '}';
    duractionClassName = 'trans' + before + 'to' + idx;
    var css = (function() {
      var result = '';
      for (var i = 0; i < prefix.length; i++) {
        result += '@';
        result += (prefix[i] + 'keyframes trans' + cssCont);
      }
      result += '.'
      result += duractionClassName;
      result += ('{');
      for (var j = 0; j < prefix.length; j++) {
        result += (prefix[j] + 'animation:trans 1s;');
      }
      result += '}';
      return result;
    })();
    style.html(css);
    if (before > 0 && before < 6) $(pages[before]).addClass(duractionClassName);
    if (idx > 0 && idx < 6) $(pages[idx]).addClass(duractionClassName);
  }
  var cover = $('#cover');
  cover
    .hammer()
    .bind("panup", function(ev) {
      cover.animate({
        marginTop: -pageHeight
      });
    });
  $('#page1').hammer().bind("pandown", function(ev) {
    cover.animate({
      marginTop: 0
    });
  });
  //当前过渡动画的className
  var duractionClassName = '';

  var style = $('style');
  var pages = $('#pages').find('.swiper-slide');

  var Swiper1 = new Swiper('.scroll-container', {
    scrollContainer: true,
    scrollbar: {
      container: '.scroll-scrollbar'
    }
  });
  var Swiper2 = new Swiper('.scroll-container2', {
    scrollContainer: true,
    scrollbar: {
      container: '.scroll-scrollbar2'
    }
  });
  //第八页的动画
  var page8animate = function() {
    var p8content = $('.p8-content');
    var titles = p8content.find('h1');
    var contents = p8content.find('p');
    $(titles[0]).animate({
      marginTop: -30
    });
    $(titles[1]).delay(100).animate({
      marginTop: 0
    });
    $(titles[2]).delay(200).animate({
      marginTop: 0
    });
    $(titles[3]).delay(300).animate({
      marginTop: 0
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
          Charts.get('column').init();
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
    $('#alert').find('.msg-window');
    msgwindow.animate({
      marginTop: '-149px'
    })
  })
  $('#alert').on('touchstart', '.btn-ok', function() {
    msgwindow.animate({
      marginTop: '0'
    }, 200, function() {
      $('#alert').hide();
    });
  });
  $(document).ready(function() {
    function stopScrolling(touchEvent) {
      touchEvent.preventDefault();
    }
    document.addEventListener('touchstart', stopScrolling, false);
    document.addEventListener('touchmove', stopScrolling, false);
  });
  $('.swiper-slide').height(pageHeight);
  // $('#area').height(pageHeight - 200);
  // $('#donut').height((pageHeight - 200 >= 250) ? 250 : (pageHeight - 200));
  // $('#column').height(pageHeight - 250);
  // $('#bubble').height(pageHeight - 300);
  //封面的拖动效果
  var cover = $('#cover');
  cover
    .hammer()
    .bind("panup", function(ev) {
      cover.animate({
        marginTop: -pageHeight
      }, 500, function() {
        Charts.get('area').init();
      });
    });
  $('#page1').hammer().bind("pandown", function(ev) {
    cover.animate({
      marginTop: 0
    });
  });
  $('#page8').hammer().bind("panup", function(ev) {
    $("#pages").animate({
      marginTop: -pageHeight
    });
  });
  $('#bcover').hammer().bind("pandown", function(ev) {
    $("#pages").animate({
      marginTop: 0
    });
  });
  //重力感应效果
  function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    $('#img1').css({
      left: acceleration.x - 5,
      bottom: acceleration.y
    });

    $('#img2').css({
      webkitTransform: 'rotateX(' + acceleration.y + ')'
    });
  }
  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);
  }
};
