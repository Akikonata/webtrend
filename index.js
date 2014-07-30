(function() {
  var SwiperCover, SwiperPages, SwiperEnd;
  var colors = [
    [],
    ['#b0442b', '#d07e47'],
    ['#34aa71', '#7cc33d'],
    ['#299fad', '#31bbb6'],
    ['#484ec7', '#1ea0f3'],
    ['#7540bc', '#683fdd'],
    ['#b0442b', '#d07e47'],
    ['#34aa71', '#7cc33d'],
    ['#299fad', '#31bbb6'],
  ]; //色彩集合
  var docs = [
    '<h1>智能机大盘：</h1>指智能机全体保有量中的日活跃（当天发生过至少一次联网行为的）设备数量',
    '<h1>日使用时长：</h1>指用户一天24小时中使用各类智能机应用的累计时长，不含短信和电话',
    '<h1>说明：</h1>娱乐类应用：包括游戏、视频、音乐和阅读类应用<br/>工具类应用：包括搜索、浏览器、地图导航、应用分发、办公/学习/生活工具、系统/安全/优化工具等',
    '<h1>说明：</h1>阿里：除阿里自有应用外，UC浏览器、高德地图等收购公司的应用也被纳入统计<br/>搜狐：腾讯入股搜狗后，搜狗继续作为搜狐的子公司独立运营，故仍将其纳入搜狐进行统计<br/>新浪：阿里入股新浪微博后，微博继续作为新浪子公司独立运营，故仍将其纳入新浪进行统计',
    '<h1>百度移动搜索MAU</h1>当月通过手机百度客户端或手机浏览器等方式使用过百度移动搜索的用户（包括Android、iPhone及其他系统平台）'
  ];
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
    console.log(css);
    if (before > 0 && before < 6) $(pages[before]).addClass(duractionClassName);
    if (idx > 0 && idx < 6) $(pages[idx]).addClass(duractionClassName);
  }
  var cover = $('#cover');
  //当前过渡动画的className
  var duractionClassName = '';
  var style = $('style');
  var pages = $('#pages').find('.swiper-slide');
  Charts.get('area').init();
  SwiperPages = new Swiper('#pages', {
    mode: 'vertical',
    resistance: '100%',
    onSlideNext: function(e) {
      var idx = e.activeIndex;
      //初始化图表
      switch (idx) {
        case 0:
          break;
        case 1:
          Charts.get('donut').init();
          break;
        case 2:
          var pie = Charts.get('pie');
          pie.init('pie-1', [47, 73], '通信&<br>社交');
          pie.init('pie-2', [33, 44], '娱乐');
          pie.init('pie-3', [27, 11], '工具');
          pie.init('pie-4', [17, 13], '浏览器<br>&搜索');
          pie.init('pie-5', [19, 17], '其他');
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
          break;
        default:
          break;
      }
    },
    speed: 1000
  });
  /*测试代码*/
  // SwiperPages.swipeTo(6, 0);
  // Charts.get('round').init();
  /**/
  //初始化提示弹窗
  var msgwindow = $('#alert').find('.msg-window');
  $('.swiper-slide').on('click', '.toggle-tips', function() {
    var $this = $(this);
    var n = $this.data('n');
    var doc = docs[n];
    $('#alert').find('.msg-content').html(doc);
    $('#alert').show();
    $('#alert').find('.msg-window');
    msgwindow.animate({
      marginTop: '84px'
    })
  })
  $('#alert').on('click', '.btn-ok', function() {
    msgwindow.animate({
      marginTop: '0'
    }, 200, function() {
      $('#alert').hide();
    });
  });
})();