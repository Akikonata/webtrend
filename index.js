(function() {
  var SwiperCover, SwiperPages, SwiperEnd;
  var colors = ['', '#2fb86c', '#2eb1b3', '#27a0c0', '#26a3c3', '#2063b6']; //色彩集合
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
        if (i > 0) {
          var curPage = pages[i];
          $(curPage).removeClass(duractionClassName).css({
            background: colors[idx]
          });
        }
      }
    },
    onSlidePrev: function(e) {
      console.log(e, 'prev');
    },
    onSlideNext: function(e) {
      console.log(e, 'next');
    },
    speed: 500
  });
  SwiperPages.swipeTo(1, 0);
  SwiperEnd = new Swiper('#end', {
    mode: 'vertical'
  });
})();