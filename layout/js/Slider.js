export default class Slider {
  constructor(options) {
    const {
      mainNode,
      switchingTime,
      isTrack,
      isVertical,
      progress,
      navigate,
      countSlidesScroll = 1,
      onSwitch,
    } = options;
  
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
  
    this.mainNode = mainNode;
    this.prevBtnNode = this.mainNode.querySelector('.js-prevBtn');
    this.nextBtnNode = this.mainNode.querySelector('.js-nextBtn');
    this.tapeNode = this.mainNode.querySelector('.js-tape');
    this.slideNodes = this.mainNode.querySelectorAll('.js-slide');
    
    this.countSlides = this.slideNodes.length;
    this.countScreens = this.countSlides;
    
    if (this.isTrack) {
      this.visibleAreaNode = this.mainNode.querySelector('.js-visibleArea');
      
      this.shareSlide = this.slideNodes[0].offsetWidth;
      this.shareVisibleArea = this.visibleAreaNode.offsetWidth;
      this.positionTape = 0;
      
      if (this.isVertical) {
        this.shareSlide = this.slideNodes[0].offsetHeight;
        this.shareVisibleArea = this.visibleAreaNode.offsetHeight;
      }
      
      this.countVisibleSlides = this.shareVisibleArea / this.shareSlide;
      
      if (this.countSlidesScroll > this.countVisibleSlides) {
        this.countSlidesScroll = this.countVisibleSlides;
      }
      
      this.countScreens = Math.ceil((this.countSlides - (this.countVisibleSlides - this.countSlidesScroll)) / this.countSlidesScroll);
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
    let current = screen * this.countVisibleSlides;
    let end = screen * this.countVisibleSlides + this.countVisibleSlides;
    const members = [];
    
    if (this.isTrack && end > this.countSlides) {
      current -= end - this.countSlides;
      end = this.countSlides;
    }
  
    if (this.navigate) {
      this.navigateItemNodes[screen].classList[action]('active');
      this.navigateItemNodes[screen].blur();
    }
    
    while (current < end) {
      const slide = this.slideNodes[current];
      
      members.push(slide);
      slide.classList[action]('active');
      current++;
    }
    
    return members;
  }
  
  moveTape = (prevScreen) => {
    if (this.activeScreen > prevScreen) {
      if (this.activeScreen + 1 === this.countScreens) {
        this.positionTape = ((this.countSlides - this.countVisibleSlides) * this.shareSlide) * -1;
      } else {
        this.positionTape -= this.countVisibleSlides * this.shareSlide;
      }
    } else {
      if (this.activeScreen === 0) {
        this.positionTape = 0;
      } else {
        this.positionTape += this.countVisibleSlides * this.shareSlide;
      }
    }
    
    this.tapeNode.style.transform = `translateY(${this.positionTape}px)`;
  }
  
  changeTimeoutOnce = (time) => {
    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(() => {
      this.switchScreen(this.activeScreen + 1);
    }, time);
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