(function() {

  var SwiperCover, SwiperPages, SwiperEnd;
  var cover = $('#cover');
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