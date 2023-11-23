import Slider from "./Slider.js";
import Tabs from "./Tabs.js";
import Modal from "./Modal.js";
import PopupController from "./PopupController.js";
import AsyncForm from "./AsyncForm.js";
import Prompt from "./Prompt.js";
import {debounce, getProductCardNode, scrollTo, urlEncodeFormData} from "./utils.js";
import Postman from "./Postman.js";
import {websiteAddress} from "./config.js";

import './../styles/index.sass';
import Range from "./Range.js";
import SocialSharing from "./lib/socialSharing.js";
import Message from "./lib/message.js";
import Payment from "./lib/payment.js";

const postman = new Postman();
const platform = document.body.dataset.platform || 'pc';

const platformSwitchNode = document.querySelector('.js-platformSwitch');
const switchSplitNode = document.querySelector('.js-switchSplit');
const profileMenuNode = document.querySelector('.js-profileMenu');
const homeSliderNode = document.querySelector('.js-homeSlider');
const fillUpPageModalNode = document.querySelector('.js-fillUpPageModal');
const whereLoginNode = document.querySelector('.js-whereLogin');
const howToGetLoginNode = document.querySelector('.js-howToGetLogin');
const inputFrameNodes = document.querySelectorAll('.js-inputFrame');
const recProductSliderNode = document.querySelector('.js-recProductSlider');
const ourChoiceSliderNode = document.querySelector('.js-ourChoiceSlider');
const additionsProductSliderNode = document.querySelector('.js-additionsProductSlider');
const articlesProductSliderNode = document.querySelector('.js-articlesGameSlider');
const seriesSliderNode = document.querySelector('.js-seriesSlider');
const newsSliderNode = document.querySelector('.js-newsSlider');
const achievementViewProfileSliderNode = document.querySelector('.js-achievementViewProfileSlider');
const homeMediaSliderNode = document.querySelector('.js-homeMediaSlider');
const productsFromArticleSliderNode = document.querySelector('.js-productsFromArticleSlider');
const homeCatalogTabsNode = document.querySelector('.js-homeCatalogTabs');
const genresSliderNode = document.querySelector('.js-genresSlider');
const gameGallerySliderNode = document.querySelector('.js-gameGallerySlider');
const gameInfoTabsNode = document.querySelector('.js-gameInfoTabs');
const gameInfoSystemParamsNode = document.querySelector('.js-gameInfoSystemParams');
const feedbackProductTabsNode = document.querySelector('.js-feedbackProductTabs');
const fillUpInfoTabs = document.querySelector('.js-fillUpInfoTabs');
const youtubePlayNodes = document.querySelectorAll('.js-playYouTubeVideo');
const catalogNode = document.querySelector('.js-catalog');
const loginFormNode = document.querySelector('.js-loginForm');
const profileEditFormNode = document.querySelector('.js-profileEditForm');
const submitLoginNode = document.querySelector('.js-submitLoginForm');
const btnSwitchAuthNode = document.querySelector('.js-btnSwitchAuth');
const btnSwitchRegNode = document.querySelector('.js-btnSwitchReg');
const inputLabelInFieldNodes = document.querySelectorAll('.js-inputLabelInField');
const promptNodes = document.querySelectorAll('.js-prompt');
const promptProductNodes = document.querySelectorAll('.js-promptProduct');
const scrollerNode = document.querySelector('.js-scroller');
const likeArticleNode = document.querySelector('.js-likeArticle');
const copyBtnNode = document.querySelector('.js-copyBtn');
const searchStringNode = document.querySelector('.js-searchString');
const mobileSearchStringNode = document.querySelector('.js-mobileSearchString');
const goSearchNode = document.querySelector('.js-goSearch');
const goSearchMobileNode = document.querySelector('.js-goSearchMobile');
const loadMoreSelectionsBtnNode = document.querySelector('.js-loadMoreSelections');
const cartNode = document.querySelector('.js-cart');
const collapseNodes = document.querySelectorAll('.js-collapse');
const autoSizeInputNodes = document.querySelectorAll('.js-autoSizeInput');
const largeImgNodes = document.querySelectorAll('.js-largeImg');
const addReviewFormNode = document.querySelector('.js-addReviewForm');
const fillUpAddReviewFromNode = document.querySelector('.js-fillUpAddReviewFrom');
const commentProductFormNode = document.querySelector('.js-commentProductForm');
const gamePageNode = document.querySelector('.js-gamePage');
const modalMessageNode = document.querySelector('.js-modalMessage');
const acceptAgreementNode = document.querySelector('.js-acceptAgreement');
const blogPageNode = document.querySelector('.js-blogPage');
const loadMoreFillUpReviewsBtnNode = document.querySelector('.js-loadMoreFillUpReviewsBtn');
const listFillUpReviewsNode = document.querySelector('.js-filUpReviewsList');
const loadMoreReviewsBtnNode = document.querySelector('.js-loadMoreReviewsBtn');
const reviewsListNode = document.querySelector('.js-reviewsList');
const loadMoreRatingNode = document.querySelector('.js-loadMoreRating');
const loadModeProductReviewsNode = document.querySelector('.js-loadModeProductReviews');
const listRatingNode = document.querySelector('.js-listRating');
const restorePasswordFormNode = document.querySelector('.js-restorePasswordForm');
const fillUpSteamFrom = document.querySelector('.js-fillUpSteamFrom');
const counterAnimationNodes = document.querySelectorAll('.js-counterAnimation');
const openCompoundOrderNodes = document.querySelectorAll('.js-openCompoundOrder');
const openAboutHomeModalNode = document.querySelector('.js-openAboutHomeModal');
const openDescriptionSplitCatalogNode = document.querySelector('.js-openDescriptionSplitCatalog');
const addInFavoritesProductPageNode = document.querySelector('.js-addInFavoritesProductPage');
const showAboutAsHomeNode = document.querySelector('.js-showAboutAsHome');
const successPaymentNode = document.querySelector('.js-successPayment');
const mobileCartLinkNode = document.querySelector('.js-mobileCartLink');
const fastSelect = document.querySelector('.js-fastSelect');
const reloadCheckFillUpStatusNode = document.querySelector('.js-reloadCheckFillUpStatus');
const buyTurkeyPage = document.querySelector('.js-buyTurkeyPage');
const popupController = new PopupController([
    {
        id: 'loginForm',
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
        id: 'searchResultsContainer',
        popupSelector: '.js-searchResultsContainer',
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
    //     children: [
    //         {
    //             id: 'priceParamsCatalog',
    //             btnSelector: '.js-openPriceParams',
    //             closeBtnSelector: '.js-closePriceParams',
    //             popupSelector: '.js-priceParams',
    //         },
    //         {
    //             id: 'sortParamsCatalog',
    //             btnSelector: '.js-openSortParams',
    //             closeBtnSelector: '.js-closeSortParams',
    //             popupSelector: '.js-sortParams',
    //         },
    //         {
    //             id: 'categoriesParamsCatalog',
    //             btnSelector: '.js-openCategoriesParams',
    //             closeBtnSelector: '.js-closeCategoriesParams',
    //             popupSelector: '.js-categoriesParams',
    //         },
    //         {
    //             id: 'categoriesParamsCatalog',
    //             btnSelector: '.js-openCategoriesParams',
    //             closeBtnSelector: '.js-closeCategoriesParams',
    //             popupSelector: '.js-categoriesParams',
    //         },
    //         {
    //             id: 'genresParamsCatalog',
    //             btnSelector: '.js-openGenresParams',
    //             closeBtnSelector: '.js-closeGenresParams',
    //             popupSelector: '.js-genresParams',
    //         },
    //         {
    //             id: 'activationParamsCatalog',
    //             btnSelector: '.js-openActivationParams',
    //             closeBtnSelector: '.js-closeActivationParams',
    //             popupSelector: '.js-activationParams',
    //         },
    //     ],
    },
]);
const headerNode = document.querySelector('.js-header');

const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;
const topGap = headerNode.getBoundingClientRect().height + 10;

let yaClientId;

