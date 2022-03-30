import Slider from "./Slider";
import Tabs from "./Tabs";
import Modal from "./Modal";
import PopupController from "./PopupController";
import AsyncForm from "./AsyncForm";
import Prompt from "./Prompt";

import Config from "./config";

import './../styles/index.sass';
import Postman from "./Postman";
import {websiteAddress} from "../../config";

const postman = new Postman();

const homeSliderNode = document.querySelector('.js-homeSlider');
const homeCatalogTabsNode = document.querySelector('.js-homeCatalogTabs');
const genresSliderNode = document.querySelector('.js-genresSlider');
const gameGallerySliderNode = document.querySelector('.js-gameGallerySlider');
const gameInfoTabsNode = document.querySelector('.js-gameInfoTabs');
const youtubePlayNodes = document.querySelectorAll('.js-playYouTubeVideo');
const catalogNode = document.querySelector('.js-catalog');
const loginFormNode = document.querySelector('.js-loginForm');
const profileEditFormNode = document.querySelector('.js-profileEditForm');
const submitLoginNode = document.querySelector('.js-submitLoginForm');
const btnSwitchAuthNode = document.querySelector('.js-btnSwitchAuth');
const btnSwitchRegNode = document.querySelector('.js-btnSwitchReg');
const inputLabelInFieldNodes = document.querySelectorAll('.js-inputLabelInField');
const promptNodes = document.querySelectorAll('.js-prompt');
const scrollerNode = document.querySelector('.js-scroller');
const likeArticleNode = document.querySelector('.js-likeArticle');
const copyBtnNode = document.querySelector('.js-copyBtn');
const searchStringNode = document.querySelector('.js-searchString');
const popupController = new PopupController([
  {
    id: 'loginFrom',
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
  },
  {
    id: 'navigate',
    btnSelector: '.js-toggleMainNavigation',
    popupSelector: '.js-mainNavigation',
  }
]);

searchStringNode.addEventListener('input', async () => {
  popupController.activateById('navigate');
  
  const response = await postman.get(`${websiteAddress}api/products`, {searchString: searchStringNode.value});
  const result = await response.json();
  const menuNode = document.querySelector('.js-menu');
  const searchResultNode = document.querySelector('.js-searchResult');
  
  if (result.error) {
    return;
  }
  
  menuNode.classList.add('activeSearchResult');
  
  if (result.products?.length === 0) {
    return searchResultNode.innerHTML = '<p style="color: #fff">Ни чего не найдено</p>';
  }
  
  searchResultNode.innerHTML = '';
  
  result.products.forEach(product => {
    searchResultNode.innerHTML += `
      <a href="/games/${product.alias}" class="cardGame" title="Перейти к странице игры">
        <div class="actions">
            <button class="btn like" title="Добавить игру в избранное">
                <span class="icon-static icon-static-actionLike"></span>
            </button>
            <button
                class="btn border rounded uppercase bg-darkPink hover-bg-pink inCart small"
                title="Добавить данный товар в корзину покупок"
            >
                В корзину
            </button>
        </div>
        <div class="head">
            <img class="img" src="${websiteAddress}${product.img}" alt="Картинка ${product.name}" title="${product.name}">
            <div class="name">
                ${product.name}
            </div>
        </div>
        <div class="price">
            <div class="toPrice">
                <span class="value">
                    ${product.priceTo}
                </span>
            </div>
            <div class="fromPrice">
                <span class="value">
                    ${product.priceFrom}
                </span>
            </div>
        </div>
      </a>
    `;
  });
})

if (copyBtnNode) {
  copyBtnNode.addEventListener('click', () => {
    const copyTextNode = document.querySelector('.js-copyText');
    const copyNodeContentsToClipboard = (el) => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(el);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      selection.removeAllRanges();
    }
    const copyToClipboard = (el) => {
      const oldContentEditable = el.contentEditable;
      const oldReadOnly = el.readOnly;
      try {
        el.contentEditable = 'true'; //  специально для iOS
        el.readOnly = false;
        copyNodeContentsToClipboard(el);
      } finally {
        el.contentEditable = oldContentEditable;
        el.readOnly = oldReadOnly;
      }
    }
    
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(copyTextNode.innerText);
      } else if (window.clipboardData) {
        window.clipboardData.setData('text', copyTextNode.innerText); // для Internet Explorer
      } else {
        copyToClipboard(copyTextNode); // для других браузеров, iOS, Mac OS
      }
      //Вывод инфы об успешном копировании
    } catch (e) {
      //Вывод инфы о неудавшемся копировании
    }
  })
}

if (scrollerNode) {
  scrollerNode.addEventListener('click', () => {
    const targetSelector = `.js-${scrollerNode.dataset.target}`;
    const topOffset = document.querySelector('.js-header').offsetHeight;
    const targetPosition = document.querySelector(targetSelector).getBoundingClientRect().top;
    const offsetPosition = targetPosition - topOffset;
    
    window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
}

if (likeArticleNode) {
  likeArticleNode.addEventListener('click', async () => {
    const countLikesNode = document.querySelector('.js-countLikes');
    const articleId = likeArticleNode.dataset.target;
    const response = await postman.post('/api/articles/like', {articleId});
    const result = await response.json();
    
    if (!result.error) {
      countLikesNode.innerText = result.countLikes;
    }
  })
}

/*if (homeSliderNode) {
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
}*/

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

if (loginFormNode) {
  new AsyncForm({
    mainNode: loginFormNode,
    successHandler: () => {
      setTimeout(() => {
        window.location.reload();
      }, 1500)
    },
  });
}

if (profileEditFormNode) {
  new AsyncForm({
    mainNode: profileEditFormNode,
  })
}

if (promptNodes.length) {
  promptNodes.forEach(item => new Prompt({mainNode: item}));
}