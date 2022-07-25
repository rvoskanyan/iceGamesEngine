import Slider from "./Slider.js";
import Tabs from "./Tabs.js";
import Modal from "./Modal.js";
import PopupController from "./PopupController.js";
import AsyncForm from "./AsyncForm.js";
import Prompt from "./Prompt.js";
import {urlEncodeFormData} from "./utils.js";
import Postman from "./Postman.js";
import {websiteAddress} from "./config.js";

import './../styles/index.sass';

const postman = new Postman();

const profileMenuNode = document.querySelector('.js-profileMenu');
const homeSliderNode = document.querySelector('.js-homeSlider');
const recProductSliderNode = document.querySelector('.js-recProductSlider');
const seriesSliderNode = document.querySelector('.js-seriesSlider');
const newsSliderNode = document.querySelector('.js-newsSlider');
const achievementViewProfileSliderNode = document.querySelector('.js-achievementViewProfileSlider');
const homeMediaSliderNode = document.querySelector('.js-homeMediaSlider');
const homeCatalogTabsNode = document.querySelector('.js-homeCatalogTabs');
const genresSliderNode = document.querySelector('.js-genresSlider');
const gameGallerySliderNode = document.querySelector('.js-gameGallerySlider');
const gameInfoTabsNode = document.querySelector('.js-gameInfoTabs');
const feedbackProductTabsNode = document.querySelector('.js-feedbackProductTabs');
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
const mobileSearchStringNode = document.querySelector('.js-mobileSearchString');
const cartNode = document.querySelector('.js-cart');
const collapseNodes = document.querySelectorAll('.js-collapse');
const autoSizeInputNodes = document.querySelectorAll('.js-autoSizeInput');
const largeImgNodes = document.querySelectorAll('.js-largeImg');
const addReviewFormNode = document.querySelector('.js-addReviewForm');
const commentProductFormNode = document.querySelector('.js-commentProductForm');
const gamePageNode = document.querySelector('.js-gamePage');
const rangeNode = document.querySelector('.js-range');
const modalMessageNode = document.querySelector('.js-modalMessage');
const acceptAgreementNode = document.querySelector('.js-acceptAgreement');
const blogPageNode = document.querySelector('.js-blogPage');
const popupController = new PopupController([
  {
    id: 'loginFrom',
    btnSelector: '.js-openLogin',
    closeBtnSelector: '.js-closeLoginForms',
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
  },
  {
    id: 'mobileNavigate',
    btnSelector: '.js-openMobileMenu',
    popupSelector: '.js-navigateMobileContainer',
  },
  {
    id: 'mobileQuickSearch',
    btnSelector: '.js-openMobileQuickSearch',
    popupSelector: '.js-mobileQuickSearchContainer',
  },
  {
    id: 'mobileProfileMenu',
    btnSelector: '.js-mobileOpenProfileMenu',
    popupSelector: '.js-mobileProfileMenu',
  },
  {
    id: 'paramsCatalog',
    btnSelector: '.js-openParams',
    closeBtnSelector: '.js-closeParams',
    popupSelector: '.js-filterMobile',
    children: [
      {
        id: 'priceParamsCatalog',
        btnSelector: '.js-openPriceParams',
        closeBtnSelector: '.js-closePriceParams',
        popupSelector: '.js-priceParams',
      },
      {
        id: 'sortParamsCatalog',
        btnSelector: '.js-openSortParams',
        closeBtnSelector: '.js-closeSortParams',
        popupSelector: '.js-sortParams',
      },
      {
        id: 'categoriesParamsCatalog',
        btnSelector: '.js-openCategoriesParams',
        closeBtnSelector: '.js-closeCategoriesParams',
        popupSelector: '.js-categoriesParams',
      },
      {
        id: 'categoriesParamsCatalog',
        btnSelector: '.js-openCategoriesParams',
        closeBtnSelector: '.js-closeCategoriesParams',
        popupSelector: '.js-categoriesParams',
      },
      {
        id: 'genresParamsCatalog',
        btnSelector: '.js-openGenresParams',
        closeBtnSelector: '.js-closeGenresParams',
        popupSelector: '.js-genresParams',
      },
      {
        id: 'activationParamsCatalog',
        btnSelector: '.js-openActivationParams',
        closeBtnSelector: '.js-closeActivationParams',
        popupSelector: '.js-activationParams',
      },
    ],
  },
]);

if (largeImgNodes.length) {
  largeImgNodes.forEach(item => {
    item.addEventListener('click', () => {
      const targetImgNode = item.querySelector('.js-targetImg');
      const newTargetImgNode = targetImgNode.cloneNode(true);
      
      newTargetImgNode.classList.add('enlargedImg');
      new Modal(newTargetImgNode);
    })
  })
}

if (acceptAgreementNode) {
  const btnSendNode = acceptAgreementNode.querySelector('.js-sendAcceptAgreement');
  
  btnSendNode.addEventListener('click', async () => {
    await postman.post(`${websiteAddress}api/external/acceptAgreement`);
    acceptAgreementNode.classList.remove('active');
  })
}

if (modalMessageNode) {
  setTimeout(() => {
    modalMessageNode.classList.add('active');
    setTimeout(() => modalMessageNode.classList.remove('active'), 5000);
  }, 300);
}

