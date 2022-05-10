export default class Slider {
  constructor (options) {
    const {
      mainNode,
      switchingTime,
      isTrack,
      isVertical,
      progress,
      navigate,
      countSlidesScroll = 1,
      onSwitch,
      carousel,
    } = options;
  
    this.carousel = carousel;
    this.switchingTime = switchingTime;
    this.isTrack = isTrack;
    this.isVertical = isVertical;
    this.progress = progress;
    this.navigate = navigate;
    this.countSlidesScroll = countSlidesScroll;
    this.onSwitch = onSwitch;
    this.activeScreen = 0;
    this.countVisibleSlides = 1;
    this.timeOutId = null;
    this.offsetSlide = 0;
  
    this.mainNode = mainNode;
    this.tapeNode = this.mainNode.querySelector('.js-tape');
  
    if (this.carousel) {
      return this.carouselMode();
    }
    
    this.prevBtnNode = this.mainNode.querySelector('.js-prevBtn');
    this.nextBtnNode = this.mainNode.querySelector('.js-nextBtn');
    this.slideNodes = this.mainNode.querySelectorAll('.js-slide');
    
    this.countSlides = this.slideNodes.length;
    this.countScreens = this.countSlides;
    
    if (this.isTrack) {
      const stylesSlide = getComputedStyle(this.slideNodes[0]);
      this.visibleAreaNode = this.mainNode.querySelector('.js-visibleArea');
      
      this.shareSlide = this.slideNodes[0].offsetWidth + parseInt(stylesSlide.marginLeft) + parseInt(stylesSlide.marginRight);
      this.shareVisibleArea = this.visibleAreaNode.offsetWidth;
      this.positionTape = 0;
      
      if (this.isVertical) {
        this.shareSlide = this.slideNodes[0].offsetHeight + parseInt(stylesSlide.marginTop) + parseInt(stylesSlide.marginBottom);
        this.shareVisibleArea = this.visibleAreaNode.offsetHeight;
      }
      
      this.countVisibleSlides = this.shareVisibleArea / this.shareSlide;
      
      if (this.countSlidesScroll > this.countVisibleSlides) {
        this.countSlidesScroll = this.countVisibleSlides;
      }
  
      //Количество фрагментов = считаем, сколько слайдов еще не отображено, делим на количество, которое скроллим за раз и прибавляем первый фрагмент
      this.countScreens = Math.ceil((this.countSlides - this.countVisibleSlides) / this.countSlidesScroll + 1);
      //this.countScreens = Math.ceil((this.countSlides - (this.countVisibleSlides - this.countSlidesScroll)) / this.countSlidesScroll);
    }
  
    if (this.progress) {
      this.shareProgress = 100 / this.countScreens;
      this.progressNode = this.mainNode.querySelector('.js-progress');
      this.progressNode.style.setProperty('--share', `${this.shareProgress}%`);
      this.progressNode.style.setProperty('--progress', `0%`);
    }
  
    if (this.navigate) {
      this.navigateItemsContainerNode = this.mainNode.querySelector('.js-navigateItemsContainer');
      this.navigateItemNodes = this.navigateItemsContainerNode.querySelectorAll('.js-itemNavigate');
      
      this.navigateItemNodes.forEach((item, index) => {
        item.addEventListener('click', () => this.switchScreen(index));
      })
    }
  
    if (this.onSwitch) {
      this.onSwitch([this.slideNodes[0]]);
    }
  
    if (this.switchingTime) {
      this.timeOutId = setTimeout(() => {
        this.switchScreen(this.activeScreen + 1);
      }, this.switchingTime);
    }
    
    this.prevBtnNode.addEventListener('click', () => this.switchScreen(this.activeScreen - 1));
    this.nextBtnNode.addEventListener('click', () => this.switchScreen(this.activeScreen + 1));
  
    for (let i = 0; i < this.countVisibleSlides; i++) {
      if (this.slideNodes[i]) {
        this.slideNodes[i].classList.add('active');
      }
    }
    
    if (this.visibleAreaNode) {
      this.visibleAreaNode.addEventListener('mousedown', this.mouseDownVisibleArea);
      this.visibleAreaNode.addEventListener('touchstart', this.touchVisibleArea);
    }
  
    /*switch (this.type) {
      case 'switchClass': {
        this.handleSwitch = this.getSwitcher(this.switchClass);
        this.tapeNode = true;
        if (this.navigateInitial) {
          this.navNodes.forEach((item, index) => item.addEventListener('click', () => this.handleSwitch(index)));
        }
        this.nextBtnNode.addEventListener('click', () => this.handleSwitch(this.slideActive + this.slideScroll));
        this.prevBtnNode.addEventListener('click', () => this.handleSwitch(this.slideActive - this.slideScroll));
        break;
      }
      case 'track': {
        //this.tape.addEventListener('mousedown', this.moveTape);
        this.widthSlide = this.visibleAreaNode.offsetWidth / this.countVisibleSlides;
        this.slidesNodes.forEach(item => item.style.width = `${this.widthSlide}px`);
        this.positionTape = 0;
        this.handleSwitch = this.getSwitcher(this.trackSwitch);
        break;
      }
      case 'verticalTrack': {
        this.heightSlide = this.visibleAreaNode.offsetHeight / this.countVisibleSlides;
        this.slidesNodes.forEach(item => item.style.height = `${this.heightSlide}px`);
        this.positionTape = 0;
        this.handleSwitch = this.getSwitcher(this.verticalTrackSwitch);
        break;
      }
    }*/
  }
  
  switchScreen = (targetScreen) => {
    const prevScreen = this.activeScreen;
    
    this.activeScreen = targetScreen;
    
    if (targetScreen >= this.countScreens) {
      this.activeScreen = 0;
    }
    
    if (targetScreen < 0) {
      this.activeScreen = this.countScreens - 1;
    }
  
    const prevSlides = this.setActiveClass(prevScreen, 'remove');
    const slides = this.setActiveClass(this.activeScreen, 'add');
    
    if (this.progress) {
      this.progressNode.style.setProperty('--progress', `${this.shareProgress * (this.activeScreen)}%`);
    }
  
    if (this.onSwitch) {
      this.onSwitch(slides, prevSlides);
    }
    
    if (this.isTrack) {
      this.moveTape(prevScreen);
    }
  
    clearTimeout(this.timeOutId);
  
    if (this.switchingTime) {
      this.timeOutId = setTimeout(() => {
        this.switchScreen(this.activeScreen + 1);
      }, this.switchingTime);
    }
  }
  
  setActiveClass = (screen, action) => {
    let start = screen * this.countSlidesScroll - this.offsetSlide;
    let end = start + this.countSlidesScroll;
    
    if (action === 'add') {
      end = start + this.countVisibleSlides;
    }
    
    const members = [];
    
    if (this.activeScreen === 0 && this.offsetSlide) {
      this.offsetSlide = 0;
    }
    
    if (this.isTrack && end > this.countSlides) {
      this.offsetSlide = end - this.countSlides;
      start -= this.offsetSlide;
      end = this.countSlides;
    }
  
    if (this.navigate) {
      this.navigateItemNodes[screen].classList[action]('active');
      this.navigateItemNodes[screen].blur();
      
      if (this.navigateItemsContainerNode.clientWidth < this.navigateItemsContainerNode.scrollWidth && action === 'add') {
        const leftOffset = parseFloat(getComputedStyle(this.navigateItemsContainerNode).paddingLeft);
        const containerPosition = this.navigateItemsContainerNode.getBoundingClientRect().left;
        const targetPosition = this.navigateItemNodes[screen].getBoundingClientRect().left;
        const offsetPosition = targetPosition - leftOffset - containerPosition;
  
        this.navigateItemsContainerNode.scrollBy({
          left: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    
    while (start < end) {
      const slide = this.slideNodes[start];
      
      members.push(slide);
      slide.classList[action]('active');
      start++;
    }
    
    return members;
  }
  
  moveTape = (prevScreen) => {
    if (this.activeScreen > prevScreen) {
      if (this.activeScreen + 1 === this.countScreens) {
        this.positionTape = ((this.countSlides - this.countVisibleSlides) * this.shareSlide) * -1;
      } else {
        this.positionTape -= this.countSlidesScroll * this.shareSlide;
      }
    } else {
      if (this.activeScreen === 0) {
        this.positionTape = 0;
      } else {
        this.positionTape += this.countSlidesScroll * this.shareSlide;
      }
    }
    
    if (this.isVertical) {
      return this.tapeNode.style.transform = `translateY(${this.positionTape}px)`;
    }
  
    this.tapeNode.style.transform = `translateX(${this.positionTape}px)`;
  }
  
  changeTimeoutOnce = (time) => {
    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(() => {
      this.switchScreen(this.activeScreen + 1);
    }, time);
  }
  
  carouselMode = () => {
    window.addEventListener('load', () => {
      this.space = this.tapeNode.scrollWidth - this.mainNode.offsetWidth;
  
      if (this.space <= 0) {
        return;
      }
  
      this.direction = 'left';
      this.time = 15 * this.space;
      this.tapeNode.style.transform = `translateX(0px)`;
      this.tapeNode.style.transition = `transform ${this.time}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
      this.tapeNode.style.transform = `translateX(-${this.space}px)`;
  
      setInterval(() => {
        if (this.direction === 'right') {
          this.tapeNode.style.transform = `translateX(-${this.space}px)`;
          this.direction = 'left';
        } else {
          this.tapeNode.style.transform = `translateX(0px)`;
          this.direction = 'right';
        }
      }, this.time);
    })
  }
  
  mouseDownVisibleArea = (e) => {
    e.preventDefault()
    console.log('mouseDown');
  }
  
  touchVisibleArea = (e) => {
    const visibleAreaNode = e.currentTarget;
    const startX = e.changedTouches[0].clientX;
    const switchScreen = this.switchScreen;
    const activeScreen = this.activeScreen;
    
    if (this.isVertical) {
      return;
    }
    
    e.currentTarget.addEventListener('touchend', touchend)
  
    function touchend(e) {
      visibleAreaNode.removeEventListener('touchend', touchend)
      
      if (visibleAreaNode === e.currentTarget) {
        const endX = e.changedTouches[0].clientX;
        const resultX = startX - endX;
  
        if (resultX > 50) {
          switchScreen(activeScreen + 1)
        } else if (resultX < -50) {
          switchScreen(activeScreen - 1)
        }
      }
    }
  }
  
  /*moveTape = (click) => {
    const targetClick = click.pageX;
    
    let translateX = 0;
    let moveX = 0;
    
    document.onmousemove = (e) => {
      moveX = e.pageX;
      translateX = moveX - targetClick + this.positionSliders;
      this.tape.style.transform = `translate(${translateX}px, 0)`;
      this.tape.classList.add('moving');
    }
    
    this.tape.onmouseup = () => {
      document.onmousemove = null;
      this.tape.onmouseup = null;
      this.tape.mouseout = null;
      this.tape.classList.remove('moving');
      
      if (moveX === 0) {
        this.tape.style.transform = `translate(${this.positionSliders}px, 0)`;
        return;
      }
      
      if (targetClick - moveX > 29) {
        this.trackSwitch(this.slideActive + 1);
        return;
      }
      
      if (targetClick - moveX < -29) {
        this.trackSwitch(this.slideActive - 1);
        return;
      }
      
      this.tape.style.transform = `translate(${this.positionSliders}px, 0)`;
    }
    
    this.tape.onmouseout = () => {
      document.onmousemove = null;
      this.tape.onmouseup = null;
      this.tape.mouseout = null;
      this.tape.classList.remove('moving');
      
      if (targetClick - moveX > 29) {
        this.trackSwitch(this.slideActive + 1);
        return;
      }
      
      if (targetClick - moveX < -29) {
        this.trackSwitch(this.slideActive - 1);
        return;
      }
      
      this.tape.style.transform = `translate(${this.positionSliders}px, 0)`;
    }
  }*/
}