if (window.yaCounter69707947?.getClientID) {
    yaClientId = yaCounter69707947.getClientID()
}

document.addEventListener('scroll', () => {
    window.scrollY > 50 ? headerNode.classList.add('fixed') : headerNode.classList.remove('fixed')
})

mobileCartLinkNode && mobileCartLinkNode.addEventListener('transitionend', () => {
    mobileCartLinkNode.classList.remove('adding');
})

promptProductNodes.forEach(promptProductNode => {
    const coordinates = promptProductNode.getBoundingClientRect();

    if (coordinates.left < 15) {
        promptProductNode.classList.remove('left')
        promptProductNode.classList.add('right')
    } else if (coordinates.right + 15 > windowWidth) {
        promptProductNode.classList.add('left')
        promptProductNode.classList.remove('right')
    }
})

if (successPaymentNode) {
    const closeSuccessPaymentNode = successPaymentNode.querySelector('.js-closeSuccessPayment');

    closeSuccessPaymentNode && closeSuccessPaymentNode.addEventListener('click', () => {
        successPaymentNode.remove();
    })
}

reloadCheckFillUpStatusNode && reloadCheckFillUpStatusNode.addEventListener('click', () => {
    document.location.reload();
})

showAboutAsHomeNode && showAboutAsHomeNode.addEventListener('click', () => {
    const aboutUsContentHomeNode = document.querySelector('.js-aboutUsContentHome');
    let action = 'add';

    if (showAboutAsHomeNode.classList.contains('active')) {
        action = 'remove';
    }

    aboutUsContentHomeNode.classList[action]('active');
    showAboutAsHomeNode.classList[action]('active');
})

openAboutHomeModalNode && openAboutHomeModalNode.addEventListener('click', () => {
    const aboutHomeModalNode = document.querySelector('.js-aboutHomeModal');

    if (!aboutHomeModalNode) {
        return;
    }

    const aboutHomeModalCloseNode = document.querySelector('.js-aboutHomeModalClose');

    aboutHomeModalNode.classList.add('active');
    document.querySelector('body').classList.add('noScrolling');

    aboutHomeModalCloseNode.addEventListener('click', () => {
        aboutHomeModalNode.classList.remove('active');
        document.querySelector('body').classList.remove('noScrolling');
    })
});

openDescriptionSplitCatalogNode && openDescriptionSplitCatalogNode.addEventListener('click', () => {
    const descriptionSplitCatalogNode = document.querySelector('.js-descriptionSplitCatalog');

    if (!descriptionSplitCatalogNode) {
        return;
    }

    const descriptionSplitCatalogCloseNode = document.querySelector('.js-descriptionSplitCatalogClose');

    descriptionSplitCatalogNode.classList.add('active');

    descriptionSplitCatalogCloseNode.addEventListener('click', () => {
        descriptionSplitCatalogNode.classList.remove('active');
    })
})

openCompoundOrderNodes.forEach(item => {
    item.addEventListener('click', () => {
        const compoundNode = document.querySelector(`.js-compoundOrder-${item.dataset.compund}`);
        let action;

        compoundNode.classList.contains('active') ? action = 'remove' : action = 'add';

        item.classList[action]('active');
        compoundNode.classList[action]('active');
    })
})

counterAnimationNodes.forEach(counterAnimationNode => {
  const offsetTop = counterAnimationNode.getBoundingClientRect().top;
  const height = counterAnimationNode.getBoundingClientRect().height;
  const animate = () => {
    const count = parseInt(counterAnimationNode.innerText);
    const step = count >= 50 ? Math.floor(count / 50) : 1;

    counterAnimationNode.innerText = 0;
    counterAnimationNode.classList.add('active');

    const int = setInterval(() => {
      const currentValue = parseInt(counterAnimationNode.innerText);

      if (currentValue < count) {
        return counterAnimationNode.innerText = currentValue + step <= count ? currentValue + step : count;
      }

      clearInterval(int);
    }, 50);
  }
  let handler;
  let active = false;

  if (offsetTop < topGap) {
    handler = () => {
      const offsetTop = counterAnimationNode.getBoundingClientRect().top;

      if (!active && offsetTop >= topGap) {
        document.removeEventListener('scroll', handler);
        animate();
      }
    }
  } else if (offsetTop > windowHeight - height) {
    handler = () => {
      const offsetTop = counterAnimationNode.getBoundingClientRect().top;

      if (!active && offsetTop <= windowHeight - height) {
        document.removeEventListener('scroll', handler);
        animate();
      }
    }
  } else {
    active = true;
    animate();
  }

  if (active) {
    return;
  }

  document.addEventListener('scroll', handler)
})

if (buyTurkeyPage) {
    const emailVerifiedBuyTurkey = buyTurkeyPage.querySelector('.js-emailVerifiedBuyTurkey');
    const paymentSubmit = buyTurkeyPage.querySelector('.js-paymentSubmit');
    const switchCards = buyTurkeyPage.querySelectorAll('.js-switch-card');
    const selectedPrice = buyTurkeyPage.querySelector('.js-selectedPrice');
    const selectedValue = buyTurkeyPage.querySelector('.js-selectedValue');
    const paymentForm = buyTurkeyPage.querySelector('.js-paymentForm');
    const paymentErrorMessage = buyTurkeyPage.querySelector('.js-paymentErrorMessage');

    new AsyncForm({
        mainNode: paymentForm,
        resultMessageNode: paymentErrorMessage,
        successHandler: (sendParams, results) => window.open(results.link, '_self'),
    });

    switchCards.forEach(switchCard => {
        switchCard.addEventListener('change', () => {
            const price = switchCard.nextElementSibling.querySelector('.js-price');
            const value = switchCard.nextElementSibling.querySelector('.js-value');

            selectedPrice.innerText = price.innerText;
            selectedValue.innerText = value.innerText;
        })
    });

    if (emailVerifiedBuyTurkey) {
        const submit = emailVerifiedBuyTurkey.querySelector('.js-submit');
        const emailForTurkey = emailVerifiedBuyTurkey.querySelector('.js-emailForTurkey');
        const verificationCodeField = emailVerifiedBuyTurkey.querySelector('.js-verificationCodeField');
        const verificationCodeFieldFrame = emailVerifiedBuyTurkey.querySelector('.js-verificationCodeFieldFrame');
        const message = emailVerifiedBuyTurkey.querySelector('.js-message');

        message.classList.add('error');

        submit.addEventListener('click', async () => {
            const step = emailVerifiedBuyTurkey.dataset.step.toString();

            switch (step) {
                case '1': {
                    submit.innerText = 'Отправка кода...';

                    const responseCode = await postman.post("/api/users/get-code", {
                        email: emailForTurkey.value,
                    });

                    const result = await responseCode.json();

                    if (responseCode.status >= 400) {
                        if (result.message.toLowerCase() === 'authorized') {
                            document.location.reload()
                        }

                        if (result.message.toLowerCase() === 'invalid email') {
                            message.innerText = 'Некорректный E-mail'
                        }

                        return submit.innerText = 'Отправить код';
                    }

                    emailForTurkey.setAttribute("readonly", '');
                    verificationCodeFieldFrame.style.display = 'block';
                    verificationCodeField.setAttribute('required', '');
                    submit.innerText = 'Подтвердить';
                    emailVerifiedBuyTurkey.dataset.step = '2';
                    message.innerText = '';

                    break;
                }
                case '2': {
                    submit.innerText = 'Проверка кода...';

                    const confirmResponse = await postman.post('/api/users/confirm-code', {
                        email: emailForTurkey.value,
                        code: verificationCodeField.value,
                    });

                    const confirmResult = await confirmResponse.json();

                    if (confirmResponse.status >= 400) {
                        if (confirmResult.message.toLowerCase() === 'invalid code') {
                            message.innerText = 'Неверный код';
                        }

                        return submit.innerText = 'Подтвердить';
                    }

                    verificationCodeFieldFrame.remove();
                    submit.remove();

                    message.classList.remove('error');
                    message.innerText = 'E-mail подтвержден';
                    paymentSubmit.removeAttribute('disabled');

                    break;
                }
            }
        })
    }
}

