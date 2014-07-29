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
})();