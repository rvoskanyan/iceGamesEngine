import Swiper from 'swiper';
import {Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export const popularsSwiper = () => new Swiper('.swiper-slider-populars', {
  slidesPerView: 2.24,
  spaceBetween: 8,
  loop: true,
  freeMode: false,
  modules: [Navigation, Pagination, Autoplay],
  grabCursor: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 800,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  // Responsive breakpoints
  breakpoints: {
    375: {
      slidesPerView: 2.63,
    },
    540: {
      slidesPerView: 3.80,
    },
    1280: {
      slidesPerView: 5,
      spaceBetween: 45,
    },
    1366: {
      slidesPerView: 5,
      spaceBetween: 65,
    },
     1920: {
      slidesPerView: 5,
      spaceBetween: 85,
    }
  }
});


export const swiperSelections = () => new Swiper('.swiper-slider-selections', {
  speed: 1000,
  slidesPerView: 1.25,
  spaceBetween: 8,
  loop: true,
  freeMode: false,
  modules: [Navigation, Pagination, Autoplay],
  // And if we need scrollbar
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  // Responsive breakpoints
  breakpoints: {
     540: {
      slidesPerView: 1.50,
    },
    1280: {
      slidesPerView: 3,
    },
  }
});

export const swiperGenres = () => new Swiper('.swiper-slider-genres', {
  speed: 1000,
  slidesPerView: 1.25,
  spaceBetween: 8,
  loop: true,
  freeMode: false,
  modules: [Navigation, Pagination, Autoplay],
  // And if we need scrollbar
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  // Responsive breakpoints
  breakpoints: {
    375: {
      slidesPerView: 2.5,
    },
    540: {
      slidesPerView: 1.25,
    },
     1280: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  }
});

export const swiperNews = () => new Swiper('.swiper-slider-news', {
  speed: 1400,
  slidesPerView: 1.25,
  spaceBetween: 8,
  loop: true,
  freeMode: false,
  modules: [Navigation, Pagination, Autoplay],
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  // Responsive breakpoints
  breakpoints: {
    540: {
      slidesPerView: 1.5,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  }
});