loadMoreSelectionsBtnNode && loadMoreSelectionsBtnNode.addEventListener('click', async () => {
    const skip = parseInt(loadMoreSelectionsBtnNode.dataset.skip || 4);
    const delistSelection = loadMoreSelectionsBtnNode.dataset.delistSelection || '';
    const selectionsNode = document.querySelector('.js-selections');

    if (!selectionsNode) {
        return;
    }

    const response = await postman.get(`${websiteAddress}api/selections?skip=${skip}&delistSelection=${delistSelection}`);
    const result = await response.json();

    if (!result.success) {
        return;
    }

    result.selections.forEach((selection, index) => {
        selectionsNode.innerHTML += `
            <a href="${websiteAddress}selections/${selection.alias}" title="Перейти на страницу подборки ${selection.name}" class="selection">
                <img src="${websiteAddress}${selection.img}" class="selectionImg" loading="lazy" alt="Изображение подборки товаров ${selection.name}" title="Изображение подборки товаров ${selection.name}">
                <div class="selectionInfo">
                    <div class="selectionName">${selection.name}</div>
                    <div class="selectionCountProducts">Игр в подборке: ${selection.products.length}</div>
                </div>
            </a>
        `;
    });

    if (result.isLast) {
        return loadMoreSelectionsBtnNode.remove();
    }

    loadMoreSelectionsBtnNode.dataset.skip = skip + 4;
});

loadMoreRatingNode && loadMoreRatingNode.addEventListener('click', async () => {
    const skip = parseInt(loadMoreRatingNode.dataset.skip);

    const response = await postman.get(`${websiteAddress}api/users?skip=${skip}`);
    const result = await response.json();

    if (result.email) {
        return;
    }

    result.users.forEach((user, index) => {
        listRatingNode.innerHTML += `
      <a href="${websiteAddress}rating/${user.login}" class="item">
          <div class="position">${skip + index + 1} \\ ${result.countUsers}</div>
          <div class="name">${user.login}</div>
          <div class="rating">${user.rating}</div>
      </a>
    `;
    });

    if (result.isLast) {
        return loadMoreRatingNode.remove();
    }

    loadMoreRatingNode.dataset.skip = parseInt(loadMoreRatingNode.dataset.skip) + 20;
});

loadModeProductReviewsNode && loadModeProductReviewsNode.addEventListener('click', async () => {
    const skip = parseInt(loadModeProductReviewsNode.dataset.skip);
    const productId = loadModeProductReviewsNode.dataset.productId;
    const listReviewsNode = document.querySelector('.js-listProductReviews');

    if (!listReviewsNode) {
        return;
    }

    const response = await postman.get(`${websiteAddress}api/reviews?skip=${skip}&targetId=${productId}&target=Product`);
    const result = await response.json();

    if (result.email) {
        return;
    }

    result.reviews.forEach(review => {
        listReviewsNode.innerHTML += `
      <div class="item review">
          <div class="head">
              <a class="btn link userName" href="${ websiteAddress }rating/${ review.user.login }" title="Перейти на страницу ${ review.user.login }">${ review.user.login }</a>
          </div>
          <div class="grade">
              <span class="icon icon-star${ review.eval >= 1 ? 'Fill' : '' }"></span>
              <span class="icon icon-star${ review.eval >= 2 ? 'Fill' : '' }"></span>
              <span class="icon icon-star${ review.eval >= 3 ? 'Fill' : '' }"></span>
              <span class="icon icon-star${ review.eval >= 4 ? 'Fill' : '' }"></span>
              <span class="icon icon-star${ review.eval >= 5 ? 'Fill' : '' }"></span>
          </div>
          <div class="text">${ review.text }</div>
      </div>
    `;
    });

    if (result.isLast) {
        return loadModeProductReviewsNode.remove();
    }

    loadModeProductReviewsNode.dataset.skip = parseInt(loadModeProductReviewsNode.dataset.skip) + 5;
})

loadMoreFillUpReviewsBtnNode && loadMoreFillUpReviewsBtnNode.addEventListener('click', async () => {
    const skip = parseInt(loadMoreFillUpReviewsBtnNode.dataset.skip);

    const response = await postman.get(`${websiteAddress}api/reviews?skip=${skip}&target=FillUpSteam`);
    const result = await response.json();

    if (result.email) {
        return;
    }

    result.reviews.forEach(review => {
        listFillUpReviewsNode.innerHTML += `
      <div class="item review">
          <div class="head">
              <a class="btn link userName" href="${ websiteAddress }rating/${ review.user.login }" title="Перейти на страницу ${ review.user.login }">${ review.user.login }</a>
          </div>
          <div class="grade">
              <span class="icon icon-star${review.eval >= 1 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${review.eval >= 2 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${review.eval >= 3 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${review.eval >= 4 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${review.eval >= 5 ? 'Fill' : ''}"></span>
          </div>
          <div class="text">${review.text}</div>
      </div>
    `;
    });

    if (result.isLast) {
        return loadMoreFillUpReviewsBtnNode.remove();
    }

    loadMoreFillUpReviewsBtnNode.dataset.skip = parseInt(loadMoreFillUpReviewsBtnNode.dataset.skip) + 5;
})

loadMoreReviewsBtnNode && loadMoreReviewsBtnNode.addEventListener('click', async () => {
    const skip = parseInt(loadMoreReviewsBtnNode.dataset.skip);

    const response = await postman.get(`${websiteAddress}api/reviews?skip=${skip}&target=Product`);
    const result = await response.json();

    if (result.email) {
        return;
    }

    result.reviews.forEach(review => {
        reviewsListNode.innerHTML += `
      <div class="review">
          <div class="head">
              <a class="btn link userName" href="${ websiteAddress }rating/${ review.user.login }" title="Перейти на страницу ${ review.user.login }">${ review.user.login }</a>
              <div class="forGame">Отзыв на игру: <a class="link gameName" href="${ websiteAddress }games/${ review.targetId.alias }">${ review.targetId.name }</a></div>
          </div>
          <div class="grade">
              <span class="icon icon-star${review.eval >= 1 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${review.eval >= 2 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${review.eval >= 3 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${review.eval >= 4 ? 'Fill' : ''}"></span>
              <span class="icon icon-star${review.eval >= 5 ? 'Fill' : ''}"></span>
          </div>
          <div class="text">${review.text}</div>
      </div>
    `;
    });

    if (result.isLast) {
        return loadMoreReviewsBtnNode.remove();
    }

    loadMoreReviewsBtnNode.dataset.skip = parseInt(loadMoreReviewsBtnNode.dataset.skip) + 5;
});

if (largeImgNodes.length) {
    largeImgNodes.forEach((item, index) => {
        item.addEventListener('click', () => {
            new Modal({
                switching: true,
                elems: Object.values(largeImgNodes).map(item => {
                    const newTargetImgNode = item.querySelector('.js-targetImg').cloneNode(true);

                    newTargetImgNode.classList.add('enlargedImg');

                    return newTargetImgNode;
                }),
                activeIndex: index,
            });
        })
    })
}

whereLoginNode && whereLoginNode.addEventListener('click', () => {
    document.body.classList.add('noScrolling');

    fillUpPageModalNode.classList.add('active');
})

howToGetLoginNode && howToGetLoginNode.addEventListener('click', () => {
    document.body.classList.add('noScrolling');

    fillUpPageModalNode.classList.add('active');
})

fillUpPageModalNode && fillUpPageModalNode.querySelector('.js-closeFillUpPageModal').addEventListener('click', () => {
    document.body.classList.remove('noScrolling');

    fillUpPageModalNode.classList.remove('active');
})

