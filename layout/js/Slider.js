export default class Slider {
  constructor(options) {
    const {
      sliderSelector,
      timeOutValue = 10000,
      type = 'track',
      countVisibleSlides = 1,
      slideScroll = 1,
      progress = false,
      navigate = false,
    } = options;
    
    this.type = type;
    this.countVisibleSlides = countVisibleSlides;
    this.slideScroll = slideScroll;
    this.timeOutValue = timeOutValue;
    this.progress = progress;
    this.navigate = navigate;
  
    this.node = document.querySelector(sliderSelector);
    if (!this.node) {
      return console.error(`Не удалось найти контейнер слайдера с селектором: ${sliderSelector}`);
    }
    this.slidesNodes = this.node.querySelectorAll('.js-slide');
    this.prevBtnNode = this.node.querySelector('.js-prevSlide');
    this.nextBtnNode = this.node.querySelector('.js-nextSlide');
    this.visibleAreaNode = this.node.querySelector('.js-visibleAreaSlider');
    this.tapeNode = this.node.querySelector('.js-tapeSlider');
  
    this.countSlides = this.slidesNodes.length;
    const countScreens = (this.countSlides - (this.countVisibleSlides - this.slideScroll)) / this.slideScroll;
    this.countScreens = Math.ceil((this.countSlides - (this.countVisibleSlides - this.slideScroll)) / this.slideScroll);
    this.ceilScreens = Number.isInteger(countScreens);
    this.shareProgress = 100 / this.countScreens;
    this.slideActive = 0;
    this.screenActive = 1;
  
    if (sliderSelector.length < 1) {
      return console.error('Не указан селектор слайдера');
    }
  
    if (!this.node) {
      return console.error(`Не удалось найти контейнер слайдера с селектором: ${sliderSelector}`);
    }
  
    if (!this.prevBtnNode) {
      return console.error('Не удалось найти элемент кнопки переключения предыдущего слайда, который должен иметь селектор .js-prevSlide');
    }
  
    if (!this.nextBtnNode) {
      return console.error('Не удалось найти элемент кнопки переключения следующего слайда, который должен иметь селектор .js-nextSlide');
    }
  
    if (!this.visibleAreaNode) {
      console.warn('Не удалось найти элемент видимой области слайдера, который должен иметь селектор .js-visibleAreaSlider');
    }
  
    if (!this.tapeNode) {
      console.warn('Не удалось найти элемент видимой области слайдера, который должен иметь селектор .js-tapeSlider');
    }
  
    if (this.navigate) {
      this.navNodes = this.node.querySelectorAll('.js-itemNavSlider');
    
      if (this.navNodes.length !== this.countSlides) {
        console.warn(`
          Внимание! Количество слайдов и элементов навигации по слайдам не соответствует. Необходимо это исправить во
          избежание ошибок работы слайдера.
        `);
      } else {
        this.navigateInitial = true;
      }
    }

    if (this.progress) {
      this.progressNode = this.node.querySelector('.js-progressSlider');
      
      if (!this.progressNode) {
        console.warn('Не удалось найти прогресс-бар слайдера, который должен иметь селектор .js-progressSlider');
      } else {
        this.progressInitial = true;
      }
    }
  
    this.nextBtnNode.addEventListener('click', () => this.handleSwitch(this.screenActive + 1));
    this.prevBtnNode.addEventListener('click', () => this.handleSwitch(this.screenActive - 1));
  
    switch (this.type) {
      case 'switchClass': {
        this.countVisibleSlides = 1;
        this.slideScroll = 1;
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
    }
    
    if (this.progressInitial) {
      this.progressNode.style.setProperty('--share', `${this.shareProgress}%`);
      this.progressNode.style.setProperty('--progress', `0%`);
    }
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
  
  verticalTrackSwitch = (targetScreen, generalActions) => {if (targetScreen > this.screenActive) {
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