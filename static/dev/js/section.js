'use strict';

$(function () {
  $('.section__carousel').each(function() {
    let parentContainer = $(this).closest('.section');
    let sectionCarouselContainer = parentContainer.find('.section__carousel-cover');
    let sectionHeaderContainer = parentContainer.find('.section__header');

    $(this).slick({
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      arrows: true,
      centerPadding: '0',
      appendArrows: sectionCarouselContainer,
      appendDots: sectionHeaderContainer,
      responsive: [
        {
          breakpoint: 1300,
          settings: {
            arrows: false,
            dots: true
          }
        },
        {
          breakpoint: 992,
          settings: {
            arrows: false,
            dots: true,
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            dots: true,
            slidesToShow: 2,
            slidesToScroll: 2,
            appendDots: parentContainer
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            dots: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            appendDots: parentContainer
          }
        }
      ]
    });
  });
  
});