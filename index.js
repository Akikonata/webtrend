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
        if (i > 0 && i < 9) {
          var curPage = pages[i];
          $(curPage).removeClass(duractionClassName).css({
            'background': '-moz-linear-gradient(135,' + colors[idx][0] + ', ' + colors[idx][1] + ')',
            'background': '-webkit-linear-gradient(135, from(' + colors[idx][0] + '), to(' + colors[idx][1] + '))',
            'background': 'linear-gradient(135, ' + colors[idx][0] + ', ' + colors[idx][1] + ')',
            'background': '-o-linear-gradient(135, ' + colors[idx][0] + ',' + colors[idx][1] + ')'
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
      if (idx > 8) {
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
          Charts.get('bubble').init();
          break;
        case 6:
          Charts.get('p-donut').init();
          break;
        case 7:
          break;
        case 8:
          break;
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