inputFrameNodes.forEach(inputFrameNode => {
    inputFrameNode.addEventListener('input', (e) => {
        if (e.target.value === '') {
            return inputFrameNode.classList.remove('active');
        }

        inputFrameNode.classList.add('active');
    })
});

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

        subscribeInStockBtnNode.addEventListener('click', async () => {
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

        if (mobileCartLinkNode) {
            !mobileCartLinkNode.classList.contains('active') && mobileCartLinkNode.classList.add('active');
            mobileCartLinkNode.classList.add('adding');
        }
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
            const listReviewsNode = document.querySelector('.js-listProductReviews');
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

if (fillUpAddReviewFromNode) {
    new AsyncForm({
        mainNode: fillUpAddReviewFromNode,
        successHandler: (params) => {
            const userName = listFillUpReviewsNode.dataset.userName;
            const review = document.createElement('div');

            review.classList.add('item review');
            fillUpAddReviewFromNode.remove();

            review.innerHTML = `
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
            `;

            listFillUpReviewsNode.prepend(review);
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
        const formConfirm = checkNode.querySelector(".form-confirm_email")
        let demandConfirm = !!formConfirm
        let savingValue = +savingValueNode.innerText;
        let countProducts = productNodes.length;
        let totalPriceToValue = +totalPriceToNode.innerText;
        let totalPriceFromValue = +totalPriceFromNode.innerText;
        let our_products = payBtnNode.dataset.products.split(',')
        if (!!our_products.length) {
            let _ = []
            for (let i of our_products) {
                if (!!i) _.push(i)
            }
            our_products = _
        }
        let products = {
            digiSeller: [],
            iceGame: []
        }

        function popUpPayment() {
            let parent = document.createElement("div")
            parent.classList.add("popup_payment_wrap")
            parent.setAttribute('id', 'popup-payment-cart')
            let content = '' +
                '<div class="popup_payment-content">' +
                '<p class="popup_payment-title">Корзина</p>' +
                '<p class="popup_payment-text">В связи с нагрузкой на платежную систему нам пришлось разделить Вашу покупку на 2 этапа. За оплату первого из которых мы берем всю комиссию платежной системы на себя. Спасибо за понимание!</p>' +
                '<div class="popup_payment-steps">' +
                '<div class="payment-step payment-step-active" data-step="1" data-sale="5">1</div>' +
                '<div class="payment-step-line"></div>' +
                '<div class="payment-step" data-step="2">2</div>' +
                '</div>' +
                '<div class="popup_payment-product mobileScroll">';

                let [prd, ourPrice] = getProduct(products.iceGame)
                content += prd

                content += '' +
                '</div>' +
                '<div class="popup_payment-price">' +
                '<p class="payment_price-to">' + ourPrice + '₽</p>' +
                '</div>' +
                '<button class="popup_payment-pay" data-step="1">Оплатить</button>'
            content += '</div>'
            parent.innerHTML = content
            return parent
        }

        function getProduct(products) {
            let prd = ''
            let ourPrice = 0

            for (let i of products) {
                if (typeof i !== 'string') i = i.productId
                let el = document.querySelector(`.js-product[data-product-id="${i}"]`)
                let title = el.querySelector('.main .top .name')
                let price = el.querySelector(".main .top .toPrice")
                let img = el.querySelector('.img')
                title = title?.textContent || ''
                price = parseFloat(price?.textContent) || 0
                img = img?.src || ''
                ourPrice += price
                prd += `
                    <div class="cardGame">
                        <div class="head">
                            <img class="img" src="${img}" loading="lazy">
                            <div class="name">${title}</div>
                        </div>
                        <div class="price">
                            <div class="toPrice">
                                <span class="value">${price}</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            return [prd, ourPrice]
        }

        function createPopupPayment(openPayment) {
            let pop = popUpPayment()
            let payment_button = pop.querySelector(".popup_payment-pay")

            pop.onclick = function () {
                this.remove()
                document.body.classList.remove('noScrolling')
            }

            pop.firstElementChild.onclick = function (e) {
                e.stopPropagation()
            }

            payment_button.onclick = () => openPayment(payment_button)

            document.body.append(pop)
            document.body.classList.add('noScrolling')

            return pop
        }

        if (countProducts) {
            // Confirm
            if (demandConfirm) {
                formConfirm.addEventListener("submit", async function (e) {
                    e.preventDefault();
                    let {email, code} = this.elements
                    let step = this.dataset.step ||'1'
                    let btn = this.querySelector("button")
                    switch (step) {
                        case '1':
                            btn.textContent = 'Отправка кода...'
                            let getCode = await postman.post("/api/users/get-code", {
                                email: email.value
                            })
                            let data = await getCode.json()
                            if (getCode.status >= 400) {
                                // Out error message
                                if (data.message.toLowerCase() === 'authorized') document.location.reload()
                                console.error(data)
                                return;
                            }
                            email.setAttribute("readonly", '')
                            email.style.display = 'none'
                            code.hidden = false
                            code.parentElement.style.display = 'initial'
                            code.setAttribute('required', '')
                            btn.textContent = 'Подтвердить'
                            this.setAttribute("data-step", '2')
                            break
                        case '2':
                            btn.textContent = 'Идет подтверждение...'
                            let confirmCode = await postman.post('/api/users/confirm-code', {
                                email: email.value,
                                code: code.value
                            })
                            if (btn.classList.contains('error')) btn.classList.remove('error')
                            let confirmData = await confirmCode.json()
                            if (confirmCode.status >= 400) {
                                //Out error message
                                let {message} = confirmData
                                if (message.toLowerCase() === 'invalid code') {
                                    btn.nextElementSibling.textContent = 'Неверный код'
                                }
                                btn.textContent = 'Подтвердить'
                                btn.classList.add('error')
                                console.error(confirmCode)
                                return
                            }
                            email.style.display = 'block'
                            btn.classList.add('no-active')
                            // formConfirm.nextElementSibling.firstElementChild.textContent = 'Почта подтверждена'
                            // formConfirm.nextElementSibling.classList.add("color-blue")
                            // formConfirm.nextElementSibling.lastElementChild.style.display = 'inline'
                            code.parentElement.style.display = 'none'
                            // btn.parentElement.style.display = 'none'
                            btn.nextElementSibling.textContent = ''
                            btn.textContent = 'Почта подтверждена'

                            //email.parentElement.classList.add("confirmed-code")
                            demandConfirm = false
                            if (payBtnNode.classList.contains('no-active')) payBtnNode.classList.remove('no-active')
                            this.setAttribute("data-step", '3')
                            break
                    }
                })
            }

            // Payment

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

                    if (countProducts === 0) {
                        cartListNode.remove();
                        cartTitleNode.remove();

                        return cartNode.innerHTML += `
              <div class="notFound">
                <img src="${websiteAddress}img/notFound.svg" class="img" loading="lazy" alt="Иконка расстроенного смайла" title="Корзина пуста :(">
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
                    let totalPriceToValue = +totalPriceToNode.innerText;
                    let totalPriceFromValue = +totalPriceFromNode.innerText;
                    products.iceGame = products.iceGame.filter(ids=>productId!==ids)
                    products.digiSeller = products.digiSeller.filter(obj=>obj.productId!==productId)

                    totalPriceToValue -= priceTo;
                    totalPriceFromValue -= priceFrom ? priceFrom : priceTo;
                    savingValue -= priceFrom ? priceFrom - priceTo : 0;

                    totalPriceToNode.innerText = totalPriceToValue;
                    totalPriceFromNode.innerText = totalPriceFromValue;
                    totalProductsNode.innerText = countProducts;
                    savingValueNode.innerText = savingValue;

                    productNode.remove();
                })
                const dsId = productNode.dataset.dsId;
                for (let i_product of our_products  ) {
                    if (productId !== i_product) continue
                    products.iceGame.push(productId)
                    break
                }
                if (!products.iceGame.includes(productId)) products.digiSeller.push({productId, dsId})
            });
            let urlParam = new URLSearchParams(document.location.search)
            let stepId = urlParam.get("step") || '1'
            let orderId = urlParam.get("OrderId")
            if (isNaN(parseInt(stepId))) stepId = '1'
            if (parseInt(stepId) > 2) stepId = '2'
            else if (parseInt(stepId) < 1) stepId = '1'

            async function get_checkout(isTwo) {
                /*const checkNode = document.querySelector('.js-check');
                const div = document.createElement('div');

                div.innerText = 'Уважаемый клиент, в данным момент ведутся тех.работы, в связи с этим оплата картой временно не доступа. Вы можете приобрести товар в сплит или попробовать позже. Приносим свои извинения за доставленные неудобства, надеемся на Ваше понимание!'

                checkNode.append(div);
                div.style.color = '#ff669a';
                div.style.textAlign = 'center';
                div.style.marginTop = '10px';

                return;*/

                const payment = await Payment.get_method()
                let yaClientId;
                let email;

                if (!payment) {
                    return console.error('Payment method not set')
                }

                if (formConfirm) {
                    email = formConfirm.elements.email.value
                }

                const result = await payment.checkout(products.iceGame, isTwo, email, yaClientId);

                if (result.err) {
                    return;
                }

                const data = result.data;

                window.open(data.paymentUrl, '_self')
            }

            async function get_digiCheckout(products, isTwo = false) {
                const formData = new FormData();
                const changes = [];
                let dsCartId = null;

                formData.append('product_cnt', '1');
                formData.append('typecurr', 'WMR');
                formData.append('lang', 'ru-RU');

                for (const prd of products) {
                    const productId = prd.productId;
                    const productNode = document.querySelector(`.js-product[data-product-id="${productId}"]`);
                    const dsId = prd.dsId;

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
                        location.reload();

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
                        await postman.put(`/api/products/${productId}/revise`);
                        location.reload();

                      /*const priceFrom = +productNode.querySelector('.js-priceFrom').innerText;
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
                      });*/
                    }

                    if (!dsCartId) {
                        dsCartId = resultAddCartDs.cart_uid;
                        formData.set('cart_uid', dsCartId);
                    }
                }

                if (!changes.length) {
                    let email;

                    if (formConfirm) {
                        email = formConfirm.elements.email.value
                    }

                    const response = await postman.post('/api/order', {dsCartId, email});
                    const result = await response.json();

                    if (result.error) {
                        return;
                    }

                    const payFormNode = cartListNode.querySelector('.js-payForm');
                    const dsCartIdInputNodes = payFormNode.querySelectorAll('.js-dsCartId');
                    const emailFormDsNode = payFormNode.querySelector('.js-emailFormDs');

                    emailFormDsNode && (emailFormDsNode.value = email);
                    dsCartIdInputNodes.forEach(item => item.value = dsCartId);

                    return payFormNode.submit();
                }
            }

             async function openPayment(payment_button) {
                let keyStep = payment_button.dataset.step
                keyStep = keyStep || '1'
                switch (keyStep) {
                    case '1': {
                        payment_button.disabled = true;
                        await get_checkout(true);
                        payment_button.disabled = false;
                        break;
                    }
                    case '2':
                        get_digiCheckout(products.digiSeller, true)
                        break
                }
            }

            function change_step(steps, step_id, prices, product_els, payment_button) {
                let keyStep = step_id === '1' ? 'iceGame' : 'digiSeller'

                for (let i of steps.children) {
                    let sid = i.dataset.step
                    if (sid === step_id) {
                        if (!i.classList.contains('payment-step-active')) i.classList.add('payment-step-active')
                    } else if (i.classList.contains('payment-step-active')) i.classList.remove('payment-step-active')
                }

                let [prd, ourPrice] = getProduct(products[keyStep])
                let fromPrice = prices.firstElementChild
                let toPrice = prices.lastElementChild
                let line = prices.children[1]
                toPrice.textContent = ourPrice.toString() + '₽'
                fromPrice.textContent = ''
                line && line.remove()
                product_els.innerHTML = prd
                payment_button.setAttribute('data-step', step_id)
            }

            payBtnNode && payBtnNode.addEventListener('click', async () => {
                if (demandConfirm) {
                    return;
                }

                let productNodes = cartListNode.querySelectorAll('.js-product')

                if (products.iceGame.length === productNodes.length) {
                    payBtnNode.disabled = true;
                    await get_checkout(false);
                    return payBtnNode.disabled = false;
                } else if (!products.iceGame.length && !!productNodes.length) {
                    return get_digiCheckout(products.digiSeller);
                }

                let pop_up = createPopupPayment(openPayment)
                let prices = pop_up.querySelector(".popup_payment-price")
                let steps = pop_up.querySelector(".popup_payment-steps")
                let product_els = pop_up.querySelector('.popup_payment-product .tape')
                let payment_button = pop_up.querySelector(".popup_payment-pay")
                for (let step of steps.children) {
                    // Полностью рабочая но на время выключена. при желании можно включить
                    // Просьба включать после согласования в tg: https://t.me/rvoskanyan
                    break
                    let step_id = step.dataset.step
                    if (!step_id) continue
                    step.onclick = function () {
                        change_step(steps, step_id, prices, product_els, payment_button)
                    }
                }

                /*changes.forEach(item => {

                })*/
            })
        }
    }
}

