import Slider from "./Slider.js";
import Tabs from "./Tabs.js";
import Modal from "./Modal.js";
import PopupController from "./PopupController.js";
import AsyncForm from "./AsyncForm.js";
import Prompt from "./Prompt.js";
import {urlEncodeFormData} from "./utils.js";
import Postman from "./Postman.js";
import {websiteAddress} from "../../config.js";

import './../styles/index.sass';

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
const productCards = document.querySelectorAll('.js-cardGame');
const cartNode = document.querySelector('.js-cart');
const collapseNodes = document.querySelectorAll('.js-collapse');
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

if (collapseNodes.length) {
  let activeCollapse = null;
  
  collapseNodes.forEach(collapse => {
    collapse.addEventListener('click', (e) => {
      activeCollapse && activeCollapse.classList.remove('active');
      
      if (activeCollapse === collapse) {
        return activeCollapse = null;
      }
  
      collapse.classList.add('active');
      activeCollapse = collapse;
    })
  })
}

if (cartNode) {
  const products = cartNode.querySelectorAll('.js-product');
  const checkNode = cartNode.querySelector('.js-check');
  const totalPriceToNode = checkNode.querySelector('.js-totalTo');
  const totalPriceFromNode = checkNode.querySelector('.js-totalFrom');
  const totalProductsNode = checkNode.querySelector('.js-totalProducts');
  const payBtnNode = checkNode.querySelector('.js-payBtn');
  const savingNode = checkNode.querySelector('.js-saving');
  let countProducts = products.length;
  let totalPriceToValue = +totalPriceToNode.innerText;
  let totalPriceFromValue = +totalPriceFromNode.innerText;
  let savingValueNode = null;
  let savingValue = null;
  
  if (savingNode) {
    savingValueNode = checkNode.querySelector('.js-savingValue');
    savingValue = +savingValueNode.innerText;
  }
  
  if (payBtnNode) {
    payBtnNode.addEventListener('click', async () => {
      const response = await postman.post('/api/order');
      const result = await response.json();
      
      if (result.error) {
        return;
      }
      
      const payFormNode = cartNode.querySelector('.js-payForm');
      payFormNode.submit();
    })
  }
  
  if (countProducts) {
    products.forEach(productNode => {
      const deleteFromCartBtn = productNode.querySelector('.js-deleteFromCart');
      const dsCartId = document.querySelector('body').dataset.dsCartId;
      const productId = productNode.dataset.productId;
      const dsId = productNode.dataset.dsId;
    
      deleteFromCartBtn.addEventListener('click', async () => {
        if (!dsCartId || !dsId || !productId) {
          return;
        }
        
        let formData = new FormData();
        
        formData.append('cart_uid', dsCartId);
        formData.append('cart_curr', 'RUR');
        formData.append('lang', 'ru-RU');
  
        const responseCartDS = await fetch('https://shop.digiseller.ru/xml/shop_cart_lst.asp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: urlEncodeFormData(formData),
        });
  
        const resultCartDS = await responseCartDS.json();
  
        if (!resultCartDS.products) {
          return;
        }
        
        const {item_id} = resultCartDS.products.find(item => item.id === dsId);
  
        formData.append('item_id', item_id);
        formData.append('product_cnt', '0');
  
        let responseUpdateCartDS = await fetch('https://shop.digiseller.ru/xml/shop_cart_lst.asp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: urlEncodeFormData(formData),
        });
  
        let resultUpdateCartDS = await responseUpdateCartDS.json();
  
        if (resultUpdateCartDS.cart_err !== '0' && resultUpdateCartDS.cart_err !== '5') {
          return;
        }
        
        const response = await postman.delete(`/api/products/${productId}/cart`);
        const result = await response.json();
      
        if (result.error) {
          return;
        }
  
        countProducts -= 1;
        
        if (countProducts === 0)   {
          return cartNode.innerHTML = '<p style="color: #fff">Вы еще не добавили ни одного товара в корзину покупок</p>';
        }
  
        const priceTo = +productNode.querySelector('.js-priceTo').innerText;
        const priceFrom = +productNode.querySelector('.js-priceFrom').innerText;
  
        totalPriceToValue -= priceTo;
        totalPriceFromValue -= priceFrom;
  
        totalPriceToNode.innerText = totalPriceToValue;
        totalPriceFromNode.innerText = totalPriceFromValue;
        totalProductsNode.innerText = countProducts;
        
        if (savingValue) {
          savingValue -= priceFrom - priceTo;
          
          if (!savingValue) {
            savingNode.remove();
          }
        }
        
        productNode.remove();
      })
    })
  }
}

if (productCards.length) {
  productCards.forEach(productNode => {
    const addToCartBtnNode = productNode.querySelector('.js-addToCart');
    const favoritesBtnNode = productNode.querySelector('.js-favoritesBtn');
    const productId = productNode.dataset.id;
    const dsId = productNode.dataset.dsId;
    let iconFavoritesBtnNode;
    
    if (favoritesBtnNode) {
      iconFavoritesBtnNode = favoritesBtnNode.querySelector('.js-icon');
    }
  
    productNode.addEventListener('click', (e) => {
      if (e.target === iconFavoritesBtnNode || e.target === favoritesBtnNode || e.target === addToCartBtnNode) {
        e.preventDefault();
      }
    })
    
    if (!addToCartBtnNode) {
      return;
    }
    
    if (favoritesBtnNode) {
      favoritesBtnNode.addEventListener('click', async () => {
        if (favoritesBtnNode.classList.contains('js-active')) {
          const response = await postman.delete(`/api/products/${productId}/favorites`);
          const result = await response.json();
      
          if (result.error) {
            return;
          }
      
          favoritesBtnNode.setAttribute('title', 'Добавить игру в избранное');
          favoritesBtnNode.classList.remove('js-active');
          iconFavoritesBtnNode.classList.remove('active');
          return;
        }
    
        const response = await postman.post(`/api/products/${productId}/favorites`);
        const result = await response.json();
    
        if (result.error) {
          return;
        }
    
        favoritesBtnNode.setAttribute('title', 'Удалить игру из избранного');
        favoritesBtnNode.classList.add('js-active');
        iconFavoritesBtnNode.classList.add('active');
      })
    }
  
    addToCartBtnNode.addEventListener('click', async () => {
      if (addToCartBtnNode.classList.contains('js-active')) {
        window.location.href = '/cart';
        return;
      }
  
      const dsCartId = document.querySelector('body').dataset.dsCartId;
      const formData = new FormData();
  
      formData.append('product_id', dsId);
      formData.append('product_cnt', '1');
      formData.append('typecurr', 'wmr');
      formData.append('lang', 'ru-RU');
      
      if (dsCartId) {
        formData.append('cart_uid', dsCartId);
      }
  
      const responseAddCartDS = await fetch('https://shop.digiseller.ru/xml/shop_cart_add.asp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodeFormData(formData),
      });
  
      const resultAddCartDS = await responseAddCartDS.json();
  
      if (resultAddCartDS.cart_err_num !== '0') {
        return;
      }
  
      const response = await postman.post(`/api/products/${productId}/cart`, {dsCartId: resultAddCartDS.cart_uid});
      const result = await response.json();
  
      if (result.error) {
        return;
      }
  
      if (!dsCartId) {
        document.querySelector('body').dataset.dsCartId = resultAddCartDS.cart_uid;
      }
      
      addToCartBtnNode.innerText = 'В корзине ✔';
      addToCartBtnNode.classList.add('js-active', 'active');
      addToCartBtnNode.setAttribute('title', 'Перейти в корзину покупок');
    })
  })
}

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