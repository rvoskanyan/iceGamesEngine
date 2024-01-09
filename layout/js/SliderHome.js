import Swiper from 'swiper';
import {Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slider = new Swiper('.swiper-slider-selections', {
  // centeredSlides: true,
  slidesPerView: 1.25,
  spaceBetween: 8,
  loop: true,
  freeMode: false,
  modules: [Navigation, Pagination, Autoplay],
  // And if we need scrollbar
  // autoplay: {
  //   delay: 3000,
  //   disableOnInteraction: false,
  // },
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
  // // If we need pagination
  // pagination: {
  //   el: '.swiper-pagination',
  // },
  
});

// slider.on(console.log('swiper-slider is on'))
// slider.enable(console.log('swiper-slider is on'))
// slider.init()
// slider.start()

// export default slider


//@ кастомное решение Slider.js
// export default class SliderHome {
//   constructor (options) {
//     const {
//       mainNode,
//       switchingTime,
//       isTrack,
//       isVertical,
//       progress, 
//       navigate,
//       progressNavigate,
//       countSlidesScroll = 1,
//       onSwitch,
//       carousel,
//       infinity,
//     } = options;
  
//     this.carousel = carousel;
//     this.switchingTime = switchingTime;
//     this.isTrack = isTrack;
//     this.isVertical = isVertical;
//     this.progress = progress;
//     this.navigate = navigate;
//     this.progressNavigate = progressNavigate;
//     this.countSlidesScroll = countSlidesScroll;
//     this.onSwitch = onSwitch;
//     this.infinity = infinity;
//     this.activeScreen = 0;
//     this.countVisibleSlides = 1;
//     this.timeOutId = null;
//     this.inervalProgressNavigate = null;
//     this.offsetSlide = 0;
  
//     this.mainNode = mainNode;
//     this.tapeNode = this.mainNode.querySelector('.js-tape');
//     // сколько картинок
//     this.slideNodes = this.mainNode.querySelectorAll('.js-slide');
    
//     // if (this.carousel) {
//     //   return this.carouselMode();
//     // }
    
//     this.prevBtnNode = this.mainNode.querySelector('.js-prevBtn');
//     this.nextBtnNode = this.mainNode.querySelector('.js-nextBtn');
    
//     // количество слайдов
//     this.countSlides = this.slideNodes.length;
//     this.countScreens = this.countSlides;
    
//     if (this.isTrack) {
//       // срабатывает один раз при загрузке страницы
//       const stylesSlide = getComputedStyle(this.slideNodes[0]);
//       this.visibleAreaNode = this.mainNode.querySelector('.js-visibleArea');
      
//       this.shareSlide = this.slideNodes[0].offsetWidth + parseInt(stylesSlide.marginLeft) + parseInt(stylesSlide.marginRight);
//       this.shareVisibleArea = this.visibleAreaNode.offsetWidth;
//       this.positionTape = 0;
      
//       if (this.isVertical) {
//         this.shareSlide = this.slideNodes[0].offsetHeight + parseInt(stylesSlide.marginTop) + parseInt(stylesSlide.marginBottom);
//         this.shareVisibleArea = this.visibleAreaNode.offsetHeight;
//       }
      
//       // this.countVisibleSlides =  this.shareVisibleArea / this.shareSlide;
//       // моя версия чтобы получать целое число номера слайда
//       this.countVisibleSlides = Math.floor(this.shareVisibleArea / this.shareSlide);

//       if (this.countSlidesScroll > this.countVisibleSlides) {
//         this.countSlidesScroll = this.countVisibleSlides;
//       }
  
//       //Количество фрагментов = считаем, сколько слайдов еще не отображено, делим на количество, которое скроллим за раз и прибавляем первый фрагмент
//       // this.countScreens = Math.ceil((this.countSlides - this.countVisibleSlides) / this.countSlidesScroll + 1); // 3
//       // console.log('this.countScreens', this.countScreens); // 3
//       this.countScreens = Math.ceil((this.countSlides - (this.countVisibleSlides - this.countSlidesScroll)) / this.countSlidesScroll); // 3
//     }
  
//     if (this.progress) {
//       this.shareProgress = 100 / this.countScreens;      
//       this.progressNode = this.mainNode.querySelector('.js-progress');
//       this.progressNode.style.setProperty('--share', `${this.shareProgress}%`);
//       this.progressNode.style.setProperty('--progress', `0%`);
//     }
  
//     if (this.navigate) {
//       this.navigateItemsContainerNode = this.mainNode.querySelector('.js-navigateItemsContainer');
//       this.navigateItemNodes = this.navigateItemsContainerNode.querySelectorAll('.js-itemNavigate');
      
//       this.navigateItemNodes.forEach((item, index) => {
//         item.addEventListener('click', () => this.switchScreen(index));
//       })
//     }
  
//     if (this.onSwitch) {
//       this.onSwitch([this.slideNodes[0]]);
//     }
  
//     //! срабатывает если есть время
//     if (this.switchingTime) {
//       // не влияет на слайдер
//       // this.startProgressNav(this.switchingTime);
      
//       //! двигает слайды чере промежуток времени
//       this.timeOutId = setTimeout(() => {
//         //  единожды запускает функцию движения слайдов
//         this.switchScreen(this.activeScreen + 1);
//       }, this.switchingTime);
//     }
        
  
//     this.prevBtnNode && this.prevBtnNode.addEventListener('click', () => this.switchScreen(this.activeScreen - 1));
//     this.nextBtnNode && this.nextBtnNode.addEventListener('click', () => this.switchScreen(this.activeScreen + 1));
  
//     for (let i = 0; i < this.countVisibleSlides; i++) {
//       if (this.slideNodes[i]) {
//         // this.slideNodes[i].classList.add('active');
//       }
//     }
    
//     if (this.visibleAreaNode) {
//       this.visibleAreaNode.addEventListener('mousedown', this.mouseDownVisibleArea);
//       this.visibleAreaNode.addEventListener('touchstart', this.touchVisibleArea);
//     }
  
//     if (this.infinity) {
//       this.firstVisibleSlides = Object.values(this.slideNodes).slice(0, this.countVisibleSlides);
//       this.firstSlidesStart = true;
//       this.slideNodesFirstSlidesEnd = undefined;
//     }
//   }
  

  
//   switchScreen = (targetScreen) => {
//     let prevScreen = this.activeScreen;
  
//     this.navigateItemNodes && this.navigateItemNodes[prevScreen].style.setProperty('--progressPercent', 0);
    
//     this.activeScreen = targetScreen;
    
//     // console.log('prevScreen', prevScreen);
//     // console.log('targetScreen', targetScreen);
    
    
//     //! двигает слайды чере промежуток времени
//     if (this.infinity) {
//       // this.setActiveClass(prevScreen, 'remove');
      
//       if (targetScreen + 1 > this.countScreens) {
//         this.tapeNode.style.transition = 'initial';
        
//         if (this.firstSlidesStart) {          
//           this.firstVisibleSlides.forEach(slide => {
//             this.tapeNode.append(slide);
//           });
    
//           this.firstSlidesStart = false;
//           this.activeScreen -= this.countVisibleSlides;
//           this.positionTape += this.countVisibleSlides * this.shareSlide;
//         } else {
//           [...this.firstVisibleSlides].reverse().forEach(slide => {
//             this.tapeNode.prepend(slide);
//           });
    
//           this.firstSlidesStart = true;
//           this.activeScreen = 1;
//           this.positionTape = 0;
//         }
        
//         this.tapeNode.style.transform = `translateX(${this.positionTape}px)`;
//         this.setActiveClass(this.activeScreen, 'add');
//         prevScreen = this.activeScreen - 1;
  
//         setTimeout(() => {
//           this.tapeNode.style.transition = '1s ease';
//           this.moveTape(prevScreen);
  
//           clearTimeout(this.timeOutId);
          
  
//           if (this.switchingTime) {
//             this.timeOutId = setTimeout(() => {
//               this.switchScreen(this.activeScreen + 1);
//             }, this.switchingTime);
//           }
//         }, 300);
        
//         return;
//       }
      
//       if (targetScreen < 0) {
//         this.tapeNode.style.transition = 'initial';
  
//         if (this.firstSlidesStart) {
//           this.firstVisibleSlides.forEach(slide => {
//             this.tapeNode.append(slide);
//           });
    
//           this.firstSlidesStart = false;
//           this.activeScreen = this.countScreens - 2;
//           this.positionTape = (this.countSlides - this.countVisibleSlides) * this.shareSlide * -1;
//         } else {
//           [...this.firstVisibleSlides].reverse().forEach(slide => {
//             this.tapeNode.prepend(slide);
//           });
    
//           this.firstSlidesStart = true;
//           this.activeScreen = this.countVisibleSlides - this.countSlidesScroll;
//           this.positionTape = this.countVisibleSlides * this.shareSlide * -1;
//         }
  
//         this.tapeNode.style.transform = `translateX(${this.positionTape}px)`;
//         this.setActiveClass(this.activeScreen, 'add');
//         prevScreen = this.activeScreen + 1;
  
//         setTimeout(() => {
//           this.tapeNode.style.transition = '1s ease';
//           this.moveTape(prevScreen);
    
//           clearTimeout(this.timeOutId);
    
//           if (this.switchingTime) {
//             this.timeOutId = setTimeout(() => {
//               this.switchScreen(this.activeScreen + 1);
//             }, this.switchingTime);
//           }
//         }, 300);
  
//         return;
//       }
  
//       this.setActiveClass(this.activeScreen, 'add');
//       this.moveTape(prevScreen);
  
//       clearTimeout(this.timeOutId);
  
//       if (this.switchingTime) {
//         this.timeOutId = setTimeout(() => {
//           this.switchScreen(this.activeScreen + 1);
//         }, this.switchingTime);
//       }
      
//       return;
//     }
    
//     // if (targetScreen >= this.countScreens) {
//     //   this.activeScreen = 0;
//     // }
    
//     // if (targetScreen < 0) {
//     //   this.activeScreen = this.countScreens - 1;
//     // }
  
//     // const prevSlides = this.setActiveClass(prevScreen, 'remove');
//     // const slides = this.setActiveClass(this.activeScreen, 'add');
    
//     // if (this.progress) {
//     //   this.progressNode.style.setProperty('--progress', `${this.shareProgress * (this.activeScreen)}%`);
//     // }
  
//     // if (this.onSwitch) {
//     //   this.onSwitch(slides, prevSlides);
//     // }
    
//     // if (this.isTrack) {
//     //   this.moveTape(prevScreen);
//     // }
  
//     // clearInterval(this.inervalProgressNavigate);
//     // clearTimeout(this.timeOutId);
  
//     // if (this.switchingTime) {
//     //   this.startProgressNav(this.switchingTime);
      
//     //   this.timeOutId = setTimeout(() => {
//     //     this.switchScreen(this.activeScreen + 1);
//     //   }, this.switchingTime);
//     // }
//   }
  
//   startProgressNav = (time) => {
//     if (!this.progressNavigate) {
//       return;
//     }
    
//     const timeInPercent = 100 / (time / 1000);
//     let second = 2;
//     let percent = 0;
  
//     clearInterval(this.inervalProgressNavigate);
  
//     this.navigateItemNodes[this.activeScreen].style.setProperty('--progressPercent', timeInPercent);
    
//     this.inervalProgressNavigate = setInterval(() => {
//       if (percent === 100) {
//         clearInterval(this.inervalProgressNavigate);
//       }
      
//       this.navigateItemNodes[this.activeScreen].style.setProperty('--progressPercent', timeInPercent * second);
//       percent += timeInPercent;
//       second++;
//     }, 1000);
//   }
  
//   setActiveClass = (screen, action) => {
//     let start = screen * this.countSlidesScroll - this.offsetSlide;
//     // console.log('screen', screen);
//     // console.log('this.countSlidesScroll', this.countSlidesScroll);
//     // console.log('this.offsetSlide', this.offsetSlide);
//     let end = start + Math.floor(this.countVisibleSlides);
//     // console.log('this.countVisibleSlides', this.countVisibleSlides);
//     // console.log('end', end);
//     let slideNodes = this.slideNodes;
    
   
    
//     const members = [];
    
//     if (this.activeScreen === 0 && this.offsetSlide) {
//       this.offsetSlide = 0;
//     }
    
//     if (this.isTrack && (end > this.countSlides)) {
//       this.offsetSlide = end - this.countSlides;
      
//       // console.log('this.offsetSlide', this.offsetSlide);
      
//       start -= this.offsetSlide;
//       // console.log('start after', start);
//       end = this.countSlides;
//       // console.log('end', end)
//     }
  
//     if (this.navigate) {
//       this.navigateItemNodes[screen].classList[action]('active');
//       this.navigateItemNodes[screen].blur();
      
//       if (this.navigateItemsContainerNode.clientWidth < this.navigateItemsContainerNode.scrollWidth && action === 'add') {
//         const leftOffset = parseFloat(getComputedStyle(this.navigateItemsContainerNode).paddingLeft);
//         const containerPosition = this.navigateItemsContainerNode.getBoundingClientRect().left;
//         const targetPosition = this.navigateItemNodes[screen].getBoundingClientRect().left;
//         const offsetPosition = targetPosition - leftOffset - containerPosition;
  
//         this.navigateItemsContainerNode.scrollBy({
//           left: offsetPosition,
//           behavior: 'smooth'
//         });
//       }
//     }
    
//     if (this.infinity && !this.firstSlidesStart) {
//       if (!this.slideNodesFirstSlidesEnd) {
//         this.slideNodesFirstSlidesEnd = this.mainNode.querySelectorAll('.js-slide');
//       }
      
//       slideNodes = this.slideNodesFirstSlidesEnd;
//     }
//     //!  не работает
//     while (start < end) {
//       // if(start === end + 1){
//         //  console.log('slideNodes', slideNodes);
//       // }
//       // const slide = slideNodes[start];
//       // members.push(slide);
//       // slide.classList[action]('active');
//       start++;
//     }
    
//     // console.log('members', members);
//     // members всегда пустой
//     return members;
//   }
  
//   moveTape = (prevScreen) => {
//     if (this.activeScreen > prevScreen) {
//       if (this.activeScreen + 1 === this.countScreens) {
//         this.positionTape = ((this.countSlides - this.countVisibleSlides) * this.shareSlide) * -1;
//       } else {
//         this.positionTape -= this.countSlidesScroll * this.shareSlide;
//       }
//     } else {
//       if (this.activeScreen === 0) {
//         this.positionTape = 0;
//       } else {
//         this.positionTape += this.countSlidesScroll * this.shareSlide;
//       }
//     }
    
//     if (this.isVertical) {
//       return this.tapeNode.style.transform = `translateY(${this.positionTape}px)`;
//     }
  
//     this.tapeNode.style.transform = `translateX(${this.positionTape}px)`;
//   }
// }