fastSelect && startBind();

function startBind() {
    const items = fastSelect.querySelectorAll('.js-fastSelectItem');
    const bindField = document.querySelector(`.js-${fastSelect.dataset.bindSelector}`);
    const itemsOnValues = {};
    let currentActive;

    items.forEach(item => {
        const value = parseInt(item.innerText);

        itemsOnValues[value] = item;

        item.addEventListener('click', () => {
            bindField.value = value;
            bindField.dispatchEvent(new Event('input'))
        })
    });

    bindField.addEventListener('input', () => {
        const item = itemsOnValues[bindField.value];

        currentActive?.classList.remove('active');

        if (item) {
            item.classList.add('active');
            currentActive = item;
        }
    })
}

addInFavoritesProductPageNode && addInFavoritesProductPageNode.addEventListener('click', async (e) => {
    const addToFavoriteIconNode = addInFavoritesProductPageNode.querySelector('.js-icon');
    const productId = addInFavoritesProductPageNode.dataset.productId;

    e.preventDefault();

    if (addInFavoritesProductPageNode.classList.contains('js-active')) {
        const response = await postman.delete(`/api/products/${productId}/favorites`);
        const result = await response.json();

        if (result.error) {
            return;
        }

        addInFavoritesProductPageNode.setAttribute('title', 'Добавить товар в избранное');
        addInFavoritesProductPageNode.classList.remove('js-active');
        addToFavoriteIconNode.classList.remove('active');
        return;
    }

    const response = await postman.post(`/api/products/${productId}/favorites`);
    const result = await response.json();

    if (result.error) {
        return;
    }

    addInFavoritesProductPageNode.setAttribute('title', 'Удалить товар из избранного');
    addInFavoritesProductPageNode.classList.add('js-active');
    addToFavoriteIconNode.classList.add('active');
})

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

                addToFavoriteBtnNode.setAttribute('title', 'Добавить товар в избранное');
                addToFavoriteBtnNode.classList.remove('js-active');
                addToFavoriteIconNode.classList.remove('active');
                return;
            }

            const response = await postman.post(`/api/products/${productId}/favorites`);
            const result = await response.json();

            if (result.error) {
                return;
            }

            addToFavoriteBtnNode.setAttribute('title', 'Удалить товар из избранного');
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

            if (mobileCartLinkNode) {
                !mobileCartLinkNode.classList.contains('active') && mobileCartLinkNode.classList.add('active');
                mobileCartLinkNode.classList.add('adding');
            }
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

goSearchNode.addEventListener('click', () => {
    goSearch(searchStringNode.value)
})
goSearchMobileNode.addEventListener('click', () => {
    goSearch(mobileSearchStringNode.value)
})

mobileSearchStringNode.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.returnValue = false;
        return goSearch(mobileSearchStringNode.value);
    }
})

