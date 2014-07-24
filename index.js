(function() {
  var SwiperCover, SwiperPages, SwiperEnd;
  var colors = ['', '#2fb86c', '#2eb1b3', '#27a0c0', '#26a3c3', '#2063b6']; //色彩集合
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
      result += '}'
      return result;
    })();
    style.html(css);
    $(pages[before]).addClass(duractionClassName);
    if (before > 0 && before < 6) $(pages[idx]).addClass(duractionClassName);
  }
  var cover = $('#cover');
  //当前过渡动画的className
  var duractionClassName = '';
  var style = $('style');
  SwiperCover = new Swiper('#cover', {
    mode: 'vertical',
    onSlideChangeEnd: function(e) {
      if (e.activeIndex === 1) {
        $('#cover').css({
          'zIndex': 3
        });
        SwiperCover.swipeTo(0, 0);
      }
    },
    speed: 500
  });
  var pages = $('#pages').find('.swiper-slide');
  SwiperPages = new Swiper('#pages', {
    mode: 'vertical',
    onSlideChangeEnd: function(e) {
      var idx = e.activeIndex;
      if (idx === 0) {
        cover.css({
          'zIndex': 10
        });
        SwiperPages.swipeTo(1, 0);
      } else if (idx === 5) {
        cover.css({
          'zIndex': 0
        });
      }
      //移除用于动画的class，将前后改成和当前page一样的颜色。
      for (var i = idx - 1; i <= idx + 1; i++) {
        if (i > 0 && i < 6) {
          var curPage = pages[i];
          $(curPage).removeClass(duractionClassName).css({
            background: colors[idx]
          });
        }
      }
    },
    onSlidePrev: function(e) {
      gennerrateCssStyle(e.activeIndex, 'prev', colors);
    },
    onSlideNext: function(e) {
      gennerrateCssStyle(e.activeIndex, 'next', colors);
    },
    speed: 1000
  });
  SwiperPages.swipeTo(1, 0);
  SwiperEnd = new Swiper('#end', {
    mode: 'vertical'
  });
})();