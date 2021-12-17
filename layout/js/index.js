import Config from "./config";

import Slider from "./Slider";
import Tabs from "./Tabs";
import Modal from "./Modal";
import PopupController from "./PopupController";

import './../styles/index.sass';

const homeSliderNode = document.querySelector('.js-homeSlider');
const homeCatalogTabsNode = document.querySelector('.js-homeCatalogTabs');
const genresSliderNode = document.querySelector('.js-genresSlider');
const gameGallerySliderNode = document.querySelector('.js-gameGallerySlider');
const gameInfoTabsNode = document.querySelector('.js-gameInfoTabs');
const youtubePlayNodes = document.querySelectorAll('.js-playYouTubeVideo');
const catalogNode = document.querySelector('.js-catalog');
const loginFormNode = document.querySelector('.js-loginForm');
const submitLoginNode = document.querySelector('.js-submitLoginForm');
const btnSwitchAuthNode = document.querySelector('.js-btnSwitchAuth');
const btnSwitchRegNode = document.querySelector('.js-btnSwitchReg');
const inputLabelInFieldNodes = document.querySelectorAll('.js-inputLabelInField');

new PopupController([
  {
    btnSelector: '.js-openLogin',
    popupSelector: '.js-login',
    states: [
      {
        btnSelector: '.js-btnBackLogin',
        blockSelector: '.js-loginFormContainer',
        isDefault: true,
      },
      {
        btnSelector: '.js-btnRestore',
        blockSelector: '.js-restoreFomContainer',
      },
    ],
  }
]);

if (homeSliderNode) {
  let playVideoTimeOutId;
  
  const homeSlider = new Slider({
    mainNode: homeSliderNode,
    onSwitch: switchHomeSlider,
    progress: true,
    navigate: true,
    switchingTime: 3000,
  });
  
  function switchHomeSlider(slides, prevSlides = []) {
    clearTimeout(playVideoTimeOutId);
    const slideNode = slides[0];
    const prevSlideNode = prevSlides[0];
    const videoName = slideNode.dataset.videoName;
    const videoNode = slideNode.querySelector('.video');
    let canplaythrough = true;
    
    if (slideNode === prevSlideNode) {
      return;
    }
    
    const onCanplaythrough = () => {
      if (!canplaythrough) {
        return;
      }
      
      playVideoTimeOutId = setTimeout(() => {
        slideNode.classList.add('activeVideo');
        homeSlider.changeTimeoutOnce(videoNode.duration * 1000);
        videoNode.play();
      }, 2000);
      
      canplaythrough = false;
    }
    
    if (prevSlideNode) {
      const prevSlideVideoNode = prevSlideNode.querySelector('.video');
      
      prevSlideNode.classList.remove('activeVideo');
      prevSlideVideoNode.removeAttribute('src');
      prevSlideVideoNode.removeEventListener('canplaythrough', onCanplaythrough);
    }
    
    videoNode.addEventListener('canplaythrough', onCanplaythrough);
    videoNode.setAttribute('src',`${Config.websiteAddress}${videoName}`);
  }
}

if (homeCatalogTabsNode) {
  new Tabs({
    mainNode: homeCatalogTabsNode,
  });
}

if (genresSliderNode) {
  new Slider({
    mainNode: genresSliderNode,
    progress: true,
    isTrack: true,
    isVertical: true,
    countSlidesScroll: 2,
    switchingTime: 1000000,
  });
}

if (gameGallerySliderNode) {
  new Slider({
    mainNode: gameGallerySliderNode,
    isTrack: true,
    countSlidesScroll: 2,
    switchingTime: 1000000,
  });
}

if (gameInfoTabsNode) {
  new Tabs({
    mainNode: gameInfoTabsNode,
  });
}

if (youtubePlayNodes.length) {
  youtubePlayNodes.forEach(item => {
    item.addEventListener('click', () => {
      const videoId = item.dataset.link;
      const iframe = document.createElement('iframe');
      
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`);
      iframe.setAttribute('frameBorder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowFullScreen', '');

      new Modal(iframe);
    })
  })
}

if (catalogNode) {
  const filterNode = catalogNode.querySelector('.js-filter');
  const sortNode = catalogNode.querySelector('.js-sort');
  const loadMoreNode = catalogNode.querySelector('.js-loadMore');
  const params = [];
  
  const checkbox = [
    ...filterNode.querySelectorAll('.js-checkbox'),
    ...sortNode.querySelectorAll('.js-checkbox'),
  ];
  
  checkbox.forEach(item => {
    item.querySelector('.input').addEventListener('click', (e) => {
      const url = new URL(window.location.href);
      const input = e.currentTarget;
    
      if (input.checked) {
        url.searchParams.append(input.name, input.value);
        
        params.push({
          name: input.name,
          value: input.value,
        })
      } else {
        const entriesParams = [...url.searchParams.entries()];
        const paramIndex = params.findIndex(item => item.name === input.name && item.value === input.value);
      
        for(item of entriesParams) {
          url.searchParams.delete(item[0]);
        }
      
        for(item of entriesParams) {
          if (item[1] === input.value) {
            continue;
          }
        
          url.searchParams.append(item[0], item[1]);
        }
        
        if (paramIndex === -1) {
          return;
        }
        
        params.splice(paramIndex, 1);
      }
    
      history.pushState(null, null, url);
    });
  })
}

if (loginFormNode && btnSwitchAuthNode && btnSwitchRegNode && submitLoginNode) {
  btnSwitchAuthNode.addEventListener('click', () => {
    btnSwitchAuthNode.classList.add('active');
    btnSwitchRegNode.classList.remove('active');
    loginFormNode.classList.add('auth');
    loginFormNode.action = '/auth';
    submitLoginNode.innerText = 'Войти';
  });
  
  btnSwitchRegNode.addEventListener('click', () => {
    btnSwitchRegNode.classList.add('active');
    btnSwitchAuthNode.classList.remove('active');
    loginFormNode.classList.remove('auth');
    loginFormNode.action = '/reg';
    submitLoginNode.innerText = 'Далее';
  });
}

if (inputLabelInFieldNodes.length) {
  inputLabelInFieldNodes.forEach(item => {
    item.querySelector('input').addEventListener('blur', (e) => {
      e.target.value.length ? e.target.classList.add('active') : e.target.classList.remove('active');
    })
  })
}