mobileSearchStringNode.addEventListener('input', async () => {
    const response = await postman.get(`${websiteAddress}api/products`, {
        searchString: mobileSearchStringNode.value,
        limit: 7,
        platform,
    });
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
        searchResultNode.append(getProductCardNode({
            ...product,
            isAuth: result.isAuth,
            size: 'small',
        }));
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

searchStringNode.addEventListener('keypress', async (e) => {
    if (catalogNode) {
        return;
    }

    if (e.key === 'Enter') {
        e.returnValue = false;
        return goSearch(searchStringNode.value);
    }
})

searchStringNode.addEventListener('input', async (e) => {
    if (catalogNode) {
        return;
    }

    popupController.activateById('searchResultsContainer');

    const response = await postman.get(`${websiteAddress}api/products`, {
        searchString: searchStringNode.value,
        limit: 7,
        platform,
    });
    const result = await response.json();
    const searchResultNode = document.querySelector('.js-searchResult');

    if (result.error) {
        return;
    }

    if (result.products?.length === 0) {
        return searchResultNode.innerHTML = '<p style="color: #fff">Ни чего не найдено</p>';
    }

    searchResultNode.innerHTML = '';

    result.products.forEach(product => {
        searchResultNode.append(getProductCardNode({
            ...product,
            isAuth: result.isAuth,
            size: 'small',
        }));
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
        switchingTime: 12000,
        isTrack: true,
        countSlidesScroll: 1
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
        videoNode.setAttribute('src', `${websiteAddress}${videoName}`);

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
                videoNode.setAttribute('src', `${websiteAddress}${videoName}`);
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
        navigate: true,
        progressNavigate: true,
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
        videoNode.setAttribute('src', `${websiteAddress}${videoName}`);

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
                videoNode.setAttribute('src', `${websiteAddress}${videoName}`);
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

            if (mobileCartLinkNode) {
                !mobileCartLinkNode.classList.contains('active') && mobileCartLinkNode.classList.add('active');
                mobileCartLinkNode.classList.add('adding');
            }
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
        isTrack: true,
        countSlidesScroll: 1,
        switchingTime: 5000,
        infinity: true,
    });
}

if (gameGallerySliderNode) {
    new Slider({
        mainNode: gameGallerySliderNode,
        isTrack: true,
        countSlidesScroll: 1,
        switchingTime: 6000,
    });
}

if (productsFromArticleSliderNode) {
    new Slider({
        mainNode: productsFromArticleSliderNode,
        isTrack: true,
        countSlidesScroll: 1,
        switchingTime: 300000,
    });
}

if (gameInfoTabsNode) {
    new Tabs({
        mainNode: gameInfoTabsNode,
    });
}

if (gameInfoSystemParamsNode) {
    new Tabs({
        mainNode: gameInfoSystemParamsNode,
    });
}

if (feedbackProductTabsNode) {
    new Tabs({
        mainNode: feedbackProductTabsNode,
    });
}

if (fillUpInfoTabs) {
    new Tabs({
        mainNode: fillUpInfoTabs,
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

            new Modal({contentNode: iframe});
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
            <img class="img" src="${websiteAddress}${article.img}" loading="lazy" alt="Изображение записи в блоге - ${article.name}">
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
  const priceFromNode = catalogNode.querySelector('.priceBlockControls .priceFrom');
  const priceToNode = catalogNode.querySelector('.priceBlockControls .priceTo');
  const filterSearchNodes = catalogNode.querySelectorAll('.searchBlock .search');
  const filterShowMoreNodes = catalogNode.querySelectorAll('.showMore');
  const filterShowLessNodes = catalogNode.querySelectorAll('.showLess');
  const filterNode = catalogNode.querySelector('.js-filter');
  const sortSelectNode = catalogNode.querySelector('.sortSelect');
  const catalogListNode = catalogNode.querySelector('.js-catalogList');
  const countLoad = catalogListNode.dataset.loadLimit;
  const checkbox = [...filterNode.querySelectorAll('.js-checkbox')];
  const offsetTop = catalogListNode.getBoundingClientRect().top;
  const height = catalogListNode.getBoundingClientRect().height;
  const startPage = +catalogListNode.dataset.currentPage;
  const sectionName = catalogNode.dataset.sectionName;
  const sectionType = catalogNode.dataset.sectionType;
  const pageObjects = Array.from(catalogListNode.querySelectorAll('.js-page')).map(item => ({
    node: item,
    loaded: true,
    num: startPage,
  }));

  let currentPage = startPage;
  let priceRangeObject;
  let loading = false;

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (startPage > 1) {
    for (let i = 1; i < startPage; i++) {
      const pageNode = document.createElement('div');

      pageNode.classList.add('gameGrid', 'js-page');

      for (let j = 1; j <= 20; j++) {
        pageNode.innerHTML += `
          <div class="cardGame cardGame-frame">
            <div class="head elem">
              <div class="img"></div>
              <div class="name elem"></div>
            </div>
            <div class="price">
              <div class="toPrice elem"></div>
              <div class="fromPrice elem"></div>
            </div>
          </div>
        `;
      }

      catalogListNode.prepend(pageNode);
      pageObjects.unshift({
        node: pageNode,
        loaded: false,
        num: startPage - i,
      })
    }

    scrollToActive();
  } else {
    initialCatalogListeners();
  }

  if (offsetTop + height + 100 < windowHeight) {
    loadMore().then();
  }

  searchStringNode.addEventListener('input', () => {
    const url = new URL(window.location.href);
    const value = searchStringNode.value;

    url.searchParams.set('searchString', value);

    if (!value.length) {
      url.searchParams.delete('searchString');
    }

    history.pushState(null, null, url);
    catalogNode.dispatchEvent(new Event('changeParams'));
  });

  function getValueWithMinMax(value) {
      let result = value
      const min = parseInt(priceFromNode.dataset.min)
      const max = parseInt(priceToNode.dataset.max)
      if (result < min) {
          result = min
      }
      if (result > max) {
          result = max
      }

      return result
  }

  priceFromNode.addEventListener(
      'input',
      debounce(() => {
          let value = getValueWithMinMax(parseInt(priceFromNode.value))
          if (isNaN(value)) {
              value = parseInt(priceFromNode.dataset.max)
          }
          priceFromNode.value = value.toString()
          let anotherValue = parseInt(priceToNode.value)
          if (anotherValue < value) {
              anotherValue = parseInt(priceToNode.dataset.max)
              priceToNode.value = anotherValue.toString()
          }
          setPriceRange([value, anotherValue])
      }, 500)
  )

  priceToNode.addEventListener(
      'input',
      debounce(() => {
          let value = getValueWithMinMax(parseInt(priceToNode.value))
          if (isNaN(value)) {
              value = parseInt(priceToNode.dataset.max)
          }
          priceToNode.value = value.toString()
          let anotherValue = parseInt(priceFromNode.value)
          if (anotherValue > value) {
              anotherValue = parseInt(priceFromNode.dataset.min)
              priceFromNode.value = anotherValue.toString()
          }
          setPriceRange([anotherValue, value])
      }, 500)
  )

  function setPriceRange(values) {
    const url = new URL(window.location.href);
    let min = values[0];
    let max = values[1]

    if (min > max) {
      max = min;
      min = values[1];
    }

    url.searchParams.set('priceFrom', min);
    url.searchParams.set('priceTo', max);

    history.pushState(null, null, url);
    catalogNode.dispatchEvent(new Event('changeParams'));
  }

  filterSearchNodes.forEach(item => {
      item.addEventListener('input', () => {
          let container = item.closest('.block');

          let visibleCheckboxes = 0
          container.querySelectorAll('.checkbox').forEach(checkbox => {
              if (checkbox.querySelector('.label').innerHTML.toLowerCase().includes(item.value.toLowerCase())) {
                  visibleCheckboxes++
                  checkbox.style.display = ''
              }
              else {
                  checkbox.style.display = 'none'
              }
          })

          const elements = container.querySelector('.elements')
          if (elements.classList.contains('elementsCollapsed')) {
              if (visibleCheckboxes <= 5) {
                  container.querySelector('.showMore').style.display = 'none'
              }
              else {
                  container.querySelector('.showMore').style.display = ''
              }
          }
          if (elements.classList.contains('elementsExpanded')) {
              if (visibleCheckboxes <= 5) {
                  container.querySelector('.showLess').style.display = 'none'
              }
              else {
                  container.querySelector('.showLess').style.display = ''
              }
          }
      })
  })

  filterShowMoreNodes.forEach(item => {
      item.addEventListener('click', () => {
          const elements = item.closest('.block').querySelector('.elements')
          elements.classList.remove('elementsCollapsed')
          elements.classList.add('elementsExpanded')

          item.style.display = 'none'

          const showLessButton = item.closest('.block').querySelector('.showLess')
          showLessButton.style.display = ''
      })
  })

  filterShowLessNodes.forEach(item => {
      item.addEventListener('click', () => {
          const elements = item.closest('.block').querySelector('.elements')
          elements.scrollTop = 0
          elements.classList.remove('elementsExpanded')
          elements.classList.add('elementsCollapsed')

          item.style.display = 'none'

          const showMoreButton = item.closest('.block').querySelector('.showMore')
          showMoreButton.style.display = ''
      })
  })

  sortSelectNode.addEventListener('input', () => {
      const url = new URL(window.location.href);

      const value = sortSelectNode.value
      if (value !== '--') {
        url.searchParams.set('sort', value);
      } else {
        url.searchParams.delete('sort');
      }

      history.pushState(null, null, url);
      catalogNode.dispatchEvent(new Event('changeParams'));
    });

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
          if (item[1] === inputValue && item[0] === inputName) {
            continue;
          }

          url.searchParams.append(item[0], item[1]);
        }
      }

      history.pushState(null, null, url);
      catalogNode.dispatchEvent(new Event('changeParams'));
    });
  })

  catalogNode.addEventListener('changeParams', async () => {
    const topOffset = document.querySelector('.js-header').offsetHeight;
    const targetPosition = catalogListNode.getBoundingClientRect().top;
    const offsetPosition = window.pageYOffset + targetPosition - topOffset;

    catalogListNode.innerHTML = '';
    currentPage = 1;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
    document.removeEventListener('scroll', scrollHandler);

    const url = new URL(window.location.href);
    const queryUrl = `${websiteAddress}api/products${url.search ? url.search : '?'}&platform=${platform}&limit=${countLoad}${sectionName ? `&${sectionType}=${sectionName}` : ''}`;
    const response = await postman.get(queryUrl);
    const result = await response.json();

    url.searchParams.set('page', currentPage);
    history.pushState(null, null, url);

    if (result.error) {
      return;
    }

    catalogListNode.classList.remove('notFound');

    if (!result.products.length) {
      catalogListNode.classList.add ('notFound');
      return catalogListNode.innerHTML = `
        <img class="img" src="${websiteAddress}img/notFound.svg" loading="lazy">
        <span class="text">Ничего не найдено...</span>
      `;
        }

        const pageNode = document.createElement('div');

        pageNode.classList.add('gameGrid', 'js-page');
        pageNode.dataset.pageNum = '1';

        result.products.forEach(product => {
            pageNode.append(getProductCardNode({
                ...product,
                isAuth: result.isAuth,
            }));
        });

        catalogListNode.append(pageNode);
        document.addEventListener('scroll', scrollHandler);
    });

    function initialCatalogListeners() {
        document.addEventListener('scroll', scrollHandler);
        document.addEventListener('scroll', pageActivation);
    }

    function scrollToActive() {
        const topOffset = document.querySelector('.js-header').offsetHeight;
        const targetPosition = pageObjects[pageObjects.length - 1].node.getBoundingClientRect().top;
        const offsetPosition = targetPosition - topOffset;

        scrollTo(offsetPosition, initialCatalogListeners);
    }

    async function scrollHandler() {
        const offsetTop = catalogListNode.getBoundingClientRect().top;
        const height = catalogListNode.getBoundingClientRect().height;

        if (offsetTop + height + 100 > windowHeight || loading) {
            return;
        }

        currentPage++;
        await loadMore(currentPage);
    }

    async function loadMore(page) {
        const skip = (page - 1) * countLoad;

        loading = true;

    const url = new URL(window.location.href);
    const queryUrl = `${websiteAddress}api/products${url.search ? url.search : '?'}&platform=${platform}&skip=${skip}&limit=${countLoad}${sectionName ? `&${sectionType}=${sectionName}` : ''}`;
    const response = await postman.get(queryUrl);
    const result = await response.json();
    const pageNode = document.createElement('div');

        pageNode.classList.add('gameGrid', 'js-page');
        loading = false;

        if (result.error) {
            return;
        }

        result.isLast ? document.removeEventListener('scroll', scrollHandler) : '';

        result.products.forEach(product => {
            pageNode.append(getProductCardNode({
                ...product,
                isAuth: result.isAuth,
            }));
        });

        catalogListNode.append(pageNode);
        pageObjects.push({
            node: pageNode,
            loaded: true,
            num: page,
        })

        history.pushState(null, null, url);
    }

    async function pageActivation() {
        const windowHeight = document.documentElement.clientHeight;
        const headerOffset = document.querySelector('.js-header').offsetHeight;
        const url = new URL(window.location.href);

        const activeObjects = pageObjects.filter(pageObject => {
            const topOffset = pageObject.node.getBoundingClientRect().top;
            const bottomOffset = pageObject.node.getBoundingClientRect().top + pageObject.node.getBoundingClientRect().height;

            if (
                (topOffset <= windowHeight && topOffset > headerOffset) ||
                (bottomOffset <= windowHeight && bottomOffset > headerOffset) ||
                (topOffset < headerOffset && bottomOffset > windowHeight)
            ) {
                return true;
            }
        });

        if (activeObjects.length === 1) {
            url.searchParams.set('page', activeObjects[0].num.toString());
            history.pushState(null, null, url);
        }

        for (const activeObject of activeObjects) {
            if (activeObject.loaded || loading) {
                return;
            }

            const pageNode = activeObject.node;
            const skip = (activeObject.num - 1) * countLoad;

            pageNode.querySelectorAll('.cardGame-frame').forEach(item => {
                item.classList.add('loading');
            });

            loading = true;

            setTimeout(async () => {
                const response = await postman.get(`${websiteAddress}api/products${url.search ? url.search : '?'}&platform=${platform}&skip=${skip}&limit=${countLoad}`);
                const result = await response.json();

                loading = false;

                if (result.error) {
                    return;
                }

                pageNode.innerHTML = '';

                result.products.forEach(product => {
                    pageNode.append(getProductCardNode({
                        ...product,
                        isAuth: result.isAuth,
                    }));
                });
            }, 1000)
        }
    }
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