if (rangeNode) {
  const rangeWidth = parseFloat(getComputedStyle(rangeNode).width);
  const min = +rangeNode.dataset.min;
  const max = +rangeNode.dataset.max;
  const minSliderNode = rangeNode.querySelector('.js-minSlider');
  const maxSliderNode = rangeNode.querySelector('.js-maxSlider');
  
  const initialSliders = (e = null) => {
    let minSliderValue = +minSliderNode.dataset.default;
    let maxSliderValue = +maxSliderNode.dataset.default;
    
    if (minSliderValue > maxSliderValue) {
      const saveMin = minSliderValue;
      
      minSliderValue = maxSliderValue;
      maxSliderValue = saveMin;
  
      minSliderNode.style.zIndex = '0';
      maxSliderNode.style.zIndex = '1';
      activeSlide = maxSliderNode;
    }
    
    if (minSliderValue < min) {
      minSliderValue = min;
    }
    
    if (maxSliderValue > max) {
      maxSliderValue = max;
    }
  
    minSliderNode.style.left = `${(minSliderValue - min) / step}px`;
    maxSliderNode.style.left = `${(maxSliderValue - min) / step}px`;
    minSliderNode.innerText = minSliderValue;
    maxSliderNode.innerText = maxSliderValue;
    minSliderNode.dataset.default = minSliderValue;
    maxSliderNode.dataset.default = maxSliderValue;
    
    if (e && e.target === minSliderNode) {
      return minSliderNode.dispatchEvent(new Event('initialSlider'));
    }
  
    if (e && e.target === maxSliderNode) {
      return maxSliderNode.dispatchEvent(new Event('initialSlider'));
    }
  
    minSliderNode.dispatchEvent(new Event('initialSlider'));
    maxSliderNode.dispatchEvent(new Event('initialSlider'));
  }
  
  let maxSliderValue = +maxSliderNode.dataset.default;
  let activeSlide = null;
  
  maxSliderNode.innerText = max;
  
  const maxSliderMaxValueWidth = parseFloat(getComputedStyle(maxSliderNode).width);
  const step = (max - min) / (rangeWidth - maxSliderMaxValueWidth);
  
  maxSliderNode.innerText = maxSliderValue;
  
  initialSliders();
  
  maxSliderNode.addEventListener('mousedown', listenerMousedownSlider);
  minSliderNode.addEventListener('mousedown', listenerMousedownSlider);
  maxSliderNode.addEventListener('touchstart', listenerMousedownSlider);
  minSliderNode.addEventListener('touchstart', listenerMousedownSlider);
  
  maxSliderNode.addEventListener('startInitial', initialSliders);
  minSliderNode.addEventListener('startInitial', initialSliders);
  
  async function listenerMousedownSlider(e) {
    if (e.target === document.activeElement) {
      return;
    }
    
    e.preventDefault();
    let holder = false;
    
    await new Promise(resolve => {
      const timeout = setTimeout(() => {
        holder = true;
        e.target.removeEventListener('mouseup', listenerMouseup);
        e.target.removeEventListener('touchend', listenerMouseup);
        resolve();
      }, 150);
      
      e.target.addEventListener('mouseup', listenerMouseup);
      e.target.addEventListener('touchend', listenerMouseup);
  
      function listenerMouseup () {
        clearTimeout(timeout);
        const range = document.createRange();
        const sel = window.getSelection();
        const sliderNode = e.target;
        const inputSlider = (e) => {
          if (e.key === 'Enter') {
            e.returnValue = false;
            return sliderNode.blur();
          }
          
          const value = parseInt(sliderNode.innerText) || 0;
          const num = parseInt(e.key);
      
          if ((num !== 0 && !num) || !(value <= max)) {
            e.returnValue = false;
        
            if (e.preventDefault) {
              e.preventDefault();
            }
          }
      
          if (sliderNode.innerText[0] === '0') {
            sliderNode.innerText = sliderNode.innerText.replace(/^0+/, '');
          }
        }
        const blurSlider = () => {
          sliderNode.dataset.default = sliderNode.innerText;
          initialSliders(e);
          e.target.removeEventListener('mouseup', listenerMouseup);
          e.target.removeEventListener('touchend', listenerMouseup);
          e.target.removeEventListener('blur', blurSlider);
          sliderNode.removeAttribute('contenteditable');
        }
    
        sliderNode.setAttribute('contenteditable', '');
        range.selectNodeContents(sliderNode);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        sliderNode.addEventListener('keypress', inputSlider);
        sliderNode.addEventListener('blur', blurSlider);
        resolve();
      }
    });
    
    if (!holder) {
      return;
    }
  
    const cursorStartPosition = e.pageX || e.changedTouches[0].clientX;
    const sliderStartPosition = parseInt(getComputedStyle(e.target).left);
    const sliderNode = e.target;
    const listenerMousemove = (e) => {
      moveSlider(e, sliderNode, cursorStartPosition, sliderStartPosition);
    }
    const listenerMouseup = () => {
      document.removeEventListener('mousemove', listenerMousemove);
      document.removeEventListener('touchmove', listenerMousemove);
      document.removeEventListener('mouseup', listenerMouseup);
      document.removeEventListener('touchend', listenerMouseup);
      sliderNode.dispatchEvent(new Event('blur'));
      initialSliders(e);
      sliderNode.style.cursor = 'initial';
    }
  
    sliderNode.style.cursor = 'pointer';
  
    document.addEventListener('mousemove', listenerMousemove);
    document.addEventListener('touchmove', listenerMousemove);
    document.addEventListener('mouseup', listenerMouseup);
    document.addEventListener('touchend', listenerMouseup);
  
    if (activeSlide) {
      activeSlide.style.zIndex = '0';
    }
  
    sliderNode.style.zIndex = '1';
    activeSlide = sliderNode;
  }
  
  function moveSlider(e, sliderNode, cursorStartPosition, currentPositionSlider) {
    let offset = 0;
    
    if (e.pageX) {
      offset = e.pageX - cursorStartPosition;
    } else {
      offset = e.changedTouches[0].clientX - cursorStartPosition
    }
    const sliderWidth = parseFloat(getComputedStyle(sliderNode).width);
    let position = offset + currentPositionSlider;
    let sliderValue = Math.round(position * step + min);
    
    if (position > rangeWidth - sliderWidth) {
      position = rangeWidth - sliderWidth;
      sliderValue = max;
    }
    
    if (position < 0) {
      position = 0;
      sliderValue = min;
    }
  
    sliderNode.style.left = `${position}px`;
    sliderNode.innerText = sliderValue;
    sliderNode.dataset.default = `${sliderValue}`;
  }
}

