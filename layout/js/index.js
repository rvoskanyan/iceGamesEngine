import Slider from "./Slider.js";
import Tabs from "./Tabs.js";
import Modal from "./Modal.js";
import PopupController from "./PopupController.js";
import AsyncForm from "./AsyncForm.js";
import Prompt from "./Prompt.js";
import {getProductCardNode, scrollTo, urlEncodeFormData} from "./utils.js";
import Postman from "./Postman.js";
import {websiteAddress} from "./config.js";

import './../styles/index.sass';
import Range from "./Range.js";
import SocialSharing from "./lib/socialSharing.js";
import Message from "./lib/message.js";
import Payment from "./lib/payment.js";
import animate from "./lib/animate.js";

const postman = new Postman();

const profileMenuNode = document.querySelector('.js-profileMenu');
const homeSliderNode = document.querySelector('.js-homeSlider');
const recProductSliderNode = document.querySelector('.js-recProductSlider');
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
const cartNode = document.querySelector('.js-cart');
const collapseNodes = document.querySelectorAll('.js-collapse');
const autoSizeInputNodes = document.querySelectorAll('.js-autoSizeInput');
const largeImgNodes = document.querySelectorAll('.js-largeImg');
const addReviewFormNode = document.querySelector('.js-addReviewForm');
const commentProductFormNode = document.querySelector('.js-commentProductForm');
const gamePageNode = document.querySelector('.js-gamePage');
const modalMessageNode = document.querySelector('.js-modalMessage');
const acceptAgreementNode = document.querySelector('.js-acceptAgreement');
const blogPageNode = document.querySelector('.js-blogPage');
const loadMoreReviewsBtnNode = document.querySelector('.js-loadMoreReviewsBtn');
const reviewsListNode = document.querySelector('.js-reviewsList');
const loadMoreRatingNode = document.querySelector('.js-loadMoreRating');
const loadModeProductReviewsNode = document.querySelector('.js-loadModeProductReviews');
const listRatingNode = document.querySelector('.js-listRating');
const restorePasswordFormNode = document.querySelector('.js-restorePasswordForm');
const counterAnimationNodes = document.querySelectorAll('.js-counterAnimation');
const openCompoundOrderNodes = document.querySelectorAll('.js-openCompoundOrder');
const openAboutHomeModalNode = document.querySelector('.js-openAboutHomeModal');
const openDescriptionSplitCatalogNode = document.querySelector('.js-openDescriptionSplitCatalog');
const addInFavoritesProductPageNode = document.querySelector('.js-addInFavoritesProductPage');
const showAboutAsHomeNode = document.querySelector('.js-showAboutAsHome');
const successPaymentNode = document.querySelector('.js-successPayment');
const reviewPage = document.querySelector("#reviewPage")

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

