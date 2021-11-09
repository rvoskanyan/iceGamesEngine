export default class Slider {
  constructor(options) {
    const {
      selector,
      switchingTime,
      isTrack,
      vertical,
      progress,
      navigate,
      countSlidesScroll = 1,
      onSwitch,
    } = options;
  
    this.switchingTime = switchingTime;
    this.isTrack = isTrack;
    this.vertical = vertical;
    this.progress = progress;
    this.navigate = navigate;
    this.countSlidesScroll = countSlidesScroll;
    this.onSwitch = onSwitch;
    this.activeScreen = 1;
    this.countVisibleSlides = 1;
  
    this.mainNode = document.querySelector(selector);
    this.prevBtnNode = this.mainNode.querySelector('.js-prevBtn');
    this.nextBtnNode = this.mainNode.querySelector('.js-nextBtn');
    this.tapeNode = this.mainNode.querySelector('.js-tape');
    this.slideNodes = this.mainNode.querySelectorAll('.js-slide');
    
    this.countSlides = this.slideNodes.length;
    this.countScreens = this.countSlides;
    
    if (this.isTrack) {
      this.countVisibleSlides = 1;
      this.countScreens = Math.ceil((this.countSlides - (this.countVisibleSlides - this.countSlidesScroll)) / this.countSlidesScroll);
      this.visibleAreaNode = this.mainNode.querySelector('.js-visibleArea');
    }
  
    if (this.progress) {
      this.shareProgress = 100 / this.countScreens;
      this.progressNode = this.mainNode.querySelector('.js-progress');
      this.progressNode.style.setProperty('--share', `${this.shareProgress}%`);
      this.progressNode.style.setProperty('--progress', `0%`);
    }
  
    if (this.navigate) {
      this.navigateItemNodes = this.mainNode.querySelectorAll('.js-itemNavigate');
      
      this.navigateItemNodes.forEach((item, index) => {
        item.addEventListener('click', () => this.switchScreen(index + 1));
      })
    }
  
    if (this.onSwitch) {
      const slide = this.slideNodes[0];
      this.onSwitch([slide]);
    }
    
    this.prevBtnNode.addEventListener('click', () => this.switchScreen(this.activeScreen - 1));
    this.nextBtnNode.addEventListener('click', () => this.switchScreen(this.activeScreen + 1));
  
    //this.nextBtnNode.addEventListener('click', () => this.handleSwitch(this.screenActive + 1));
    //this.prevBtnNode.addEventListener('click', () => this.handleSwitch(this.screenActive - 1));
  
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
    
    if (targetScreen > this.countScreens) {
      this.activeScreen = 1;
    }
    
    if (targetScreen < 1) {
      this.activeScreen = this.countScreens;
    }
  
    this.setActiveClass(prevScreen, 'remove');
    const slides = this.setActiveClass(this.activeScreen, 'add');
  
    if (this.onSwitch) {
      this.onSwitch(slides);
    }
  }
  
  setActiveClass = (screen, action) => {
    let current = screen * this.countVisibleSlides;
    const end = screen * this.countVisibleSlides + this.countVisibleSlides;
    const members = [];
  
    if (this.navigate) {
      this.navigateItemNodes[screen - 1].classList[action]('active');
    }
    
    while (current < end) {
      const slide = this.slideNodes[current - 1];
      
      members.push(slide);
      slide.classList[action]('active');
      current++;
    }
    
    return members;
  }
  
  getSwitcher = (handler) => {
    const generalActions = (oldSlide, newSlide) => {
      if (this.navigateInitial) {
        this.navNodes[oldSlide].classList.remove('active');
        this.navNodes[newSlide].classList.add('active');
      }
  
      if (this.progressInitial) {
        this.progressNode.style.setProperty('--progress', `${this.shareProgress * newSlide}%`);
      }
    }
    
    if (this.timeOutValue > 500) {
      this.timeOut = setTimeout(() => handler(this.slideActive + this.slideScroll), this.timeOutValue);
      
      return (...args) => {
        handler(...args, generalActions);
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => handler(this.slideActive + this.slideScroll), this.timeOutValue);
      }
    }
    
    return (...args) => {
      handler(...args, generalActions);
    }
  }
  
  switchClass = (targetSlide, generalActions) => {
    const oldSlide = this.slideActive;
    
    this.slidesNodes[this.slideActive].classList.remove('active');
    
    this.slideActive = targetSlide;
    
    if (targetSlide >= this.countSlides) {
      this.slideActive = 0;
    }
    
    if (targetSlide < 0) {
      this.slideActive = this.countSlides - 1;
    }
    
    this.slidesNodes[this.slideActive].classList.add('active');
  
    generalActions(oldSlide, this.slideActive);
  }
  
  trackSwitch = (slide, generalActions) => {
    const oldSlide = this.slideActive;
    
    this.slideActive = slide;
    
    if (slide >= this.countSlides) {
      this.slideActive = 0;
    }
    
    if (slide < 0) {
      this.slideActive = this.slides.length - 1;
    }
    
    this.positionSliders = -this.slideActive * this.widthSlide
    
    this.tape.style.transform = `translateX(${this.positionSliders}px)`;
  
    generalActions(oldSlide, this.slideActive);
  }
  
  verticalTrackSwitch = (targetScreen, generalActions) => {
    if (targetScreen > this.screenActive) {
      if (targetScreen > this.countScreens) {
        this.positionTape = 0;
        this.screenActive = 1;
      } else {
        this.positionTape -= (targetScreen - this.screenActive) * this.slideScroll * this.heightSlide;
        this.screenActive = targetScreen;
      }
    } else {
      if (targetScreen < 1) {
        this.positionTape = (this.countSlides - this.countVisibleSlides) * -this.heightSlide;
        this.screenActive = this.countScreens;
      } else {
        this.positionTape += (this.screenActive - targetScreen) * this.slideScroll * this.heightSlide;
        this.screenActive = targetScreen;
      }
    }
    
    if (targetScreen === this.countScreens) {
      this.positionTape = (this.countSlides - this.countVisibleSlides) * -this.heightSlide;
      this.screenActive = this.countScreens;
    }
    
    if (targetScreen === 1) {
      this.positionTape = 0;
      this.screenActive = 1;
    }
  
    this.tapeNode.style.transform = `translateY(${this.positionTape}px)`;
  
    this.progressNode.style.setProperty('--progress', `${this.shareProgress * (this.screenActive - 1)}%`);
  }
  
  moveTape = (click) => {
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
  }
}