if (gamePageNode) {
  const addToCartBtnNode = gamePageNode.querySelector('.js-addToCartBtn');
  const subscribeInStockBtnNode = gamePageNode.querySelector('.js-subscribeInStock');
  
  if (subscribeInStockBtnNode) {
    const subscribeModalNode = gamePageNode.querySelector('.js-subscribeModal');
    const closeSubscribeModal = () => {
      document.querySelector('body').classList.remove('noScrolling');
      subscribeModalNode.classList.remove('active');
      subscribeModalNode.removeEventListener('click', handleCloseSubscribeModal);
    }
    const openSubscribeModal = () => {
      document.querySelector('body').classList.add('noScrolling');
      subscribeModalNode.classList.add('active');
      subscribeModalNode.addEventListener('click', handleCloseSubscribeModal);
    }
    const sendSubscribe = async (email = null) => {
      const productId = subscribeInStockBtnNode.dataset.productId;
      const params = email ? {email} : {};
      const response = await postman.post(`${websiteAddress}api/products/${productId}/subscribeInStock`, params);
    
      return await response.json();
    }
    const replaceSubscribeBtn = () => {
      const div = document.createElement('div');
      
      div.setAttribute('title', 'Когда товар появится в наличии, на Ваш E-mail придет уведомление.');
      div.className = 'btn elongated rounded bg-pink';
      div.innerText = 'Уведомление оформлено';
  
      subscribeInStockBtnNode.after(div);
      subscribeInStockBtnNode.remove();
    }
  
    if (subscribeModalNode) {
      const senderField = subscribeModalNode.querySelector('.js-senderField');
      const msgResultNode = subscribeModalNode.querySelector('.js-msgResult');
    
      if (senderField) {
        const submitBtnNode = senderField.querySelector('.js-submit');
        const valueNode = senderField.querySelector('.js-value');
      
        submitBtnNode.addEventListener('click', handleSendSubscribe);
        valueNode.addEventListener('keypress', async (e) => {
          if (e.key === 'Enter') {
            e.returnValue = false;
            await handleSendSubscribe();
          }
        });
      
        async function handleSendSubscribe() {
          const email = valueNode.innerText;
          const result = await sendSubscribe(email);
        
          if (result.error) {
            msgResultNode.classList.add('error');
            msgResultNode.innerText = result.msg;
          
            return;
          }
        
          closeSubscribeModal();
          replaceSubscribeBtn();
        }
      }
    }
  
    subscribeInStockBtnNode.addEventListener('click',  async () => {
      if (subscribeInStockBtnNode.classList.contains('js-notAuth')) {
        return openSubscribeModal();
      }
  
      const result = await sendSubscribe();
  
      if (!result.error) {
        replaceSubscribeBtn();
      }
    });
  
    function handleCloseSubscribeModal(e) {
      if (e.target === e.currentTarget) {
        closeSubscribeModal();
      }
    }
  }
  
  addToCartBtnNode && addToCartBtnNode.addEventListener('click', async () => {
    if (addToCartBtnNode.classList.contains('js-active')) {
      window.location.href = '/cart';
      return;
    }
    
    const productId = addToCartBtnNode.dataset.productId;
    const response = await postman.post(`/api/products/${productId}/cart`);
    const result = await response.json();
    
    if (result.error) {
      return;
    }
    
    addToCartBtnNode.innerText = 'Добавлено';
    addToCartBtnNode.classList.add('js-active');
    addToCartBtnNode.setAttribute('title', 'Перейти в корзину покупок');
  });
}

if (autoSizeInputNodes) {
  autoSizeInputNodes.forEach(autoSizeInput => {
    const valueNode = autoSizeInput.querySelector('.js-value');
    
    valueNode.addEventListener('input', () => {
      const isInputActive = autoSizeInput.classList.contains('active');
      const isAddActive = !!valueNode.innerText.length;
      
      if (isAddActive && isInputActive) {
        return;
      }
      
      if (isAddActive && !isInputActive) {
        return autoSizeInput.classList.add('active');
      }
  
      autoSizeInput.classList.remove('active');
    })
  })
}

if (commentProductFormNode) {
  const loadMoreCommentBtnNode = document.querySelector('.js-loadMoreCommentBtn');
  const listCommentsNode = document.querySelector('.js-listComments');
  const subjectId = commentProductFormNode.dataset.subjectId;
  const ref = commentProductFormNode.dataset.ref;
  let skip = +commentProductFormNode.dataset.skip;
  
  new AsyncForm({
    mainNode: commentProductFormNode,
    extraParams: ['subjectId', 'ref'],
    successHandler: (params) => {
      const userName = listCommentsNode.dataset.userName;
      const commentFieldNode = commentProductFormNode.querySelector('.js-autoSizeInput');
      const commentValueNode = commentFieldNode.querySelector('.js-value');
  
      commentValueNode.innerText = '';
      commentValueNode.dispatchEvent(new Event('input'));
      
  
      listCommentsNode.innerHTML = `
        <div class="item comment">
            <div class="head">
                <a class="btn link" href="/profile/view/${userName}" title="Перейти в профиль пользователя ${userName}">${userName}</a>
                <!--<div class="reactions">
                    <button class="btn active positive">
                        <span class="icon icon-thumbsUp"></span> 54
                    </button>
                    <button class="btn negative">
                        <span class="icon icon-thumbsDown"></span> 31
                    </button>
                </div>-->
            </div>
            <div class="text">
                ${params.text}
            </div>
            <!--<button class="btn link action">Ответить</button>-->
        </div>
      ` + listCommentsNode.innerHTML;
    }
  });
  
  if (loadMoreCommentBtnNode) {
    loadMoreCommentBtnNode.addEventListener('click', async () => {
      const response = await postman.get(`${websiteAddress}api/comments`, {
        subjectId,
        ref,
        skip,
      });
      const result = await response.json();
  
      skip += 3;
      
      if (result.items.length) {
        result.items.forEach(comment => {
          listCommentsNode.innerHTML = listCommentsNode.innerHTML + `
            <div class="item comment">
              <div class="head">
                  <a class="btn link" href="/profile/view/${comment.author.login}" title="Перейти в профиль пользователя ${comment.author.login}">${comment.author.login}</a>
                  <!--<div class="reactions">
                      <button class="btn active positive">
                          <span class="icon icon-thumbsUp"></span> 54
                      </button>
                      <button class="btn negative">
                          <span class="icon icon-thumbsDown"></span> 31
                      </button>
                  </div>-->
              </div>
              <div class="text">
                  ${comment.text}
              </div>
              <!--<button class="btn link action">Ответить</button>-->
          </div>
          `;
        })
      }
    })
  }
}

if (addReviewFormNode) {
  new AsyncForm({
    mainNode: addReviewFormNode,
    successHandler: (params) => {
      const listReviewsNode = document.querySelector('.js-listReviews');
      const userName = listReviewsNode.dataset.userName;
      
      addReviewFormNode.remove();
      
      listReviewsNode.innerHTML = `
        <div class="item review">
          <div class="head">
              <a class="btn link userName" href="/profile/view/${userName}" title="Перейти на страницу пользователя ${userName}">${userName}</a>
          </div>
          <div class="grade">
              <span class="icon icon-star${params.eval >= 1 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${params.eval >= 2 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${params.eval >= 3 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${params.eval >= 4 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${params.eval >= 5 ? 'Fill' : ''}"></span>
          </div>
          <div class="text">
              ${params.text}
          </div>
        </div>` + listReviewsNode.innerHTML;
    }
  })
}

if (collapseNodes.length) {
  let activeCollapse = null;
  
  collapseNodes.forEach(collapse => {
    collapse.addEventListener('click', (e) => {
      const targetSelector = collapse.dataset.target;
      let collapseContentNode = collapse;
      
      if (targetSelector) {
        collapseContentNode = document.querySelector(targetSelector);
      }
      
      activeCollapse && activeCollapse.classList.remove('active');
      
      if (activeCollapse === collapseContentNode) {
        return activeCollapse = null;
      }
  
      collapseContentNode.classList.add('active');
      activeCollapse = collapseContentNode;
    })
  })
}

