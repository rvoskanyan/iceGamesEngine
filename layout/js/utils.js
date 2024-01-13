import { platform, websiteAddress } from "./config.js";

export const urlEncodeFormData = (fd) => {
  let s = '';
  
  function encode(s) {
    return encodeURIComponent(s).replace(/%20/g,'+');
  }
  
  for (let pair of fd.entries()) {
    if (typeof pair[1]=='string') {
      s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
    }
  }
  
  return s;
}

export const scrollTo = (offset, callback) => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  const fixedOffset = offset.toFixed();
  const onScroll = () => {
    const currentScrollOffset = window.pageYOffset || document.documentElement.scrollTop
    
    if (currentScrollOffset.toFixed() === fixedOffset) {
      window.removeEventListener('scroll', onScroll);
      callback();
    }
  }
  
  window.addEventListener('scroll', onScroll);
  onScroll();
  
  window.scrollTo(0, fixedOffset);
}

export const getProductCardNode = (data) => {
  const productNode = document.createElement('a');
  const actionsNode = document.createElement('div');
  const headNode = document.createElement('div');
  const headImgNode = document.createElement('img');
  const imageFilterNode = document.createElement('div');
  const nameNode = document.createElement('div');
  const priceNode = document.createElement('div');
  const toPriceNode = document.createElement('div');
  const toPriceValueNode = document.createElement('span');
  const checkIconNode = document.createElement('span');
  
  
  if (data.dlc) {
    const dlcInfoNode = document.createElement('div');
    
    dlcInfoNode.setAttribute('class', 'dlc');
    dlcInfoNode.setAttribute('title', 'Дополнение для игры');
    dlcInfoNode.innerText = 'DLC';
    
    productNode.append(dlcInfoNode);
  }
  
  // checking product for freshness
  const currentDate = new Date();  
  currentDate.setDate(currentDate.getDate() - 180);

  if (new Date(data.releaseDate) > currentDate) {
    const newInfoNode = document.createElement('div');
    
    newInfoNode.setAttribute('class', 'new');
    newInfoNode.setAttribute('title', 'Новинка');
    newInfoNode.innerText = 'new';
    
    productNode.append(newInfoNode);
  }
  
  // done
  if (data.isAuth) {
    const favoritesBtnNode = document.createElement('button');
    const favoritesIconBtnNode = document.createElement('span');
    
    favoritesIconBtnNode.setAttribute('class', `icon-static icon-static-actionLike js-icon${data.inFavorites ? ' active' : ''}`);
    
    favoritesBtnNode.setAttribute('class', `btn like js-favoritesBtn${data.inFavorites ? ' js-active' : ''}`);
    favoritesBtnNode.setAttribute('title', data.inFavorites ? 'Удалить товар из избранного' : 'Добавить товар в избранное');
    favoritesBtnNode.append(favoritesIconBtnNode);
  
    actionsNode.append(favoritesBtnNode);
  }
  
  headImgNode.setAttribute('class', 'img');
  //  TODO изменить адрес картинки 
  // headImgNode.setAttribute('src', `${websiteAddress}${data.img}`);
  
  headImgNode.setAttribute('src', `${websiteAddress}/img/d81e3c7c-7179-455a-b31d-bb6201424351.jpeg`);
  
  
  headImgNode.setAttribute('alt', `Картинка ${data.name}`);
  headImgNode.setAttribute('title', data.name);

  imageFilterNode.setAttribute('class', `imageFilter ${data.inStock ? '' : 'activate'}`)
  
  nameNode.setAttribute('class', 'name');
  nameNode.innerText = data.name;
  
  headNode.setAttribute('class', 'head');
  headNode.append(headImgNode);
  headNode.append(imageFilterNode);
  // headNode.append(headNameNode);
  
  if (data.preOrder) {
    const preOrderMobileTextNode = document.createElement('div');
    const preOrderDesktopTextNode = document.createElement('div');
    const subscribeBtnNode = document.createElement('button');
  
    preOrderMobileTextNode.setAttribute('class', 'soonInStockMsg mobile');
    preOrderDesktopTextNode.setAttribute('class', 'soonInStockMsg desktop');
    preOrderMobileTextNode.innerHTML = 'Скоро<br>в наличии!';
    preOrderDesktopTextNode.innerHTML = 'Скоро в наличии!';
  
    subscribeBtnNode.setAttribute('class', 'btn subscribeInStock js-subscribeInStock');
    subscribeBtnNode.setAttribute('title', 'Подписаться на уведомление о поступлении товара');
    subscribeBtnNode.innerText = 'Уведомить';
    
    if (data.subscribesInStock.includes(data.email)) {
      checkIconNode.setAttribute('class', 'icon icon-check')
      subscribeBtnNode.setAttribute('title', 'Когда товар появится в наличии, на Ваш E-mail придет уведомление');
      subscribeBtnNode.append(checkIconNode);
    }
    
    actionsNode.append(preOrderMobileTextNode);
    actionsNode.append(preOrderDesktopTextNode);
    actionsNode.append(subscribeBtnNode);
     
  } else if (data.inStock) {
    const addToCartBtnNode = document.createElement('button');
    const desktopTextNode = document.createElement('span');
    const checkIconNode = document.createElement('span');
    
    desktopTextNode.setAttribute('class', 'desktop js-text');
    desktopTextNode.innerText = data.inCart ? 'В корзине' : 'В корзину';

    checkIconNode.setAttribute('class', 'icon icon-check js-icon')
  
    addToCartBtnNode.setAttribute('class', `btn inCart js-addToCart${data.inCart ? ' active js-active' : ''}`);
    addToCartBtnNode.setAttribute('title', data.inCart ? 'Перейти в корзину покупок' : 'Добавить данный товар в корзину покупок');
    addToCartBtnNode.append(desktopTextNode);
    addToCartBtnNode.append(checkIconNode);
  
    actionsNode.append(addToCartBtnNode);
  } else {
    const notInStockTextNode = document.createElement('div');
    const subscribeBtnNode = document.createElement('button');
    
    notInStockTextNode.setAttribute('class', 'noInStockMsg');
    notInStockTextNode.innerHTML = 'Нет в наличии';

    subscribeBtnNode.setAttribute('class', 'btn subscribeInStock js-subscribeInStock');
    subscribeBtnNode.setAttribute('title', 'Подписаться на уведомление о поступлении товара');
    subscribeBtnNode.innerText = 'Уведомить';
    
    if (data.subscribesInStock.includes(data.email)) {
      checkIconNode.setAttribute('class', 'icon icon-check')
      subscribeBtnNode.setAttribute('title', 'Когда товар появится в наличии, на Ваш E-mail придет уведомление');
      subscribeBtnNode.append(checkIconNode);
    }
  
    actionsNode.append(notInStockTextNode);
    actionsNode.append(subscribeBtnNode);
  }
  
  actionsNode.setAttribute('class', `actions${!data.inStock ? ' noInStock' : ''}`);
  
  
  
  toPriceValueNode.setAttribute('class', 'value');
  toPriceValueNode.innerText = data.priceTo;
  
  toPriceNode.setAttribute('class', 'toPrice');
  toPriceNode.append(toPriceValueNode);
  
  priceNode.setAttribute('class', `price ${!data.inStock && !data.preOrder ? 'hidden' : ''}`);
  priceNode.append(toPriceNode);
  
  
  
  if (data.priceTo < data.priceFrom) {
    const fromPriceNode = document.createElement('div');
    const fromPriceValueNode = document.createElement('span');
  
    fromPriceValueNode.setAttribute('class', 'value');
    fromPriceValueNode.innerText = data.priceFrom;
  
    fromPriceNode.setAttribute('class', 'fromPrice');
    fromPriceNode.append(fromPriceValueNode);
  
    priceNode.append(fromPriceNode);
    
    const discountNode = document.createElement('div');
    discountNode.setAttribute('class', 'discount js-discount');
    discountNode.innerText = data.discount;
    
    priceNode.append(discountNode);
  }
  
  productNode.setAttribute('href', `${ platform ? '/' + platform : '' }/games/${ data.alias }`);
  productNode.setAttribute('title', 'Перейти к странице товара');
  productNode.setAttribute('class', `cardGame${data.size ? ` ${data.size}` : ''} js-cardGame`);
  productNode.setAttribute('data-id', `${data._id}`);
 
  productNode.append(headNode);
  productNode.append(nameNode);
  productNode.append(priceNode);
  productNode.append(actionsNode);
  
  return productNode;
}

export function debounce(fn, wait){
  let timer;
  return function(...args){
    if(timer) {
      clearTimeout(timer);
    }
    const context = this;
    timer = setTimeout(()=>{
      fn.apply(context, args);
    }, wait);
  }
}
