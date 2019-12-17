'use strict';

$(function () {
  $('#carousel').slick({
    infinite: true,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
    arrows: true,
    centerPadding: '0',
    appendArrows: '#carousel-container',
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          arrows: false,
          dots: true
        }
      },
      {
        breakpoint: 1200,
        settings: {
          centerMode: false,
          variableWidth: false,
          arrows: false,
          dots: true
        }
      }
    ]
  });
});