if (cartNode) {
  const cartListNode = cartNode.querySelector('.js-cartList');
  const cartTitleNode = cartNode.querySelector('.js-cartTitle');
  
  if (cartListNode) {
    const productNodes = cartListNode.querySelectorAll('.js-product');
    const checkNode = cartListNode.querySelector('.js-check');
    const totalPriceToNode = checkNode.querySelector('.js-totalTo');
    const totalPriceFromNode = checkNode.querySelector('.js-totalFrom');
    const totalProductsNode = checkNode.querySelector('.js-totalProducts');
    const payBtnNode = checkNode.querySelector('.js-payBtn');
    const savingValueNode = checkNode.querySelector('.js-saving');
    let savingValue = +savingValueNode.innerText;
    let countProducts = productNodes.length;
    let totalPriceToValue = +totalPriceToNode.innerText;
    let totalPriceFromValue = +totalPriceFromNode.innerText;
  
    if (countProducts) {
      productNodes.forEach(productNode => {
        const deleteFromCartBtn = productNode.querySelector('.js-deleteFromCart');
        const productId = productNode.dataset.productId;

        deleteFromCartBtn.addEventListener('click', async () => {
          if (!productId) {
            return;
          }

          const response = await postman.delete(`/api/products/${productId}/cart`);
          const result = await response.json();

          if (result.error) {
            return;
          }

          countProducts -= 1;

          if (countProducts === 0)   {
            cartListNode.remove();
            cartTitleNode.remove();
  
            return cartNode.innerHTML += `
              <div class="notFound">
                <img src="${websiteAddress}img/notFound.svg" class="img" alt="Иконка расстроенного смайла" title="Корзина пуста :(">
                <div class="text">
                    <span class="title">Корзина пуста</span>
                    <p class="description">Воспользуйтесь каталогом, чтобы найти все, что нужно!</p>
                </div>
                <a href="${websiteAddress}games" class="btn big border round hover-border-pink hover-color-pink" title="Перейти в каталог">В каталог</a>
              </div>
            `;
          }

          const priceTo = +productNode.querySelector('.js-priceTo').innerText;
          const priceFrom = +productNode.querySelector('.js-priceFrom')?.innerText;

          totalPriceToValue -= priceTo;
          totalPriceFromValue -= priceFrom ? priceFrom : priceTo;
          savingValue -= priceFrom ? priceFrom - priceTo : 0;

          totalPriceToNode.innerText = totalPriceToValue;
          totalPriceFromNode.innerText = totalPriceFromValue;
          totalProductsNode.innerText = countProducts;
          savingValueNode.innerText = savingValue;

          productNode.remove();
        })
        
      });
  
      payBtnNode && payBtnNode.addEventListener('click', async () => {
        const formData = new FormData();
        const changes = [];
        let dsCartId = null;
    
        formData.append('product_cnt', '1');
        formData.append('typecurr', 'wmr');
        formData.append('lang', 'ru-RU');
    
        for (const productNode of productNodes) {
          const dsId = productNode.dataset.dsId;
          const productId = productNode.dataset.productId;
      
          formData.set('product_id', dsId);
      
          const responseAddCartDs = await fetch('https://shop.digiseller.ru/xml/shop_cart_add.asp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlEncodeFormData(formData),
          });
      
          const resultAddCartDs = await responseAddCartDs.json();
      
          if (resultAddCartDs.cart_err === "Товар закончился или временно отключен.") {
            const deleteFromCartBtn = productNode.querySelector('.js-deleteFromCart');
  
            deleteFromCartBtn.dispatchEvent(new Event('click'));
            await postman.put(`/api/products/${productId}/revise`);
            changes.push({
              name: productNode.querySelector('.name').innerText,
              notInStock: true,
              productId,
            });
          }
      
          if (resultAddCartDs.cart_err_num !== '0') {
            return;
          }
      
          const product = resultAddCartDs.products.find(product => +product.id === +dsId);
          const priceToNode = productNode.querySelector('.js-priceTo');
          const currentPrice = +priceToNode.innerText;
      
          if (+product.price !== currentPrice) {
            const priceFrom = +productNode.querySelector('.js-priceFrom').innerText;
            const dsPrice = parseInt(product.price);
            const discountNode = productNode.querySelector('.js-discount');
            
            await postman.put(`/api/products/${productId}/revise`);
  
            savingValueNode.innerText = +savingValueNode.innerText - (dsPrice - currentPrice);
            totalPriceToNode.innerText = totalPriceFromNode.innerText - savingValueNode.innerText;
            discountNode.innerText = Math.floor(100 - dsPrice / (priceFrom / 100));
            priceToNode.innerText = dsPrice;
            changes.push({
              name: productNode.querySelector('.name').innerText,
              fromPrice: currentPrice,
              toPrice: dsPrice,
            });
          }
      
          if (!dsCartId) {
            formData.set('cart_uid', resultAddCartDs.cart_uid);
            dsCartId = resultAddCartDs.cart_uid;
          }
        }
    
        if (!changes.length) {
          const response = await postman.post('/api/order', {dsCartId});
          const result = await response.json();
      
          if (result.error) {
            return;
          }
      
          const payFormNode = cartListNode.querySelector('.js-payForm');
          const dsCartIdInputNodes = payFormNode.querySelectorAll('.js-dsCartId');
  
          dsCartIdInputNodes.forEach(item => item.value = dsCartId);
          
          return payFormNode.submit();
        }
        
        /*changes.forEach(item => {
        
        })*/
      })
    }
  }
}

