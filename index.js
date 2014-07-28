(function() {
  var SwiperCover, SwiperPages, SwiperEnd;
  var colors = ['', '#2fb86c', '#2eb1b3', '#27a0c0', '#26a3c3', '#2063b6', 'black', 'red']; //色彩集合
  var gennerrateCssStyle = function(idx, direction, colors) {
    var before;
    if (direction === 'prev') {
      before = idx + 1;
    } else {
      before = idx - 1;
    }
    var prefix = ['', '-webkit-', '-moz-', '-o-'];
    var cssCont = '{from{background:' + colors[before] + '} to{background:' + colors[idx] + '}}';
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
  //当前过渡动画的className
  var duractionClassName = '';
  var style = $('style');
  SwiperCover = new Swiper('#cover', {
    mode: 'vertical',
    resistance: '100%',
    onSlideChangeEnd: function(e) {
      if (e.activeIndex === 1) {
        Charts.get('area').init();
        $('#cover').css({
          'zIndex': 0
        });
        $('#end').hide();
        SwiperCover.swipeTo(0, 0);
      }
    },
    speed: 1000
  });
  var pages = $('#pages').find('.swiper-slide');
  SwiperPages = new Swiper('#pages', {
    mode: 'vertical',
    resistance: '100%',
    onSlideChangeEnd: function(e) {
      var idx = e.activeIndex;
      //移除用于动画的class，将前后改成和当前page一样的颜色。
      for (var i = idx - 1; i <= idx + 1; i++) {
        if (i > 0 && i < 6) {
          var curPage = pages[i];
          $(curPage).removeClass(duractionClassName).css({
            background: colors[idx]
          });
        }
      }
      $(pages[idx]).find('.title').addClass('title-animate');
    },
    onSlidePrev: function(e) {
      var idx = e.activeIndex;
      if (idx <= 1) {
        $('#end').hide();
      }
      gennerrateCssStyle(idx, 'prev', colors);
    },
    onSlideNext: function(e) {
      var idx = e.activeIndex;
      if (idx > 5) {
        $('#end').show();
      }
      gennerrateCssStyle(idx, 'next', colors);
      //初始化图表
      switch (idx) {
        case 1:
          Charts.get('area').init();
          break;
        case 2:
          Charts.get('donut').init();
          break;
        case 3:
          var pie = Charts.get('pie');
          pie.init('pie-1', [47, 73], '通信&<br>社交');
          pie.init('pie-2', [33, 44], '娱乐');
          pie.init('pie-3', [27, 11], '工具');
          pie.init('pie-4', [17, 13], '浏览器<br>&搜索');
          pie.init('pie-5', [19, 17], '其他');
        case 4:
          Charts.get('column').init();
          break;
        case 5:

        default:
          break;
      }
    },
    speed: 1000
  });
  SwiperPages.swipeTo(1, 0);
  SwiperEnd = new Swiper('#end', {
    mode: 'vertical'
  });
})();