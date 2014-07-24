(function() {
  var SwiperCover, SwiperPages, SwiperEnd;
  var colors = ['#2fb86c', '#2eb1b3', '#27a0c0', '#26a3c3', '#2063b6']; //色彩集合
  var cover = $('#cover');
  //当前过渡动画的className
  var duractionClassName = '';
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
    },
    onSlidePrev: function(e) {
      var idx = e.activeIndex;
      if (idx === 0) {
        cover.css({
          'zIndex': 3
        });
      }
      //生成过渡动画
    },
    onSlideNext: function(e) {
      var idx = e.activeIndex;
      var lastPage = pages[idx - 1];
      var curPage = pages[idx];
      var cName = 'trans' + (idx - 1) + 'to' + idx;
      if (idx > 1) {
        $(lastPage).removeClass(cName);
        $(lastPage).addClass(cName);
      }
      $(curPage).removeClass(cName);
      $(curPage).addClass(cName);
    },
    speed: 500
  });
  SwiperPages.swipeTo(1, 0);
  SwiperEnd = new Swiper('#end', {
    mode: 'vertical'
  });
})();