if (restorePasswordFormNode) {
    const resultRestoreNode = document.querySelector('.js-resultRestore');

    new AsyncForm({
        mainNode: restorePasswordFormNode,
        resultMessageNode: resultRestoreNode,
        successHandler: () => {
            restorePasswordFormNode.before(resultRestoreNode);
            restorePasswordFormNode.remove();
        },
    })
}

if (fillUpSteamFrom) {
    const resultNode = fillUpSteamFrom.querySelector('.js-fillUpSubmitResult');
    const commissionNode = document.querySelector('.js-commission');
    const amountInputNode = document.querySelector('.js-amountFillUp');
    const switchCardNode = document.querySelector('.js-switch-card');
    const switchSbpNode = document.querySelector('.js-switch-sbp');
    const amountNode = document.querySelector('.js-amount');
    const amountCommissionNode = document.querySelector('.js-amount-commission');
    const totalNode = document.querySelector('.js-total');
    const rate = amountInputNode.dataset?.rate;
    const currencySymbol = rate ? '₸' : '₽';
    let commission = 21.5;
    let amount = 0;
    let amountCommission = 0;
    let total = 0;

    switchCardNode.addEventListener('change', () => {
        if (switchCardNode.checked) {
            commission = 23.5
            changeParams();
        }
    });

    switchSbpNode.addEventListener('change', () => {
        if (switchSbpNode.checked) {
            commission = 21.5;
            changeParams();
        }
    });

    amountInputNode.addEventListener('input', (e) => {
        amount = +e.target.value;
        changeParams();
    });

    function changeParams() {
        amountCommission = Math.floor(amount / 100 * commission);
        total = amountCommission + amount;

        commissionNode.innerText = `Комиссия сервиса (${commission}%)`;
        amountNode.innerText = `${amount} ${currencySymbol}`;
        amountCommissionNode.innerText = `${amountCommission} ${currencySymbol}`;
        totalNode.innerText = `${rate ? Math.floor(total * rate) : total} ₽`;
    }

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    new AsyncForm({
        mainNode: fillUpSteamFrom,
        resultMessageNode: resultNode,
        successHandler: (sendParams, results) => {
            if (results.card) {
                return window.open(results.link, '_self');
            }

            a.href = results.link;
            a.setAttribute('target', '_blank');
            a.click();

            window.open(`${websiteAddress}fill-up-steam/check-status?fillUpId=${results.fillUpId}`, '_self');
        }
    });
}

