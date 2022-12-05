import {websiteAddress} from "./config.js";

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
  const headNameNode = document.createElement('div');
  const priceNode = document.createElement('div');
  const toPriceNode = document.createElement('div');
  const toPriceValueNode = document.createElement('span');
  
  if (data.dlc) {
    const dlcInfoNode = document.createElement('div');
    
    dlcInfoNode.setAttribute('class', 'dlc');
    dlcInfoNode.setAttribute('title', 'Дополнение для игры');
    dlcInfoNode.innerText = 'DLC';
    
    productNode.append(dlcInfoNode);
  }
  
  if (data.isAuth) {
    const favoritesBtnNode = document.createElement('button');
    const favoritesIconBtnNode = document.createElement('span');
    
    favoritesIconBtnNode.setAttribute('class', `icon-static icon-static-actionLike js-icon${data.inFavorites ? ' active' : ''}`);
    
    favoritesBtnNode.setAttribute('class', `btn like js-favoritesBtn${data.inFavorites ? ' js-active' : ''}`);
    favoritesBtnNode.setAttribute('title', data.inFavorites ? 'Удалить товар из избранного' : 'Добавить товар в избранное');
    favoritesBtnNode.append(favoritesIconBtnNode);
  
    actionsNode.append(favoritesBtnNode);
  }
  
  if (data.inStock) {
    const addToCartBtnNode = document.createElement('button');
    const desktopTextNode = document.createElement('span');
    const mobileIconNode = document.createElement('span');
    
    desktopTextNode.setAttribute('class', 'desktop js-text');
    desktopTextNode.innerText = data.inCart ? 'Добавлено' : 'В корзину';
  
    mobileIconNode.setAttribute('class', `mobile icon-static icon-static-cartProduct${data.inCart ? ' active' : ''} js-icon`);
  
    addToCartBtnNode.setAttribute('class', `btn border rounded uppercase bg-darkPink hover-bg-pink inCart small js-addToCart${data.inCart ? ' active js-active' : ''}`);
    addToCartBtnNode.setAttribute('title', data.inCart ? 'Перейти в корзину покупок' : 'Добавить данный товар в корзину покупок');
    addToCartBtnNode.append(desktopTextNode);
    addToCartBtnNode.append(mobileIconNode);
  
    actionsNode.append(addToCartBtnNode);
  } else {
    const notInStockTextNode = document.createElement('div');
    const subscribeBtnNode = document.createElement('button');
    
    notInStockTextNode.setAttribute('class', 'noInStockMsg');
    notInStockTextNode.innerHTML = 'Игры нет<br>в наличии :(';
  
    subscribeBtnNode.setAttribute('class', 'btn border rounded bg-darkPink hover-bg-pink small js-subscribeInStock');
    subscribeBtnNode.setAttribute('title', 'Подписаться на уведомление о поступлении товара');
    subscribeBtnNode.innerText = 'Уведомить';
  
    actionsNode.append(notInStockTextNode);
    actionsNode.append(subscribeBtnNode);
  }
  
  actionsNode.setAttribute('class', `actions${!data.inStock ? ' noInStock' : ''}`);
  
  headImgNode.setAttribute('class', 'img');
  headImgNode.setAttribute('src', `${websiteAddress}${data.img}`);
  headImgNode.setAttribute('alt', `Картинка ${data.name}`);
  headImgNode.setAttribute('title', data.name);
  
  headNameNode.setAttribute('class', 'name');
  headNameNode.innerText = data.name;
  
  headNode.setAttribute('class', 'head');
  headNode.append(headImgNode);
  headNode.append(headNameNode);
  
  toPriceValueNode.setAttribute('class', 'value');
  toPriceValueNode.innerText = data.priceTo;
  
  toPriceNode.setAttribute('class', 'toPrice');
  toPriceNode.append(toPriceValueNode);
  
  priceNode.setAttribute('class', 'price');
  priceNode.append(toPriceNode);
  
  if (data.priceTo < data.priceFrom) {
    const fromPriceNode = document.createElement('div');
    const fromPriceValueNode = document.createElement('span');
  
    fromPriceValueNode.setAttribute('class', 'value');
    fromPriceValueNode.innerText = data.priceFrom;
  
    fromPriceNode.setAttribute('class', 'fromPrice');
    fromPriceNode.append(fromPriceValueNode);
  
    priceNode.append(fromPriceNode);
  }
  
  productNode.setAttribute('href', `/games/${data.alias}`);
  productNode.setAttribute('title', 'Перейти к странице товара');
  productNode.setAttribute('class', `cardGame${data.size ? ` ${data.size}` : ''} js-cardGame`);
  productNode.setAttribute('data-id', `${data._id}`);
  productNode.append(actionsNode);
  productNode.append(headNode);
  productNode.append(priceNode);
  
  return productNode;
}