document.addEventListener('click', async (e) => {
  const target = e.target;
  const productCardNode = target.closest('.js-cardGame');
  
  if (productCardNode) {
    if (target === productCardNode) {
      return;
    }
  
    const productId = productCardNode.dataset.id;
    const dsId = productCardNode.dataset.dsId;
    const addToFavoriteBtnNode = target.closest('.js-favoritesBtn');
    const addToCartBtnNode = target.closest('.js-addToCart');
  
    if (addToFavoriteBtnNode) {
      const addToFavoriteIconNode = addToFavoriteBtnNode.querySelector('.js-icon');
      
      e.preventDefault();
  
      if (addToFavoriteBtnNode.classList.contains('js-active')) {
        const response = await postman.delete(`/api/products/${productId}/favorites`);
        const result = await response.json();
    
        if (result.error) {
          return;
        }
  
        addToFavoriteBtnNode.setAttribute('title', 'Добавить игру в избранное');
        addToFavoriteBtnNode.classList.remove('js-active');
        addToFavoriteIconNode.classList.remove('active');
        return;
      }
  
      const response = await postman.post(`/api/products/${productId}/favorites`);
      const result = await response.json();
  
      if (result.error) {
        return;
      }
  
      addToFavoriteBtnNode.setAttribute('title', 'Удалить игру из избранного');
      addToFavoriteBtnNode.classList.add('js-active');
      addToFavoriteIconNode.classList.add('active');
    }
    
    if (addToCartBtnNode) {
      const addToCartBtnText = addToCartBtnNode.querySelector('.js-text');
      const addToCartBtnIcon = addToCartBtnNode.querySelector('.js-icon');
      
      e.preventDefault();
  
      if (addToCartBtnNode.classList.contains('js-active')) {
        window.location.href = '/cart';
        return;
      }
      
      const response = await postman.post(`/api/products/${productId}/cart`);
      const result = await response.json();
  
      if (result.error) {
        return;
      }
  
      addToCartBtnText.innerText = 'Добавлено';
      addToCartBtnIcon.classList.add('active');
      addToCartBtnNode.classList.add('js-active', 'active');
      addToCartBtnNode.setAttribute('title', 'Перейти в корзину покупок');
    }
  }
  
  /*class Menu { //Шаблон для переписывания js на классы, сделать кланый класс Page
    constructor(elem) {
      this._elem = elem;
      elem.onclick = this.onClick.bind(this); // (*)
    }
    
    save() {
      alert('сохраняю');
    }
    
    load() {
      alert('загружаю');
    }
    
    search() {
      alert('ищу');
    }
    
    onClick(event) {
      let action = event.target.dataset.action;
      if (action) {
        this[action]();
      }
    }
  }
  
  new Menu(menu);*/
})

