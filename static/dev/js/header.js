'use strict';

$(function () {
  $('#pull').on('click', function() {
    if (window.innerWidth < 992) {
      $('#bg')
        .stop(true, true)
        .fadeToggle(300);

      $('body')
        .toggleClass('active-nav');
    }
  });

  $(window).bind('load resize', function() {
    if (window.innerWidth > 991) {
      if ($('body').hasClass('active-nav')) {
        $('body').removeClass('active-nav');
      }
    }
  });
  
});