if (loginFormNode) {
    const resultLoginNode = document.querySelector('.js-resultLogin');

    new AsyncForm({
        mainNode: loginFormNode,
        resultMessageNode: resultLoginNode,
        successHandler: () => {
            if (loginFormNode.action === '/reg') {
                ym(69707947, 'reachGoal', 'registration_complete');
            }

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
        markerNode.style.top = e.offsetTop + 'px';
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

if (switchSplitNode) {
    const fullPaymentBtnNode = document.querySelector('.js-fullPayment');
    const splitPaymentBtnNode = document.querySelector('.js-splitPayment');
    const payBtnNode = document.querySelector('.js-payBtn');
    const paySplitNode = document.querySelector('.js-paySplit');
    const widgetNode = document.querySelector('.js-widget');
    const confirmEmailFormNode = document.querySelector('.js-confirmEmailForm');
    const helpTextNode = document.querySelector('.js-help-text');
    const totalProductsNode = document.querySelector('.js-totalProducts');
    const totalFromNode = document.querySelector('.js-totalFrom');
    const savingNode = document.querySelector('.js-saving');
    const totalToNode = document.querySelector('.js-totalTo');
    const splitCommission = document.querySelector('.js-splitCommission');
    const totalFullPayNode = document.querySelector('.js-totalFullPay');
    const splitPayNode = document.querySelector('.js-splitPay');
    const notAuthSplitBlockNode = document.querySelector('.js-notAuthSplitBlock');

    splitPayNode.style.display = 'none';

    if (notAuthSplitBlockNode) {
        const poAuthBtnNode = notAuthSplitBlockNode.querySelector('.js-toAuth');

        poAuthBtnNode.addEventListener('click', (e) => {
            e.stopPropagation();
            popupController.activateById('loginForm');
        })
    }

    fullPaymentBtnNode.addEventListener('click', () => {
        const products = document.querySelectorAll('.js-product');
        let total = 0;
        let discount = 0;
        let result = 0;

        payBtnNode && (payBtnNode.style.display = 'block');
        confirmEmailFormNode && (confirmEmailFormNode.style.display = 'grid');
        helpTextNode && (helpTextNode.style.display = 'block');
        totalFullPayNode && (totalFullPayNode.style.display = 'block');
        paySplitNode.style.display = 'none';
        widgetNode.style.display = 'none';
        splitCommission.style.display = 'none';
        splitPayNode.style.display = 'none';
        notAuthSplitBlockNode && (notAuthSplitBlockNode.style.display = 'none');
        splitPaymentBtnNode.classList.remove('active');
        fullPaymentBtnNode.classList.add('active');

        products.forEach(product => {
            const priceFromNode = product.querySelector('.js-priceFrom');
            const priceTo = parseFloat(product.querySelector('.js-priceTo').innerText);

            if (!product.dataset.canSplit) {
                product.classList.remove('disabled');
            }

            if (priceFromNode) {
                const priceFrom = parseFloat(priceFromNode.innerText);

                total += priceFrom;
                discount += priceFrom - priceTo;
            } else {
                total += priceTo;
            }

            result += priceTo;
        });

        totalProductsNode.innerText = products.length;
        totalFromNode.innerText = total;
        savingNode.innerText = discount;
        totalToNode.innerText = result;
    })

    splitPaymentBtnNode.addEventListener('click', () => {
        const products = document.querySelectorAll('.js-product');
        let countProducts = 0;
        let total = 0;
        let discount = 0;
        let result = 0;

        payBtnNode && (payBtnNode.style.display = 'none');
        confirmEmailFormNode && (confirmEmailFormNode.style.display = 'none');
        helpTextNode && (helpTextNode.style.display = 'none');
        totalFullPayNode && (totalFullPayNode.style.display = 'none');
        paySplitNode.style.display = 'block';
        widgetNode.style.display = 'block';
        splitPayNode.style.display = 'block';
        splitCommission.style.display = 'flex';
        notAuthSplitBlockNode && (notAuthSplitBlockNode.style.display = 'flex');
        splitPaymentBtnNode.classList.add('active');
        fullPaymentBtnNode.classList.remove('active');

        products.forEach(product => {
            if (!product.dataset.canSplit) {
                return product.classList.add('disabled');
            }

            const priceFromNode = product.querySelector('.js-priceFrom');
            const priceTo = parseFloat(product.querySelector('.js-priceTo').innerText);

            if (priceFromNode) {
                const priceFrom = parseFloat(priceFromNode.innerText);

                total += priceFrom;
                discount += priceFrom - priceTo;
            } else {
                total += priceTo;
            }

            result += Math.ceil(Math.floor(priceTo + priceTo / 100 * 6) / 4);
            countProducts++;
        })

        totalProductsNode.innerText = countProducts;
        totalFromNode.innerText = total;
        savingNode.innerText = discount;
        totalToNode.innerText = result;
    })

    paySplitNode.addEventListener('click', async () => {
        const response = await postman.post(`${websiteAddress}api/order/split`, { yaClientId });
        const result = await response.json();

        if (result.success) {
            window.open(result.paymentUrl, '_self');
        }
    })
}

if (platformSwitchNode) {
    const markerNode = platformSwitchNode.querySelector('.js-marker');
    const listBtnNodes = platformSwitchNode.querySelectorAll('.btn');
    let activeBtnNode = platformSwitchNode.querySelector('.btn.active');

    activeBtnNode && moveIndicator(activeBtnNode);

    listBtnNodes.forEach(link => {
        link.addEventListener('click', async (e) => {
            const target = e.target;

            if (target === activeBtnNode) {
                return;
            }

            moveIndicator(target);
            target.classList.add('active');
            activeBtnNode.classList.remove('active');

            activeBtnNode = target;

            setTimeout(() => {
                location.href = `${websiteAddress}${target.innerText.toLowerCase()}`;
            }, 300);
        })
    })

    function moveIndicator(target) {
        markerNode.style.left = target.offsetLeft + 'px';
        markerNode.style.width = target.clientWidth + 'px';
    }
}

if (additionsProductSliderNode) {
    new Slider({
        mainNode: additionsProductSliderNode,
        switchingTime: 3000,
        isTrack: true,
        countSlidesScroll: 1,
    });
}

if (recProductSliderNode) {
    new Slider({
        mainNode: recProductSliderNode,
        switchingTime: 5000,
        isTrack: true,
        countSlidesScroll: 1,
    });
}

if (ourChoiceSliderNode) {
    new Slider({
        mainNode: ourChoiceSliderNode,
        switchingTime: 5000,
        isTrack: true,
        countSlidesScroll: 1,
    });
}

if (articlesProductSliderNode) {
    new Slider({
        mainNode: articlesProductSliderNode,
        switchingTime: 3000,
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

function goSearch(str) {
    document.location.href = `${websiteAddress}games?searchString=${str}`;
}

new Promise(resolve => {
    const socialShare = new SocialSharing('.social-sharing-wrap[data-sharing=main]')
    let clipboardMessageSuccess = new Message('Ссылка успешно скопировано')
    let moreMessageError = new Message("Вы отменили действия")
    clipboardMessageSuccess.setStatus('success')
    moreMessageError.setStatus("error")
    socialShare.eventListener("social", function (answer) {
        window.open(answer, "_blank")
    })
    socialShare.eventListener('clipboard', function (answer) {
        clipboardMessageSuccess.show(true)
    })
    socialShare.eventListener('more', function (answer) {
        answer.catch(a => {
            moreMessageError.show(true)
        })
    })
    socialShare.init()
    resolve()
}).catch(a => console.warn(a))