mobileSearchStringNode.addEventListener('input', async () => {
  const response = await postman.get(`${websiteAddress}api/products`, {searchString: mobileSearchStringNode.value, limit: 7});
  const result = await response.json();
  const searchResultNode = document.querySelector('.js-mobileSearchResult');
  
  if (result.error) {
    return;
  }
  
  if (result.products?.length === 0) {
    return searchResultNode.innerHTML = '<p class="textInfo">Ни чего не найдено</p>';
  }
  
  searchResultNode.innerHTML = '';
  
  result.products.forEach(product => {
    searchResultNode.innerHTML += `
      <a
        href="/games/${product.alias}"
        class="cardGame small js-cardGame"
        data-id="${product._id}"
        title="Перейти к странице товара"
      >
        <div class="actions${!product.inStock ? ' noInStock' : ''}">
          ${result.isAuth ? `
            <button class="btn like js-favoritesBtn${product.inFavorites ? ' js-active' : ''}" title="${product.inFavorites ? 'Удалить игру из избранного' : 'Добавить игру в избранное'}">
              <span class="icon-static icon-static-actionLike js-icon${product.inFavorites ? ' active' : ''}"></span>
            </button>
          ` : ''}
          ${product.inStock ? `
            <button
              class="btn border rounded uppercase bg-darkPink hover-bg-pink inCart small js-addToCart${product.inCart ? ' active js-active' : ''}"
              title="${product.inCart ? 'Перейти в корзину покупок' : 'Добавить данный товар в корзину покупок'}"
            >
              <span class="desktop js-text">
                ${product.inCart ? 'Добавлено' : 'В корзину'}
              </span>
              <span class="mobile icon-static icon-static-cartProduct${product.inCart ? ' active' : ''} js-icon"></span>
            </button>
          ` : `
            <div class="noInStockMsg">Игры нет<br>в наличии :(</div>
            <button
              class="btn border rounded bg-darkPink hover-bg-pink small js-subscribeInStock"
              title="Подписаться на уведомление о поступлении товара"
            >Уведомить</button>
          `}
        </div>
        ${product.dlc ? '<div class="dlc" title="Дополнение для игры">DLC</div>' : ''}
        <div class="head">
          <img class="img" src="${websiteAddress}${product.img}" alt="Картинка ${product.name}" title="${product.name}">
          <div class="name">
            ${product.name}
          </div>
        </div>
        <div class="price">
          <div class="toPrice">
            <span class="value">${product.priceTo}</span>
          </div>
          ${
            product.priceTo < product.priceFrom ? `
              <div class="fromPrice">
                <span class="value">${product.priceFrom}</span>
              </div>
            ` : ''
          }
        </div>
      </a>
    `;
  });
  
  if (!result.isLast) {
    searchResultNode.innerHTML += `
        <a class="goToAllSearchResults" href="/games${mobileSearchStringNode.value ? `?searchString=${mobileSearchStringNode.value}` : ''}">
            <div class="">
                <span class="icon icon-allResults"></span>
            </div>
            <div class="text">Все результаты</div>
        </a>
    `;
  }
})

searchStringNode.addEventListener('input', async () => {
  if (catalogNode) {
    return;
  }
  
  popupController.activateById('navigate');
  
  const response = await postman.get(`${websiteAddress}api/products`, {searchString: searchStringNode.value, limit: 7});
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
      <a
        href="/games/${product.alias}"
        class="cardGame small js-cardGame"
        data-id="${product._id}"
        title="Перейти к странице товара"
      >
        <div class="actions${!product.inStock ? ' noInStock' : ''}">
          ${result.isAuth ? `
            <button class="btn like js-favoritesBtn${product.inFavorites ? ' js-active' : ''}" title="${product.inFavorites ? 'Удалить игру из избранного' : 'Добавить игру в избранное'}">
              <span class="icon-static icon-static-actionLike js-icon${product.inFavorites ? ' active' : ''}"></span>
            </button>
          ` : ''}
          ${product.inStock ? `
            <button
              class="btn border rounded uppercase bg-darkPink hover-bg-pink inCart small js-addToCart${product.inCart ? ' active js-active' : ''}"
              title="${product.inCart ? 'Перейти в корзину покупок' : 'Добавить данный товар в корзину покупок'}"
            >
              <span class="desktop js-text">
                ${product.inCart ? 'Добавлено' : 'В корзину'}
              </span>
              <span class="mobile icon-static icon-static-cartProduct${product.inCart ? ' active' : ''} js-icon"></span>
            </button>
          ` : `
            <div class="noInStockMsg">Игры нет<br>в наличии :(</div>
            <button
              class="btn border rounded bg-darkPink hover-bg-pink small js-subscribeInStock"
              title="Подписаться на уведомление о поступлении товара"
            >Уведомить</button>
          `}
        </div>
        ${product.dlc ? '<div class="dlc" title="Дополнение для игры">DLC</div>' : ''}
        <div class="head">
          <img class="img" src="${websiteAddress}${product.img}" alt="Картинка ${product.name}" title="${product.name}">
          <div class="name">
            ${product.name}
          </div>
        </div>
        <div class="price">
          <div class="toPrice">
            <span class="value">${product.priceTo}</span>
          </div>
          ${
            product.priceTo < product.priceFrom ? `
              <div class="fromPrice">
                <span class="value">${product.priceFrom}</span>
              </div>
            ` : ''
          }
        </div>
      </a>
    `;
  });
  
  if (!result.isLast) {
    searchResultNode.innerHTML += `
        <a class="goToAllSearchResults" href="/games?searchString=${searchStringNode.value}">
            <div class="">
                <span class="icon icon-allResults"></span>
            </div>
            <div class="text">Все результаты</div>
        </a>
    `;
  }
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

if (newsSliderNode) {
  new Slider({
    mainNode: newsSliderNode,
    switchingTime: 5000,
    isTrack: true,
    countSlidesScroll: 2
  })
}

if (achievementViewProfileSliderNode) {
  new Slider({
    mainNode: achievementViewProfileSliderNode,
    switchingTime: 3000,
    isTrack: true,
    countSlidesScroll: 5,
  })
}

if (homeMediaSliderNode) {
  new Slider({
    mainNode: homeMediaSliderNode,
    carousel: true,
  })
}

if (gamePageNode) {
  const productCoverNode = gamePageNode.querySelector('.js-productPageCover');
  const videoNode = productCoverNode.querySelector('.js-coverVideo');
  
  if (videoNode) {
    const videoName = productCoverNode.dataset.videoName;
    let playVideoTimeOutId;
  
    window.addEventListener('resize', handleResize);
  
    videoNode.addEventListener('canplaythrough', onCanplaythrough);
    videoNode.setAttribute('src',`${websiteAddress}${videoName}`);
  
    function onCanplaythrough() {
      playVideoTimeOutId = setTimeout(() => {
        productCoverNode.classList.add('activeVideo');
        videoNode.play();
      }, 2000);
    }
  
    function handleResize() {
      if (getComputedStyle(videoNode).display === 'none' && videoNode.hasAttribute('src')) {
        clearTimeout(playVideoTimeOutId);
        productCoverNode.classList.remove('activeVideo');
        videoNode.removeAttribute('src');
        videoNode.removeEventListener('canplaythrough', onCanplaythrough);
      } else if (getComputedStyle(videoNode).display !== 'none' && !videoNode.hasAttribute('src')) {
        videoNode.addEventListener('canplaythrough', onCanplaythrough);
        videoNode.setAttribute('src',`${websiteAddress}${videoName}`);
      }
    }
  }
}

if (homeSliderNode) {
  const addToCartBtn = homeSliderNode.querySelectorAll('.js-addToCart');
  let playVideoTimeOutId;
  
  const homeSlider = new Slider({
    mainNode: homeSliderNode,
    onSwitch: switchHomeSlider,
    progress: true,
    navigate: true,
    switchingTime: 5000,
  });
  
  function switchHomeSlider(slides, prevSlides = []) {
    const slideNode = slides[0];
    const videoNode = slideNode.querySelector('.video');
    const prevSlideNode = prevSlides[0];
    const videoName = slideNode.dataset.videoName;
    let canplaythrough = true;
    
    window.addEventListener('resize', handleResize);
    
    if (getComputedStyle(videoNode).display === 'none') {
      return;
    }
    
    clearTimeout(playVideoTimeOutId);
    
    if (slideNode === prevSlideNode) {
      return;
    }
    
    if (prevSlideNode) {
      const prevSlideVideoNode = prevSlideNode.querySelector('.video');
      
      prevSlideNode.classList.remove('activeVideo');
      prevSlideVideoNode.removeAttribute('src');
      prevSlideVideoNode.removeEventListener('canplaythrough', onCanplaythrough);
    }
    
    videoNode.addEventListener('canplaythrough', onCanplaythrough);
    videoNode.setAttribute('src',`${websiteAddress}${videoName}`);
  
    function handleResize() {
      if (getComputedStyle(videoNode).display === 'none' && videoNode.hasAttribute('src')) {
        clearTimeout(playVideoTimeOutId);
        slideNode.classList.remove('activeVideo');
        homeSlider.changeTimeoutOnce(5000);
        videoNode.removeAttribute('src');
        videoNode.removeEventListener('canplaythrough', onCanplaythrough);
        canplaythrough = true;
      } else if (getComputedStyle(videoNode).display !== 'none' && !videoNode.hasAttribute('src')) {
        videoNode.addEventListener('canplaythrough', onCanplaythrough);
        videoNode.setAttribute('src',`${websiteAddress}${videoName}`);
      }
    }
  
    function onCanplaythrough() {
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
  }
  
  addToCartBtn.forEach(btn => {
    btn.addEventListener('click', async () => {
      if (btn.classList.contains('js-active')) {
        window.location.href = '/cart';
        return;
      }
      
      const productId = btn.dataset.productId;
      const response = await postman.post(`/api/products/${productId}/cart`);
      const result = await response.json();
  
      if (result.error) {
        return;
      }
  
      btn.innerText = 'Добавлено';
      btn.classList.add('js-active');
      btn.setAttribute('title', 'Перейти в корзину покупок');
    })
  })
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
    switchingTime: 7000,
  });
}

if (gameGallerySliderNode) {
  new Slider({
    mainNode: gameGallerySliderNode,
    isTrack: true,
    countSlidesScroll: 2,
    switchingTime: 3000,
  });
}

if (gameInfoTabsNode) {
  new Tabs({
    mainNode: gameInfoTabsNode,
  });
}

if (feedbackProductTabsNode) {
  new Tabs({
    mainNode: feedbackProductTabsNode,
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

if (blogPageNode) {
  const loadMoreNode = blogPageNode.querySelector('.js-loadMore');
  const listArticlesNode = blogPageNode.querySelector('.js-listArticles');
  const countLoad = 3;
  
  loadMoreNode.addEventListener('click', async () => {
    const response = await postman.get(`${websiteAddress}api/articles?skip=${loadMoreNode.dataset.skip}&limit=${countLoad}&includeFixed=false`);
    const result = await response.json();
  
    if (result.error) {
      return;
    }
  
    result.isLast ? loadMoreNode.classList.add('hide') : loadMoreNode.classList.remove('hide');
    loadMoreNode.dataset.skip = parseInt(loadMoreNode.dataset.skip) + countLoad;
    result.articles.forEach(article => {
      listArticlesNode.innerHTML += `
        <a class="article${article.rightImg ? ' right' : ''}" href="${websiteAddress}blog/${article.alias}" style="--bgColor: ${article.blockColor}">
            <img class="img" src="${websiteAddress}${article.img}" alt="Изображение записи в блоге - ${article.name}">
            <div class="info">
                <div class="content">
                    <div class="title">${article.name}</div>
                    <div class="description">${article.introText}</div>
                </div>
                <div class="activity">
                    <div class="likes">${article.likes}</div>
                    <div class="views">${article.views}</div>
                </div>
            </div>
        </a>
      `;
    })
  })
}

if (catalogNode) {
  const filterNode = catalogNode.querySelector('.js-filter');
  const sortNode = catalogNode.querySelector('.js-sort');
  const rangePriceNode = catalogNode.querySelector('.js-priceRange');
  const loadMoreNode = catalogNode.querySelector('.js-loadMore');
  const countLoad = 20;
  const fields = [{
    name: 'searchString',
    node: searchStringNode,
    type: 'textInput',
  }];
  let sortActiveBtn = null;
  
  const checkbox = [
    ...filterNode.querySelectorAll('.js-checkbox'),
    ...sortNode.querySelectorAll('.js-checkbox'),
  ];
  const sortBtnNodes = sortNode.querySelectorAll('.js-variant-sort');
  const rangePriceSliderNodes = rangePriceNode.querySelectorAll('.js-slider');
  
  loadMoreNode.addEventListener('click', async () => {
    const url = new URL(window.location.href);
    const response = await postman.get(`${websiteAddress}api/products${url.search ? url.search : '?'}&skip=${loadMoreNode.dataset.skip}&limit=${countLoad}`);
    const result = await response.json();
    const productGridNode = catalogNode.querySelector('.js-productGrid');
    
    if (result.error) {
      return;
    }
  
    loadMoreNode.dataset.skip = parseInt(loadMoreNode.dataset.skip) + countLoad;
    result.isLast ? loadMoreNode.classList.add('hide') : loadMoreNode.classList.remove('hide');
  
    result.products.forEach(product => {
      productGridNode.innerHTML += `
        <a
          href="/games/${product.alias}"
          class="cardGame js-cardGame"
          data-id="${product._id}"
          title="Перейти к странице товара"
        >
          <div class="actions${!product.inStock ? ' noInStock' : ''}">
            ${result.isAuth ? `
              <button class="btn like js-favoritesBtn${product.inFavorites ? ' js-active' : ''}" title="${product.inFavorites ? 'Удалить игру из избранного' : 'Добавить игру в избранное'}">
                <span class="icon-static icon-static-actionLike js-icon${product.inFavorites ? ' active' : ''}"></span>
              </button>
            ` : ''}
            ${product.inStock ? `
              <button
                class="btn border rounded uppercase bg-darkPink hover-bg-pink inCart small js-addToCart${product.inCart ? ' active js-active' : ''}"
                title="${product.inCart ? 'Перейти в корзину покупок' : 'Добавить данный товар в корзину покупок'}"
              >
                <span class="desktop js-text">
                  ${product.inCart ? 'Добавлено' : 'В корзину'}
                </span>
                <span class="mobile icon-static icon-static-cartProduct${product.inCart ? ' active' : ''} js-icon"></span>
              </button>
            ` : `
              <div class="noInStockMsg">Игры нет<br>в наличии :(</div>
              <button
                class="btn border rounded bg-darkPink hover-bg-pink small js-subscribeInStock"
                title="Подписаться на уведомление о поступлении товара"
              >Уведомить</button>
            `}
          </div>
          ${product.dlc ? '<div class="dlc" title="Дополнение для игры">DLC</div>' : ''}
          <div class="head">
            <img class="img" src="${websiteAddress}${product.img}" alt="Картинка ${product.name}" title="${product.name}">
            <div class="name">
              ${product.name}
            </div>
          </div>
          <div class="price">
            <div class="toPrice">
              <span class="value">${product.priceTo}</span>
            </div>
            ${
              product.priceTo < product.priceFrom ? `
                <div class="fromPrice">
                  <span class="value">${product.priceFrom}</span>
                </div>
              ` : ''
            }
          </div>
        </a>
      `;
    })
  })
  
  searchStringNode.addEventListener('input', () => {
    const url = new URL(window.location.href);
    const value = searchStringNode.value;
    
    url.searchParams.set('searchString', value);
    
    if (!value.length) {
      url.searchParams.delete('searchString');
    }
    
    history.pushState(null, null, url);
    catalogNode.dispatchEvent(new Event('changeParams'));
  })
  
  rangePriceSliderNodes.forEach(rangePriceSliderNode => {
    const name = rangePriceSliderNode.dataset.name;
    
    rangePriceSliderNode.addEventListener('initialSlider', () => {
      const url = new URL(window.location.href);
      const value = rangePriceSliderNode.dataset.default;
      
      url.searchParams.set(name, value);
      history.pushState(null, null, url);
      catalogNode.dispatchEvent(new Event('changeParams'));
    })
  
    fields.push({
      name,
      node: rangePriceSliderNode,
      type: 'contentEditable',
      dispatch: true,
      event: 'startInitial',
    });
  })
  
  sortBtnNodes.forEach(sortBtnNode => {
    const value = sortBtnNode.dataset.sort;
    
    sortBtnNode.addEventListener('click', () => {
      const url = new URL(window.location.href);
      
      if (sortActiveBtn !== sortBtnNode) {
        url.searchParams.set('sort', value);
        sortBtnNode.classList.add('active');
        sortActiveBtn && sortActiveBtn.classList.remove('active');
        sortActiveBtn = sortBtnNode;
      } else {
        sortActiveBtn = null;
        sortBtnNode.classList.remove('active');
        url.searchParams.delete('sort');
      }
  
      history.pushState(null, null, url);
      catalogNode.dispatchEvent(new Event('changeParams'));
    })
  
    fields.push({
      name: 'sort',
      value,
      fixValue: true,
      node: sortBtnNode,
      dispatch: true,
      event: 'click',
    });
  })
  
  checkbox.forEach(item => {
    const input = item.querySelector('.input');
    const inputName = input.name;
    const inputValue = input.value;
    
    input.addEventListener('click', (e) => {
      const url = new URL(window.location.href);
      
      if (input.checked) {
        url.searchParams.append(inputName, inputValue);
      } else {
        const entriesParams = [...url.searchParams.entries()];
      
        for (item of entriesParams) {
          url.searchParams.delete(item[0]);
        }
      
        for (item of entriesParams) {
          if (item[1] === inputValue) {
            continue;
          }
        
          url.searchParams.append(item[0], item[1]);
        }
      }
    
      history.pushState(null, null, url);
      catalogNode.dispatchEvent(new Event('changeParams'));
    });
    
    fields.push({
      name: inputName,
      value: inputValue,
      fixValue: true,
      node: input,
      type: 'checkbox',
    });
  })
  
  const url = new URL(window.location.href);
  const entriesSearchParams = [...url.searchParams.entries()];
  
  entriesSearchParams.forEach(searchParam => {
    const field = fields.find(field => {
      if (field.fixValue) {
        return field.name === searchParam[0] && field.value === searchParam[1];
      }
  
      return field.name === searchParam[0];
    });
    
    if (!field) {
      return;
    }
    
    switch (field.type) {
      case 'checkbox': {
        field.node.checked = true;
        break;
      }
      case 'contentEditable': {
        field.node.innerText = searchParam[1];
        field.node.dataset.default = searchParam[1];
        break;
      }
      case 'textInput': {
        field.node.value = searchParam[1];
        break;
      }
    }
    
    if (field.dispatch) {
      field.node.dispatchEvent(new Event(field.event));
    }
  
    let param = {
      name: searchParam[0],
      value: searchParam[1],
    };
    
    switch (field.type) {
      case 'checkbox': {
        param.value = field.node.value;
        break;
      }
      case 'contentEditable': {
        param.value = field.node.dataset.value;
        break;
      }
      case 'textInput': {
        param.value = field.node.value;
        break;
      }
    }
  })
  
  catalogNode.addEventListener('changeParams', async () => {
    const url = new URL(window.location.href);
    const response = await postman.get(`${websiteAddress}api/products${url.search ? url.search : '?'}&limit=${countLoad}`);
    const result = await response.json();
    const productGridNode = catalogNode.querySelector('.js-productGrid');
    
    if (result.error) {
      return;
    }
  
    loadMoreNode.dataset.skip = countLoad;
    result.isLast ? loadMoreNode.classList.add('hide') : loadMoreNode.classList.remove('hide');
    productGridNode.classList.remove('notFound');
    productGridNode.innerHTML = '';
    
    if (!result.products.length) {
      productGridNode.classList.add ('notFound');
      productGridNode.innerHTML = `
        <img class="img" src="${websiteAddress}img/notFound.svg">
        <span class="text">Ничего не найдено...</span>
      `;
    }
    
    result.products.forEach(product => {
      productGridNode.innerHTML += `
        <a
          href="/games/${product.alias}"
          class="cardGame js-cardGame"
          data-id="${product._id}"
          title="Перейти к странице товара"
        >
          <div class="actions${!product.inStock ? ' noInStock' : ''}">
            ${result.isAuth ? `
              <button class="btn like js-favoritesBtn${product.inFavorites ? ' js-active' : ''}" title="${product.inFavorites ? 'Удалить игру из избранного' : 'Добавить игру в избранное'}">
                <span class="icon-static icon-static-actionLike js-icon${product.inFavorites ? ' active' : ''}"></span>
              </button>
            ` : ''}
            ${product.inStock ? `
              <button
                class="btn border rounded uppercase bg-darkPink hover-bg-pink inCart small js-addToCart${product.inCart ? ' active js-active' : ''}"
                title="${product.inCart ? 'Перейти в корзину покупок' : 'Добавить данный товар в корзину покупок'}"
              >
                <span class="desktop js-text">
                  ${product.inCart ? 'Добавлено' : 'В корзину'}
                </span>
                <span class="mobile icon-static icon-static-cartProduct${product.inCart ? ' active' : ''} js-icon"></span>
              </button>
            ` : `
              <div class="noInStockMsg">Игры нет<br>в наличии :(</div>
              <button
                class="btn border rounded bg-darkPink hover-bg-pink small js-subscribeInStock"
                title="Подписаться на уведомление о поступлении товара"
              >Уведомить</button>
            `}
          </div>
          ${product.dlc ? '<div class="dlc" title="Дополнение для игры">DLC</div>' : ''}
          <div class="head">
            <img class="img" src="${websiteAddress}${product.img}" alt="Картинка ${product.name}" title="${product.name}">
            <div class="name">
              ${product.name}
            </div>
          </div>
          <div class="price">
            <div class="toPrice">
              <span class="value">${product.priceTo}</span>
            </div>
            ${
              product.priceTo < product.priceFrom ? `
                <div class="fromPrice">
                  <span class="value">${product.priceFrom}</span>
                </div>
              ` : ''
            }
          </div>
        </a>
      `
    });
  })
  
  catalogNode.dispatchEvent(new Event('changeParams'));
}

if (loginFormNode && btnSwitchAuthNode && btnSwitchRegNode && submitLoginNode) {
  const resultNode = document.querySelector('.js-resultLogin');
  
  btnSwitchAuthNode.addEventListener('click', () => {
    btnSwitchAuthNode.classList.add('active');
    btnSwitchRegNode.classList.remove('active');
    loginFormNode.classList.add('auth');
    loginFormNode.action = '/auth';
    submitLoginNode.innerText = 'Войти';
    resultNode.innerText = '';
  });
  
  btnSwitchRegNode.addEventListener('click', () => {
    btnSwitchRegNode.classList.add('active');
    btnSwitchAuthNode.classList.remove('active');
    loginFormNode.classList.remove('auth');
    loginFormNode.action = '/reg';
    submitLoginNode.innerText = 'Далее';
    resultNode.innerText = '';
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
  const resultLoginNode = document.querySelector('.js-resultLogin');
  
  new AsyncForm({
    mainNode: loginFormNode,
    resultMessageNode: resultLoginNode,
    successHandler: () => {
      setTimeout(() => {
        window.location.reload();
      }, 1500)
    },
  });
}

if (profileEditFormNode) {
  const resultEditNode = document.querySelector('.js-resultEditProfile');
  
  new AsyncForm({
    mainNode: profileEditFormNode,
    resultMessageNode: resultEditNode,
  })
}

if (promptNodes.length) {
  promptNodes.forEach(item => new Prompt({mainNode: item}));
}

if (profileMenuNode) {
  const markerNode = profileMenuNode.querySelector('.js-marker');
  const listBtnNodes = profileMenuNode.querySelectorAll('.btn');
  const activeBtnNode = profileMenuNode.querySelector('.btn.active');
  
  function moveIndicator(e) {
    markerNode.style.top = e.offsetTop+'px';
    markerNode.style.display = 'flex';
  }
  
  moveIndicator(activeBtnNode);
  
  profileMenuNode.addEventListener('mouseleave', () => {
    moveIndicator(activeBtnNode);
  })
  
  listBtnNodes.forEach(link => {
    link.addEventListener('mouseover', (e) => {
      moveIndicator(e.target)
    })
  })
}

if (recProductSliderNode) {
  new Slider({
    mainNode: recProductSliderNode,
    switchingTime: 3000,
    progress: true,
    isTrack: true,
    countSlidesScroll: 1,
  });
}

if (seriesSliderNode) {
  new Slider({
    mainNode: seriesSliderNode,
    switchingTime: 3000,
    isTrack: true,
    countSlidesScroll: 4,
  })
}