const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;
const topGap = document.querySelector('.js-header').getBoundingClientRect().height + 10;

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

    const response = await postman.get(`${websiteAddress}api/reviews?skip=${skip}&productId=${productId}`);
    const result = await response.json();

    if (result.email) {
        return;
    }

    result.reviews.forEach(review => {
        listReviewsNode.innerHTML += `
      <div class="item review">
          <div class="head">
              <a class="btn link userName" href="${websiteAddress}rating/${review.user.login}" title="Перейти на страницу ${review.user.login}">${review.user.login}</a>
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
        return loadModeProductReviewsNode.remove();
    }

    loadModeProductReviewsNode.dataset.skip = parseInt(loadModeProductReviewsNode.dataset.skip) + 5;
})

loadMoreReviewsBtnNode && loadMoreReviewsBtnNode.addEventListener('click', async () => {
    const skip = parseInt(loadMoreReviewsBtnNode.dataset.skip);

    const response = await postman.get(`${websiteAddress}api/reviews?skip=${skip}`);
    const result = await response.json();

    if (result.email) {
        return;
    }

    result.reviews.forEach(review => {
        reviewsListNode.innerHTML += `
      <div class="review">
          <div class="head">
              <a class="btn link userName" href="${websiteAddress}rating/${review.user.login}" title="Перейти на страницу ${review.user.login}">${review.user.login}</a>
              <div class="forGame">Отзыв на игру: <a class="link gameName" href="${websiteAddress}games/${review.product.alias}">${review.product.name}</a></div>
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
        let fee = 0.05
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
                '<div class="popup_payment-content modalChanges">' +
                '<div class="popup_payment-logo">' +
                '<div class="popup_payment-logo_child">' +
                '<img src="/img/fullLogo.svg" width="98" alt="">' +
                '</div>' +
                '</div>' +
                '<p class="popup_payment-title">Корзина</p>' +
                '<p class="popup_payment-text">В связи с нагрузкой на платежную систему нам пришлось разделить Вашу покупку на 2 этапа. За оплату первого из которых мы дополнительно дарим Вам скидку 5%. Спасибо за понимание!</p>' +
                '<div class="popup_payment-steps">' +
                '<div class="payment-step payment-step-active" data-step="1" data-sale="5">1</div>' +
                '<div class="payment-step-line"></div>' +
                '<div class="payment-step" data-step="2">2</div>' +
                '</div>' +
                '<div class="popup_payment-product slider">' +
                '<button class="btn prev js-prevBtn">' +
                '<span class="icon-static icon-static-arrow"></span>' +
                '</button>' +
                '<div class="visibleArea js-visibleArea">' +
                '<div class="tape js-tape">'
            let [prd, ourPrice] = getProduct(products.iceGame)
            content += prd
            content += '' +
                '</div></div>' +
                '<div class="btn next js-nextBtn">' +
                '<span class="icon-static icon-static-arrow"></span>' +
                '</div>' +
                '</div>' +
                '<div class="popup_payment-price">' +
                '<p class="payment_price-from price-sale">' + ourPrice + '₽</p>' +
                '<p class="payment_price-line"></p>' +
                '<p class="payment_price-to">' + (ourPrice - ourPrice * fee) + '₽</p>' +
                '</div>' +
                '<button class="popup_payment-pay" data-step="1">Оплатить</button>'
            content += '</div>'
            parent.innerHTML = content
            return parent
        }

        function getProduct(products, is_fee = true) {
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
                let fee_price = price - price * fee
                img = img?.src || ''
                ourPrice += price
                prd += '' +
                    '<div class="payment-product slide js-slide">' +
                    '<div class="image-product">' +
                    `<img width="192" height="281" src="${img}" alt="">` +
                    '</div>' +
                    '<p class="title">' + title + '</p>' +
                    '<p class="price">' +
                    '<span class="price-to">' + (is_fee ? `${fee_price.toString()}₽` : `${price}₽`) + '</span>' +
                    '<span class="price-from price-sale">' + (is_fee ? `${price}` : '') + '</span>' +
                    '</p>' +
                    '<div class="background-effect"></div>' +
                    '</div>'
            }
            return [prd, ourPrice]
        }

        function createPopupPayment(openPayment) {
            let pop = popUpPayment()
            let old_pop = document.getElementById('popup-payment-cart')
            let payment_button = pop.querySelector(".popup_payment-pay")
            if (!!old_pop) old_pop.remove()
            pop.onclick = function () {
                this.remove()
            }
            document.body.append(pop)
            pop.firstElementChild.onclick = function (e) {
                e.stopPropagation()
            }
            pop.classList.add('active')
            payment_button.onclick = () => openPayment(payment_button)
            return pop
        }

        if (countProducts) {
            // Confirm
            if (demandConfirm) {
                formConfirm.addEventListener("submit", async function (e) {
                    e.preventDefault();
                    let {email, code} = this.elements
                    let step = this.dataset.step || '1'
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
                            formConfirm.nextElementSibling.firstElementChild.textContent = 'Почта подтверждена'
                            formConfirm.nextElementSibling.classList.add("color-blue")
                            formConfirm.nextElementSibling.lastElementChild.style.display = 'inline'
                            code.parentElement.style.display = 'none'
                            btn.parentElement.style.display = 'none'
                            btn.nextElementSibling.textContent = ''
                            btn.textContent = 'Подтверждено'
                            email.parentElement.classList.add("confirmed-code")
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
                    products.iceGame = products.iceGame.filter(ids => productId !== ids)
                    products.digiSeller = products.digiSeller.filter(obj => obj.productId !== productId)

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
                for (let i_product of our_products) {
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
                const payment = await Payment.get_method()
                let yaClientId;
                let email;

                if (!payment) {
                    return console.error('Payment method not set')
                }

                if (window.yaCounter69707947?.getClientID) {
                    yaClientId = yaCounter69707947.getClientID()
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
                formData.append('typecurr', 'wmr');
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
                    case '1':
                        get_checkout(true)
                        break
                    case '2':
                        get_digiCheckout(products.digiSeller, true)
                        break
                }
            }

            function change_step(steps, step_id, prices, product_els, payment_button, is_fee = true) {
                let keyStep = step_id === '1' ? 'iceGame' : 'digiSeller'

                for (let i of steps.children) {
                    let sid = i.dataset.step
                    if (sid === step_id) {
                        if (!i.classList.contains('payment-step-active')) i.classList.add('payment-step-active')
                    } else if (i.classList.contains('payment-step-active')) i.classList.remove('payment-step-active')
                }

                let [prd, ourPrice] = getProduct(products[keyStep], is_fee)
                let fromPrice = prices.firstElementChild
                let toPrice = prices.lastElementChild
                let line = prices.children[1]
                toPrice.textContent = is_fee ? (ourPrice - ourPrice * fee).toString() + '₽' : ourPrice.toString() + '₽'
                fromPrice.textContent = is_fee ? ourPrice.toString() + '₽' : ''
                if (!is_fee) {
                    line && line.remove()
                }
                product_els.innerHTML = prd
                payment_button.setAttribute('data-step', step_id)
                console.log(step_id, keyStep)
            }

            payBtnNode && payBtnNode.addEventListener('click', async () => {
                if (demandConfirm) {
                    return;
                }

                let productNodes = cartListNode.querySelectorAll('.js-product')

                if (products.iceGame.length === productNodes.length) {
                    return await get_checkout(false);
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
        limit: 7
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

    popupController.activateById('navigate');

    const response = await postman.get(`${websiteAddress}api/products`, {
        searchString: searchStringNode.value,
        limit: 7
    });
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
    const priceRangeNode = catalogNode.querySelector('.js-range');
    const filterNode = catalogNode.querySelector('.js-filter');
    const sortNode = catalogNode.querySelector('.js-sort');
    const catalogListNode = catalogNode.querySelector('.js-catalogList');
    const countLoad = catalogListNode.dataset.loadLimit;
    const checkbox = [...filterNode.querySelectorAll('.js-checkbox')];
    const sortBtnNodes = sortNode.querySelectorAll('.js-variant-sort');
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
    let sortActiveBtn = catalogNode.querySelector('.js-sort .js-variant-sort.active');
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

    if (priceRangeNode) {
        const min = +priceRangeNode.dataset.min;
        const max = +priceRangeNode.dataset.max;
        const firstPointValue = +priceRangeNode.dataset.firstValue;
        const secondPointValue = +priceRangeNode.dataset.secondValue;

        priceRangeObject = new Range({
            mainNode: priceRangeNode,
            min,
            max,
            points: [
                {
                    value: firstPointValue,
                    name: 'first',
                },
                {
                    value: secondPointValue,
                    name: 'second',
                },
            ],
        });
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

    priceRangeObject.addChangeListener((values) => {
        const url = new URL(window.location.href);
        let min = values[0].value;
        let max = values[1].value

        if (min > max) {
            max = min;
            min = values[1].value;
        }

        url.searchParams.set('priceFrom', min);
        url.searchParams.set('priceTo', max);

        history.pushState(null, null, url);
        catalogNode.dispatchEvent(new Event('changeParams'));
    });

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
                    if (item[1] === inputValue) {
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
        const queryUrl = `${websiteAddress}api/products${url.search ? url.search : '?'}&limit=${countLoad}${sectionName ? `&${sectionType}=${sectionName}` : ''}`;
        const response = await postman.get(queryUrl);
        const result = await response.json();

        url.searchParams.set('page', currentPage);
        history.pushState(null, null, url);

        if (result.error) {
            return;
        }

        catalogListNode.classList.remove('notFound');

        if (!result.products.length) {
            catalogListNode.classList.add('notFound');
            return catalogListNode.innerHTML = `
        <img class="img" src="${websiteAddress}img/notFound.svg">
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
        const queryUrl = `${websiteAddress}api/products${url.search ? url.search : '?'}&skip=${skip}&limit=${countLoad}${sectionName ? `&${sectionType}=${sectionName}` : ''}`;
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
                const response = await postman.get(`${websiteAddress}api/products${url.search ? url.search : '?'}&skip=${skip}&limit=${countLoad}`);
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

if (reviewPage) {
    let select_types = reviewPage.firstElementChild.firstElementChild
    let loading = reviewPage.querySelector(".loading")
    let form_feedback = document.querySelector(".reviewsPage .form__feedback-wrap form")
    new AsyncForm({
        mainNode: form_feedback,
        successHandler: (params) => {
            document.location.reload()
        }
    })

    let feedback_el = {
        game: select_types.children[0],
        review: select_types.children[1],
        selected: 'game'
    }
    load_review(feedback_el.selected)

    function get_el_review(review) {
        let {user, product, text, eval: _eval} = review
        let is_product = !!product && product._id ?
            '<p class="feedback-card__game">\n' +
            '   Отзыв на игру: <a class="link" href="{{websiteAddress}}games/{{product.alias}}">' + product.name + '</a>\n' +
            '</p>' : '<p class="feedback-card__game"></p>'
        text = text || ''
        let is_star = x => _eval >= x ? 'Fill' : ''
        let el = document.createElement('div')
        el.innerHTML = '<div class="review feedback-card" itemscope itemtype="https://schema.org/Review">\n' +
            '    <div class="feedback-card__content">\n' +
            '        <p itemprop="author" class="feedback-card__title">\n' +
            '            <a class="link userName" href="' + websiteAddress + 'rating/' + user.login + '"\n' +
            '               title="Перейти на страницу ' + user.login + '">' + user.login + '</a>\n' +
            '        </p>\n' + is_product +
            '        <p itemprop="reviewBody" class="feedback-card__text">\n' +
            text +
            '        </p>\n' +
            '    </div>\n' +
            '    <div itemprop="reviewRating"\n' +
            '         itemscope itemtype="https://schema.org/Rating"\n' +
            '         class="feedback-card__stars">\n' +
            '        <meta itemprop="worstRating" content="1">\n' +
            '        <meta itemprop="ratingValue" content="' + _eval + '">\n' +
            '        <div class="stars">\n' +
            '            <span class="icon icon-star' + is_star(1) + '"></span>\n' +
            '            <span class="icon icon-star' + is_star(2) + '"></span>\n' +
            '            <span class="icon icon-star' + is_star(3) + '"></span>\n' +
            '            <span class="icon icon-star' + is_star(4) + '"></span>\n' +
            '            <span class="icon icon-star' + is_star(5) + '"></span>\n' +
            '        </div>\n' +
            '        <meta itemprop="bestRating" content="5">\n' +
            '    </div>\n' +
            '</div>'
        return el.firstElementChild
    }

    function get_pagination(count, active) {
        let pp = document.querySelector("#pagination-review") ?? document.createElement("div") // Pagination parent
        pp.setAttribute("id", 'pagination-review')
        pp.innerHTML = ''
        for (let i = 1; i <= count; i++) {
            let v = i
            if (i === 5&&count!==5) {
                v = '...'
            }
            if (i > 5 && (count-1<5||count-1>i)) continue
            if (pp.children.length >= 8) break
            let p = document.createElement('p')
            if (i === active) {
                p.classList.add("active")
            }
            p.textContent = v
            p.onclick = function () {
                if (v === '...') return;
                load_review(feedback_el.selected, i)
            }
            pp.append(p)
        }
        reviewPage.lastElementChild.previousElementSibling.after(pp)
    }

    async function load_review(type, page = 1) {
        feedback_el.selected = type
        let reviews = await postman.get(`${websiteAddress}api/reviews/all`, {
            type, page
        })

        if (reviews.status > 299) {
            console.error('Fail load reviews')
            // Заглушка на момент создание
            // экрана для ошибки об загрузке отзывов (в дизайне готовится)
            return
        }

        reviews = await reviews.json()
        let parentReviews = reviewPage.querySelector(".reviewsList")

        async function out_review(reviews) {
            let tasks = []
            for (let review of Array.from(reviews.children)) {
                review.style.scale = 0
                review.style.opacity = 0
                tasks.push(new Promise(resolve => setTimeout(() => resolve(review.remove()), 1200)))
                await new Promise(resolve => setTimeout(() => resolve(), 400))
            }
            await Promise.all(tasks)
        }

        function in_review(reviews, parent) {
            let {reviews: review} = reviews
            for (let i of review) {
                let child = get_el_review(i)
                console.log(child)
                child.style.scale = 0
                child.style.opacity = 0
                parent.append(child)
                setTimeout(() => {
                    child.style.scale = 1
                    child.style.opacity = 1
                }, 100)
            }
        }

        await out_review(parentReviews)
        in_review(reviews, parentReviews)
        get_pagination(reviews.pages, page)
        console.log()
    }

    function setReviewSelect() {
        let margin = 0
        let width = window.screen.width > 520 ? 260 : 126
        let maxWidth = window.screen.width > 520 ? 260 : 126
        let maxMargin = window.screen.width > 520 ? 340 : 190
        let step1Margin = window.screen.width > 520 ? 245 : 120
        let duration = 700

        let gradientText = {
            from: 0,
            to: 0
        }
        if (feedback_el.review.classList.contains('active-select')) return;
        let load = loading.firstElementChild

        function step_1() {
            gradientText.from += 100 / this.count_animate
            if (width > 0) width -= maxWidth / this.count_animate
            else width = 0
            if (margin < step1Margin) margin += step1Margin / this.count_animate
            else margin = step1Margin
            load.style.marginLeft = `${margin}px`
            load.style.width = `${width}px`
            feedback_el.selected = 'our'
            if (this.is_finish) {
                load_review('our', 1)
                load.style.marginLeft = `${step1Margin}px`
                load.style.width = '0px'
                if (feedback_el.game.classList.contains('active-select')) feedback_el.game.classList.remove('active-select')
                if (!feedback_el.review.classList.contains('active-select')) feedback_el.review.classList.add('active-select')
                animate(duration, step_2)
                return;
            }

        }

        function step_2() {
            if (width < maxWidth) width += maxWidth / this.count_animate
            else width = maxWidth
            if (margin < maxMargin) margin += maxMargin / this.count_animate
            else margin = maxMargin
            load.style.marginLeft = `${margin}px`
            load.style.width = `${width}px`
            console.log(margin, width, this)
            if (this.is_finish) {
                load.style.marginLeft = `${maxMargin}px`
                load.style.width = `${maxWidth}px`
                return;
            }

        }

        animate(duration, step_1)
    }

    function setGameSelect() {
        let margin = window.screen.width > 520 ? 245 : 120
        let width = window.screen.width > 520 ? 260 : 126
        let maxWidth =  window.screen.width > 520 ? 260 : 126
        let step1Margin = window.screen.width > 520 ? 245 : 120
        let duration = 700

        if (feedback_el.game.classList.contains('active-select')) return;
        let load = loading.firstElementChild

        function step_1() {
            if (width > 0) width -= maxWidth / this.count_animate
            else width = 0
            load.style.width = `${width}px`
            if (this.is_finish) {
                load_review('game', 1)
                load.style.marginLeft = `${step1Margin}px`
                load.style.width = '0px'
                if (feedback_el.review.classList.contains('active-select')) feedback_el.review.classList.remove('active-select')
                if (!feedback_el.game.classList.contains('active-select')) feedback_el.game.classList.add('active-select')
                animate(duration, step_2)
                return;
            }

        }

        function step_2() {
            if (width < maxWidth) width += maxWidth / this.count_animate
            else width = maxWidth
            if (margin > 0) margin -= step1Margin / this.count_animate
            else margin = 0
            load.style.marginLeft = `${margin}px`
            load.style.width = `${width}px`
            if (this.is_finish) {
                load.style.marginLeft = `${0}px`
                load.style.width = `${maxWidth}px`
                return;
            }

        }

        animate(duration, step_1)
    }

    function changeSelect(el, type) {

    }

    feedback_el.game.onclick = x => setGameSelect(feedback_el.game, 'game')
    feedback_el.review.onclick = x => setReviewSelect(feedback_el.review, 'review')
}