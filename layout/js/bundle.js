/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../config.js":
/*!********************!*\
  !*** ../config.js ***!
  \********************/
/***/ ((module) => {

eval("module.exports = {\r\n  //websiteAddress: 'http://141.8.194.196:4000/',\r\n  websiteAddress: 'http://localhost:4000/',\r\n}\n\n//# sourceURL=webpack:///../config.js?");

/***/ }),

/***/ "./js/AsyncForm.js":
/*!*************************!*\
  !*** ./js/AsyncForm.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ AsyncForm)\n/* harmony export */ });\n/* harmony import */ var _Postman__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Postman */ \"./js/Postman.js\");\n\r\n\r\nclass AsyncForm {\r\n  constructor(options) {\r\n    this.mainNode = options.mainNode;\r\n    this.fields = this.mainNode.querySelectorAll('input');\r\n    this.mainNode.addEventListener('submit', this.handleSubmit);\r\n    this.messageNode = this.mainNode.querySelector('.responseMessage');\r\n    this.successHandler = options.successHandler;\r\n    \r\n    this.postman = new _Postman__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\r\n  }\r\n  \r\n  handleSubmit = async (e) => {\r\n    const params = {};\r\n    \r\n    e.preventDefault();\r\n  \r\n    this.fields.forEach(({name, value}) => {\r\n      if (typeof value === 'string' && value.length > 0) {\r\n        params[name] = value;\r\n      }\r\n    })\r\n    \r\n    const response = await this.postman.post(this.mainNode.action, params);\r\n    const result = await response.json();\r\n    \r\n    if (result.error) {\r\n      this.messageNode.classList.add('error');\r\n    } else {\r\n      this.messageNode.classList.remove('error');\r\n  \r\n      if (this.successHandler) {\r\n        this.successHandler();\r\n      }\r\n    }\r\n    \r\n    this.messageNode.innerText = result.message;\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/AsyncForm.js?");

/***/ }),

/***/ "./js/Modal.js":
/*!*********************!*\
  !*** ./js/Modal.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Modal)\n/* harmony export */ });\nclass Modal {\r\n  constructor(contentNode) {\r\n    this.body = document.querySelector('body');\r\n    this.mainNode = document.createElement('div');\r\n    this.modalContainer = document.createElement('div');\r\n    this.closeBtn = document.createElement('button');\r\n    this.modalContent = document.createElement('div');\r\n    \r\n    this.mainNode.classList.add('modal');\r\n    this.modalContainer.classList.add('modalContainer');\r\n    this.closeBtn.classList.add('btn', 'close');\r\n    this.modalContent.classList.add('modalContent');\r\n    \r\n    this.modalContainer.addEventListener('click', this.close);\r\n    this.closeBtn.addEventListener('click', this.close);\r\n    \r\n    this.modalContent.append(contentNode);\r\n    this.closeBtn.innerText = 'X'\r\n    this.modalContainer.append(this.closeBtn);\r\n    this.modalContainer.append(this.modalContent);\r\n    this.mainNode.append(this.modalContainer);\r\n  \r\n    this.body.prepend(this.mainNode);\r\n    this.body.classList.add('noScrolling');\r\n  }\r\n  \r\n  close = (e) => {\r\n    if (e.target === e.currentTarget) {\r\n      this.mainNode.remove();\r\n      this.body.classList.remove('noScrolling');\r\n    }\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/Modal.js?");

/***/ }),

/***/ "./js/PopupController.js":
/*!*******************************!*\
  !*** ./js/PopupController.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ PopupController)\n/* harmony export */ });\nclass PopupController {\r\n  static #instance = null;\r\n  \r\n  constructor(popups) {\r\n    if (PopupController.#instance) {\r\n      return PopupController.#instance;\r\n    }\r\n  \r\n    PopupController.#instance = this;\r\n    \r\n    this.popupNodes = [];\r\n    this.openedIndex = null;\r\n    this.currentActiveStateNode = null;\r\n    this.bodyNode = document.querySelector('body');\r\n    \r\n    popups.forEach((item) => {\r\n      const popupNode = document.querySelector(item.popupSelector);\r\n      const btnNode = document.querySelector(item.btnSelector);\r\n      \r\n      if (!popupNode || !btnNode) {\r\n        return;\r\n      }\r\n      \r\n      if (item.states?.length) {\r\n        item.states.forEach(item => {\r\n          const btnActiveStateNode = popupNode.querySelector(item.btnSelector);\r\n          const blockStateNode = popupNode.querySelector(item.blockSelector);\r\n          \r\n          if (item.isDefault) {\r\n            this.currentActiveStateNode = blockStateNode;\r\n          }\r\n          \r\n          btnActiveStateNode.addEventListener('click', () => {\r\n            if (this.currentActiveStateNode !== blockStateNode) {\r\n              this.currentActiveStateNode.classList.remove('active');\r\n              blockStateNode.classList.add('active');\r\n              \r\n              this.currentActiveStateNode = blockStateNode;\r\n            }\r\n          })\r\n        })\r\n      }\r\n      \r\n      this.popupNodes.push({\r\n        id: item.id,\r\n        popupNode,\r\n        btnNode,\r\n      });\r\n      \r\n      const index = this.popupNodes.length - 1;\r\n  \r\n      btnNode.addEventListener('click', () => {\r\n        this.handleOpenPopup(index);\r\n      })\r\n    });\r\n  }\r\n  \r\n  activateById = (id) => {\r\n    const index = this.popupNodes.findIndex(item => item.id === id);\r\n    \r\n    if (index === -1 || index === this.openedIndex) {\r\n      return;\r\n    }\r\n    \r\n    this.openPopup(index);\r\n  }\r\n  \r\n  handleOpenPopup = (index) => {\r\n    if (this.openedIndex === index) {\r\n      return this.closePopup(this.openedIndex);\r\n    }\r\n    \r\n    if (this.openedIndex !== null) {\r\n      this.closePopup(this.openedIndex);\r\n    }\r\n  \r\n    this.openPopup(index);\r\n  }\r\n  \r\n  openPopup = (index) => {\r\n    const popupNode = this.popupNodes[index].popupNode;\r\n    const btnNode = this.popupNodes[index].btnNode;\r\n  \r\n    this.openedIndex = index;\r\n    this.bodyNode.classList.add('noScrolling');\r\n    \r\n    popupNode.classList.add('active');\r\n    btnNode.classList.add('active');\r\n  \r\n    document.removeEventListener('click', this.docClickListener);\r\n    \r\n    this.docClickListener = (e) => {\r\n      if (!popupNode.contains(e.target) && !btnNode.contains(e.target)) {\r\n        this.closePopup(index);\r\n      }\r\n    }\r\n    \r\n    document.addEventListener('click', this.docClickListener);\r\n  }\r\n  \r\n  closePopup = (index) => {\r\n    this.popupNodes[index].popupNode.classList.remove('active');\r\n    this.popupNodes[index].btnNode.classList.remove('active');\r\n    \r\n    this.openedIndex = null;\r\n    this.bodyNode.classList.remove('noScrolling');\r\n    \r\n    document.removeEventListener('click', this.docClickListener);\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/PopupController.js?");

/***/ }),

/***/ "./js/Postman.js":
/*!***********************!*\
  !*** ./js/Postman.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Postman)\n/* harmony export */ });\nclass Postman {\r\n  static #instance = null;\r\n  \r\n  constructor() {\r\n    if (Postman.#instance) {\r\n      return Postman.#instance;\r\n    }\r\n    \r\n    Postman.#instance = this;\r\n  }\r\n  \r\n  get = (url, params) => {\r\n    const newUrl = new URL(url);\r\n  \r\n    Object.entries(params).forEach(([key, value]) => {\r\n      newUrl.searchParams.append(key, value);\r\n    });\r\n    \r\n    return this.query({\r\n      url: newUrl,\r\n      method: 'GET',\r\n    });\r\n  }\r\n  \r\n  post = (url, params) => {\r\n    return this.query({\r\n      url,\r\n      params,\r\n      method: 'POST',\r\n    });\r\n  }\r\n  \r\n  put = (url, params) => {\r\n    return this.query({\r\n      url,\r\n      params,\r\n      method: 'PUT',\r\n    });\r\n  }\r\n  \r\n  delete = (url) => {\r\n    return this.query({\r\n      url,\r\n      method: 'DELETE',\r\n    });\r\n  }\r\n  \r\n  query = (options) => {\r\n    const {\r\n      url,\r\n      method,\r\n      params = {},\r\n    } = options;\r\n    \r\n    const init = {\r\n      method,\r\n      headers: {\r\n        'Content-Type': 'application/json;charset=utf-8'\r\n      },\r\n    }\r\n    \r\n    if (method !== 'GET') {\r\n      init.body = JSON.stringify(params);\r\n    }\r\n  \r\n    return fetch(url, init);\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/Postman.js?");

/***/ }),

/***/ "./js/Prompt.js":
/*!**********************!*\
  !*** ./js/Prompt.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class {\r\n  constructor(options) {\r\n    this.mainNode = options.mainNode;\r\n    this.blockNode = this.mainNode.querySelector('.js-promptBlock');\r\n    this.openNode = this.mainNode.querySelector('.js-promptOpen');\r\n    this.closeNode = this.mainNode.querySelector('.js-promptClose');\r\n    \r\n    this.openNode.addEventListener('click', this.open);\r\n    this.closeNode.addEventListener('click', this.close);\r\n  }\r\n  \r\n  open = () => {\r\n    this.blockNode.classList.add('active');\r\n  }\r\n  \r\n  close = () => {\r\n    this.blockNode.classList.remove('active');\r\n  }\r\n});\n\n//# sourceURL=webpack:///./js/Prompt.js?");

/***/ }),

/***/ "./js/Slider.js":
/*!**********************!*\
  !*** ./js/Slider.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Slider)\n/* harmony export */ });\nclass Slider {\r\n  constructor(options) {\r\n    const {\r\n      mainNode,\r\n      switchingTime,\r\n      isTrack,\r\n      isVertical,\r\n      progress,\r\n      navigate,\r\n      countSlidesScroll = 1,\r\n      onSwitch,\r\n    } = options;\r\n  \r\n    this.switchingTime = switchingTime;\r\n    this.isTrack = isTrack;\r\n    this.isVertical = isVertical;\r\n    this.progress = progress;\r\n    this.navigate = navigate;\r\n    this.countSlidesScroll = countSlidesScroll;\r\n    this.onSwitch = onSwitch;\r\n    this.activeScreen = 0;\r\n    this.countVisibleSlides = 1;\r\n    this.timeOutId = null;\r\n    this.offsetSlide = 0;\r\n  \r\n    this.mainNode = mainNode;\r\n    this.prevBtnNode = this.mainNode.querySelector('.js-prevBtn');\r\n    this.nextBtnNode = this.mainNode.querySelector('.js-nextBtn');\r\n    this.tapeNode = this.mainNode.querySelector('.js-tape');\r\n    this.slideNodes = this.mainNode.querySelectorAll('.js-slide');\r\n    \r\n    this.countSlides = this.slideNodes.length;\r\n    this.countScreens = this.countSlides;\r\n    \r\n    if (this.isTrack) {\r\n      const stylesSlide = getComputedStyle(this.slideNodes[0]);\r\n      this.visibleAreaNode = this.mainNode.querySelector('.js-visibleArea');\r\n      \r\n      this.shareSlide = this.slideNodes[0].offsetWidth + parseInt(stylesSlide.marginLeft) + parseInt(stylesSlide.marginRight);\r\n      this.shareVisibleArea = this.visibleAreaNode.offsetWidth;\r\n      this.positionTape = 0;\r\n      \r\n      if (this.isVertical) {\r\n        this.shareSlide = this.slideNodes[0].offsetHeight + parseInt(stylesSlide.marginTop) + parseInt(stylesSlide.marginBottom);\r\n        this.shareVisibleArea = this.visibleAreaNode.offsetHeight;\r\n      }\r\n      \r\n      this.countVisibleSlides = this.shareVisibleArea / this.shareSlide;\r\n      \r\n      if (this.countSlidesScroll > this.countVisibleSlides) {\r\n        this.countSlidesScroll = this.countVisibleSlides;\r\n      }\r\n      \r\n      this.countScreens = Math.ceil((this.countSlides - (this.countVisibleSlides - this.countSlidesScroll)) / this.countSlidesScroll);\r\n    }\r\n  \r\n    if (this.progress) {\r\n      this.shareProgress = 100 / this.countScreens;\r\n      this.progressNode = this.mainNode.querySelector('.js-progress');\r\n      this.progressNode.style.setProperty('--share', `${this.shareProgress}%`);\r\n      this.progressNode.style.setProperty('--progress', `0%`);\r\n    }\r\n  \r\n    if (this.navigate) {\r\n      this.navigateItemNodes = this.mainNode.querySelectorAll('.js-itemNavigate');\r\n      \r\n      this.navigateItemNodes.forEach((item, index) => {\r\n        item.addEventListener('click', () => this.switchScreen(index));\r\n      })\r\n    }\r\n  \r\n    if (this.onSwitch) {\r\n      this.onSwitch([this.slideNodes[0]]);\r\n    }\r\n  \r\n    if (this.switchingTime) {\r\n      this.timeOutId = setTimeout(() => {\r\n        this.switchScreen(this.activeScreen + 1);\r\n      }, this.switchingTime);\r\n    }\r\n    \r\n    this.prevBtnNode.addEventListener('click', () => this.switchScreen(this.activeScreen - 1));\r\n    this.nextBtnNode.addEventListener('click', () => this.switchScreen(this.activeScreen + 1));\r\n  \r\n    /*switch (this.type) {\r\n      case 'switchClass': {\r\n        this.handleSwitch = this.getSwitcher(this.switchClass);\r\n        this.tapeNode = true;\r\n        if (this.navigateInitial) {\r\n          this.navNodes.forEach((item, index) => item.addEventListener('click', () => this.handleSwitch(index)));\r\n        }\r\n        this.nextBtnNode.addEventListener('click', () => this.handleSwitch(this.slideActive + this.slideScroll));\r\n        this.prevBtnNode.addEventListener('click', () => this.handleSwitch(this.slideActive - this.slideScroll));\r\n        break;\r\n      }\r\n      case 'track': {\r\n        //this.tape.addEventListener('mousedown', this.moveTape);\r\n        this.widthSlide = this.visibleAreaNode.offsetWidth / this.countVisibleSlides;\r\n        this.slidesNodes.forEach(item => item.style.width = `${this.widthSlide}px`);\r\n        this.positionTape = 0;\r\n        this.handleSwitch = this.getSwitcher(this.trackSwitch);\r\n        break;\r\n      }\r\n      case 'verticalTrack': {\r\n        this.heightSlide = this.visibleAreaNode.offsetHeight / this.countVisibleSlides;\r\n        this.slidesNodes.forEach(item => item.style.height = `${this.heightSlide}px`);\r\n        this.positionTape = 0;\r\n        this.handleSwitch = this.getSwitcher(this.verticalTrackSwitch);\r\n        break;\r\n      }\r\n    }*/\r\n  }\r\n  \r\n  switchScreen = (targetScreen) => {\r\n    const prevScreen = this.activeScreen;\r\n    \r\n    this.activeScreen = targetScreen;\r\n    \r\n    if (targetScreen >= this.countScreens) {\r\n      this.activeScreen = 0;\r\n    }\r\n    \r\n    if (targetScreen < 0) {\r\n      this.activeScreen = this.countScreens - 1;\r\n    }\r\n  \r\n    const prevSlides = this.setActiveClass(prevScreen, 'remove');\r\n    const slides = this.setActiveClass(this.activeScreen, 'add');\r\n    \r\n    if (this.progress) {\r\n      this.progressNode.style.setProperty('--progress', `${this.shareProgress * (this.activeScreen)}%`);\r\n    }\r\n  \r\n    if (this.onSwitch) {\r\n      this.onSwitch(slides, prevSlides);\r\n    }\r\n    \r\n    if (this.isTrack) {\r\n      this.moveTape(prevScreen);\r\n    }\r\n  \r\n    clearTimeout(this.timeOutId);\r\n  \r\n    if (this.switchingTime) {\r\n      this.timeOutId = setTimeout(() => {\r\n        this.switchScreen(this.activeScreen + 1);\r\n      }, this.switchingTime);\r\n    }\r\n  }\r\n  \r\n  setActiveClass = (screen, action) => {\r\n    let start = screen * this.countVisibleSlides - this.offsetSlide;\r\n    let end = screen * this.countVisibleSlides + this.countVisibleSlides - this.offsetSlide;\r\n    const members = [];\r\n    \r\n    if (this.activeScreen === 0 && this.offsetSlide) {\r\n      this.offsetSlide = 0;\r\n    }\r\n    \r\n    if (this.isTrack && end > this.countSlides) {\r\n      this.offsetSlide = end - this.countSlides;\r\n      start -= this.offsetSlide;\r\n      end = this.countSlides;\r\n    }\r\n  \r\n    if (this.navigate) {\r\n      this.navigateItemNodes[screen].classList[action]('active');\r\n      this.navigateItemNodes[screen].blur();\r\n    }\r\n    \r\n    while (start < end) {\r\n      const slide = this.slideNodes[start];\r\n      \r\n      members.push(slide);\r\n      slide.classList[action]('active');\r\n      start++;\r\n    }\r\n    \r\n    return members;\r\n  }\r\n  \r\n  moveTape = (prevScreen) => {\r\n    if (this.activeScreen > prevScreen) {\r\n      if (this.activeScreen + 1 === this.countScreens) {\r\n        this.positionTape = ((this.countSlides - this.countVisibleSlides) * this.shareSlide) * -1;\r\n      } else {\r\n        this.positionTape -= this.countVisibleSlides * this.shareSlide;\r\n      }\r\n    } else {\r\n      if (this.activeScreen === 0) {\r\n        this.positionTape = 0;\r\n      } else {\r\n        this.positionTape += this.countVisibleSlides * this.shareSlide;\r\n      }\r\n    }\r\n    \r\n    if (this.isVertical) {\r\n      return this.tapeNode.style.transform = `translateY(${this.positionTape}px)`;\r\n    }\r\n  \r\n    this.tapeNode.style.transform = `translateX(${this.positionTape}px)`;\r\n  }\r\n  \r\n  changeTimeoutOnce = (time) => {\r\n    clearTimeout(this.timeOutId);\r\n    this.timeOutId = setTimeout(() => {\r\n      this.switchScreen(this.activeScreen + 1);\r\n    }, time);\r\n  }\r\n  \r\n  /*moveTape = (click) => {\r\n    const targetClick = click.pageX;\r\n    \r\n    let translateX = 0;\r\n    let moveX = 0;\r\n    \r\n    document.onmousemove = (e) => {\r\n      moveX = e.pageX;\r\n      translateX = moveX - targetClick + this.positionSliders;\r\n      this.tape.style.transform = `translate(${translateX}px, 0)`;\r\n      this.tape.classList.add('moving');\r\n    }\r\n    \r\n    this.tape.onmouseup = () => {\r\n      document.onmousemove = null;\r\n      this.tape.onmouseup = null;\r\n      this.tape.mouseout = null;\r\n      this.tape.classList.remove('moving');\r\n      \r\n      if (moveX === 0) {\r\n        this.tape.style.transform = `translate(${this.positionSliders}px, 0)`;\r\n        return;\r\n      }\r\n      \r\n      if (targetClick - moveX > 29) {\r\n        this.trackSwitch(this.slideActive + 1);\r\n        return;\r\n      }\r\n      \r\n      if (targetClick - moveX < -29) {\r\n        this.trackSwitch(this.slideActive - 1);\r\n        return;\r\n      }\r\n      \r\n      this.tape.style.transform = `translate(${this.positionSliders}px, 0)`;\r\n    }\r\n    \r\n    this.tape.onmouseout = () => {\r\n      document.onmousemove = null;\r\n      this.tape.onmouseup = null;\r\n      this.tape.mouseout = null;\r\n      this.tape.classList.remove('moving');\r\n      \r\n      if (targetClick - moveX > 29) {\r\n        this.trackSwitch(this.slideActive + 1);\r\n        return;\r\n      }\r\n      \r\n      if (targetClick - moveX < -29) {\r\n        this.trackSwitch(this.slideActive - 1);\r\n        return;\r\n      }\r\n      \r\n      this.tape.style.transform = `translate(${this.positionSliders}px, 0)`;\r\n    }\r\n  }*/\r\n}\n\n//# sourceURL=webpack:///./js/Slider.js?");

/***/ }),

/***/ "./js/Tabs.js":
/*!********************!*\
  !*** ./js/Tabs.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Tabs)\n/* harmony export */ });\nclass Tabs {\r\n  constructor(options) {\r\n    const {\r\n      mainNode,\r\n    } = options;\r\n    \r\n    this.mainNode = mainNode;\r\n    this.tabBtnNodes = this.mainNode.querySelectorAll('.js-tabBtn');\r\n    this.activeTabBtnNode = this.tabBtnNodes[0];\r\n    \r\n    this.tabBtnNodes.forEach(item => {\r\n      item.addEventListener('click', this.switchTab)\r\n    });\r\n  }\r\n  \r\n  switchTab = (e) => {\r\n    const targetNode = e.target;\r\n    \r\n    if (this.activeTabBtnNode === targetNode) {\r\n      return;\r\n    }\r\n    \r\n    const fromTabId = this.activeTabBtnNode.dataset.targetId;\r\n    const toTabId = targetNode.dataset.targetId;\r\n    \r\n    this.activeTabBtnNode.classList.remove('active');\r\n    targetNode.classList.add('active');\r\n  \r\n    this.activeTabBtnNode = targetNode;\r\n    \r\n    this.mainNode.querySelector(`.js-tabBlock-${fromTabId}`).classList.remove('active');\r\n    this.mainNode.querySelector(`.js-tabBlock-${toTabId}`).classList.add('active');\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/Tabs.js?");

/***/ }),

/***/ "./js/config.js":
/*!**********************!*\
  !*** ./js/config.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst Config = {\r\n  //websiteAddress: 'http://141.8.194.196:4000/',\r\n  websiteAddress: 'http://localhost:4000/',\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Config);\n\n//# sourceURL=webpack:///./js/config.js?");

/***/ }),

/***/ "./js/index.js":
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Slider */ \"./js/Slider.js\");\n/* harmony import */ var _Tabs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tabs */ \"./js/Tabs.js\");\n/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Modal */ \"./js/Modal.js\");\n/* harmony import */ var _PopupController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PopupController */ \"./js/PopupController.js\");\n/* harmony import */ var _AsyncForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AsyncForm */ \"./js/AsyncForm.js\");\n/* harmony import */ var _Prompt__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Prompt */ \"./js/Prompt.js\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config */ \"./js/config.js\");\n/* harmony import */ var _styles_index_sass__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../styles/index.sass */ \"./styles/index.sass\");\n/* harmony import */ var _Postman__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Postman */ \"./js/Postman.js\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../config */ \"../config.js\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_config__WEBPACK_IMPORTED_MODULE_9__);\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nconst postman = new _Postman__WEBPACK_IMPORTED_MODULE_8__[\"default\"]();\r\n\r\nconst homeSliderNode = document.querySelector('.js-homeSlider');\r\nconst homeCatalogTabsNode = document.querySelector('.js-homeCatalogTabs');\r\nconst genresSliderNode = document.querySelector('.js-genresSlider');\r\nconst gameGallerySliderNode = document.querySelector('.js-gameGallerySlider');\r\nconst gameInfoTabsNode = document.querySelector('.js-gameInfoTabs');\r\nconst youtubePlayNodes = document.querySelectorAll('.js-playYouTubeVideo');\r\nconst catalogNode = document.querySelector('.js-catalog');\r\nconst loginFormNode = document.querySelector('.js-loginForm');\r\nconst profileEditFormNode = document.querySelector('.js-profileEditForm');\r\nconst submitLoginNode = document.querySelector('.js-submitLoginForm');\r\nconst btnSwitchAuthNode = document.querySelector('.js-btnSwitchAuth');\r\nconst btnSwitchRegNode = document.querySelector('.js-btnSwitchReg');\r\nconst inputLabelInFieldNodes = document.querySelectorAll('.js-inputLabelInField');\r\nconst promptNodes = document.querySelectorAll('.js-prompt');\r\nconst scrollerNode = document.querySelector('.js-scroller');\r\nconst likeArticleNode = document.querySelector('.js-likeArticle');\r\nconst copyBtnNode = document.querySelector('.js-copyBtn');\r\nconst searchStringNode = document.querySelector('.js-searchString');\r\nconst popupController = new _PopupController__WEBPACK_IMPORTED_MODULE_3__[\"default\"]([\r\n  {\r\n    id: 'loginFrom',\r\n    btnSelector: '.js-openLogin',\r\n    popupSelector: '.js-login',\r\n    states: [\r\n      {\r\n        btnSelector: '.js-btnBackLogin',\r\n        blockSelector: '.js-loginFormContainer',\r\n        isDefault: true,\r\n      },\r\n      {\r\n        btnSelector: '.js-btnRestore',\r\n        blockSelector: '.js-restoreFomContainer',\r\n      },\r\n    ],\r\n  },\r\n  {\r\n    id: 'navigate',\r\n    btnSelector: '.js-toggleMainNavigation',\r\n    popupSelector: '.js-mainNavigation',\r\n  }\r\n]);\r\n\r\nsearchStringNode.addEventListener('input', async () => {\r\n  popupController.activateById('navigate');\r\n  \r\n  const response = await postman.get(`${_config__WEBPACK_IMPORTED_MODULE_9__.websiteAddress}api/products`, {searchString: searchStringNode.value});\r\n  const result = await response.json();\r\n  const menuNode = document.querySelector('.js-menu');\r\n  const searchResultNode = document.querySelector('.js-searchResult');\r\n  \r\n  if (result.error) {\r\n    return;\r\n  }\r\n  \r\n  menuNode.classList.add('activeSearchResult');\r\n  \r\n  if (result.products?.length === 0) {\r\n    return searchResultNode.innerHTML = '<p style=\"color: #fff\">Ни чего не найдено</p>';\r\n  }\r\n  \r\n  searchResultNode.innerHTML = '';\r\n  \r\n  result.products.forEach(product => {\r\n    searchResultNode.innerHTML += `\r\n      <a href=\"/games/${product.alias}\" class=\"cardGame\" title=\"Перейти к странице игры\">\r\n        <div class=\"actions\">\r\n            <button class=\"btn like\" title=\"Добавить игру в избранное\">\r\n                <span class=\"icon-static icon-static-actionLike\"></span>\r\n            </button>\r\n            <button\r\n                class=\"btn border rounded uppercase bg-darkPink hover-bg-pink inCart small\"\r\n                title=\"Добавить данный товар в корзину покупок\"\r\n            >\r\n                В корзину\r\n            </button>\r\n        </div>\r\n        <div class=\"head\">\r\n            <img class=\"img\" src=\"${_config__WEBPACK_IMPORTED_MODULE_9__.websiteAddress}${product.img}\" alt=\"Картинка ${product.name}\" title=\"${product.name}\">\r\n            <div class=\"name\">\r\n                ${product.name}\r\n            </div>\r\n        </div>\r\n        <div class=\"price\">\r\n            <div class=\"toPrice\">\r\n                <span class=\"value\">\r\n                    ${product.priceTo}\r\n                </span>\r\n            </div>\r\n            <div class=\"fromPrice\">\r\n                <span class=\"value\">\r\n                    ${product.priceFrom}\r\n                </span>\r\n            </div>\r\n        </div>\r\n      </a>\r\n    `;\r\n  });\r\n})\r\n\r\nif (copyBtnNode) {\r\n  copyBtnNode.addEventListener('click', () => {\r\n    const copyTextNode = document.querySelector('.js-copyText');\r\n    const copyNodeContentsToClipboard = (el) => {\r\n      const range = document.createRange();\r\n      const selection = window.getSelection();\r\n      range.selectNodeContents(el);\r\n      selection.removeAllRanges();\r\n      selection.addRange(range);\r\n      document.execCommand('copy');\r\n      selection.removeAllRanges();\r\n    }\r\n    const copyToClipboard = (el) => {\r\n      const oldContentEditable = el.contentEditable;\r\n      const oldReadOnly = el.readOnly;\r\n      try {\r\n        el.contentEditable = 'true'; //  специально для iOS\r\n        el.readOnly = false;\r\n        copyNodeContentsToClipboard(el);\r\n      } finally {\r\n        el.contentEditable = oldContentEditable;\r\n        el.readOnly = oldReadOnly;\r\n      }\r\n    }\r\n    \r\n    try {\r\n      if (navigator.clipboard) {\r\n        navigator.clipboard.writeText(copyTextNode.innerText);\r\n      } else if (window.clipboardData) {\r\n        window.clipboardData.setData('text', copyTextNode.innerText); // для Internet Explorer\r\n      } else {\r\n        copyToClipboard(copyTextNode); // для других браузеров, iOS, Mac OS\r\n      }\r\n      //Вывод инфы об успешном копировании\r\n    } catch (e) {\r\n      //Вывод инфы о неудавшемся копировании\r\n    }\r\n  })\r\n}\r\n\r\nif (scrollerNode) {\r\n  scrollerNode.addEventListener('click', () => {\r\n    const targetSelector = `.js-${scrollerNode.dataset.target}`;\r\n    const topOffset = document.querySelector('.js-header').offsetHeight;\r\n    const targetPosition = document.querySelector(targetSelector).getBoundingClientRect().top;\r\n    const offsetPosition = targetPosition - topOffset;\r\n    \r\n    window.scrollBy({\r\n      top: offsetPosition,\r\n      behavior: 'smooth'\r\n    });\r\n  });\r\n}\r\n\r\nif (likeArticleNode) {\r\n  likeArticleNode.addEventListener('click', async () => {\r\n    const countLikesNode = document.querySelector('.js-countLikes');\r\n    const articleId = likeArticleNode.dataset.target;\r\n    const response = await postman.post('/api/articles/like', {articleId});\r\n    const result = await response.json();\r\n    \r\n    if (!result.error) {\r\n      countLikesNode.innerText = result.countLikes;\r\n    }\r\n  })\r\n}\r\n\r\n/*if (homeSliderNode) {\r\n  let playVideoTimeOutId;\r\n  \r\n  const homeSlider = new Slider({\r\n    mainNode: homeSliderNode,\r\n    onSwitch: switchHomeSlider,\r\n    progress: true,\r\n    navigate: true,\r\n    switchingTime: 3000,\r\n  });\r\n  \r\n  function switchHomeSlider(slides, prevSlides = []) {\r\n    clearTimeout(playVideoTimeOutId);\r\n    const slideNode = slides[0];\r\n    const prevSlideNode = prevSlides[0];\r\n    const videoName = slideNode.dataset.videoName;\r\n    const videoNode = slideNode.querySelector('.video');\r\n    let canplaythrough = true;\r\n    \r\n    if (slideNode === prevSlideNode) {\r\n      return;\r\n    }\r\n    \r\n    const onCanplaythrough = () => {\r\n      if (!canplaythrough) {\r\n        return;\r\n      }\r\n      \r\n      playVideoTimeOutId = setTimeout(() => {\r\n        slideNode.classList.add('activeVideo');\r\n        homeSlider.changeTimeoutOnce(videoNode.duration * 1000);\r\n        videoNode.play();\r\n      }, 2000);\r\n      \r\n      canplaythrough = false;\r\n    }\r\n    \r\n    if (prevSlideNode) {\r\n      const prevSlideVideoNode = prevSlideNode.querySelector('.video');\r\n      \r\n      prevSlideNode.classList.remove('activeVideo');\r\n      prevSlideVideoNode.removeAttribute('src');\r\n      prevSlideVideoNode.removeEventListener('canplaythrough', onCanplaythrough);\r\n    }\r\n    \r\n    videoNode.addEventListener('canplaythrough', onCanplaythrough);\r\n    videoNode.setAttribute('src',`${Config.websiteAddress}${videoName}`);\r\n  }\r\n}*/\r\n\r\nif (homeCatalogTabsNode) {\r\n  new _Tabs__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\r\n    mainNode: homeCatalogTabsNode,\r\n  });\r\n}\r\n\r\nif (genresSliderNode) {\r\n  new _Slider__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\r\n    mainNode: genresSliderNode,\r\n    progress: true,\r\n    isTrack: true,\r\n    isVertical: true,\r\n    countSlidesScroll: 2,\r\n    switchingTime: 1000000,\r\n  });\r\n}\r\n\r\nif (gameGallerySliderNode) {\r\n  new _Slider__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\r\n    mainNode: gameGallerySliderNode,\r\n    isTrack: true,\r\n    countSlidesScroll: 2,\r\n    switchingTime: 1000000,\r\n  });\r\n}\r\n\r\nif (gameInfoTabsNode) {\r\n  new _Tabs__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\r\n    mainNode: gameInfoTabsNode,\r\n  });\r\n}\r\n\r\nif (youtubePlayNodes.length) {\r\n  youtubePlayNodes.forEach(item => {\r\n    item.addEventListener('click', () => {\r\n      const videoId = item.dataset.link;\r\n      const iframe = document.createElement('iframe');\r\n      \r\n      iframe.style.width = '100%';\r\n      iframe.style.height = '100%';\r\n      iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`);\r\n      iframe.setAttribute('frameBorder', '0');\r\n      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');\r\n      iframe.setAttribute('allowFullScreen', '');\r\n\r\n      new _Modal__WEBPACK_IMPORTED_MODULE_2__[\"default\"](iframe);\r\n    })\r\n  })\r\n}\r\n\r\nif (catalogNode) {\r\n  const filterNode = catalogNode.querySelector('.js-filter');\r\n  const sortNode = catalogNode.querySelector('.js-sort');\r\n  const loadMoreNode = catalogNode.querySelector('.js-loadMore');\r\n  const params = [];\r\n  \r\n  const checkbox = [\r\n    ...filterNode.querySelectorAll('.js-checkbox'),\r\n    ...sortNode.querySelectorAll('.js-checkbox'),\r\n  ];\r\n  \r\n  checkbox.forEach(item => {\r\n    item.querySelector('.input').addEventListener('click', (e) => {\r\n      const url = new URL(window.location.href);\r\n      const input = e.currentTarget;\r\n    \r\n      if (input.checked) {\r\n        url.searchParams.append(input.name, input.value);\r\n        \r\n        params.push({\r\n          name: input.name,\r\n          value: input.value,\r\n        })\r\n      } else {\r\n        const entriesParams = [...url.searchParams.entries()];\r\n        const paramIndex = params.findIndex(item => item.name === input.name && item.value === input.value);\r\n      \r\n        for(item of entriesParams) {\r\n          url.searchParams.delete(item[0]);\r\n        }\r\n      \r\n        for(item of entriesParams) {\r\n          if (item[1] === input.value) {\r\n            continue;\r\n          }\r\n        \r\n          url.searchParams.append(item[0], item[1]);\r\n        }\r\n        \r\n        if (paramIndex === -1) {\r\n          return;\r\n        }\r\n        \r\n        params.splice(paramIndex, 1);\r\n      }\r\n    \r\n      history.pushState(null, null, url);\r\n    });\r\n  })\r\n}\r\n\r\nif (loginFormNode && btnSwitchAuthNode && btnSwitchRegNode && submitLoginNode) {\r\n  btnSwitchAuthNode.addEventListener('click', () => {\r\n    btnSwitchAuthNode.classList.add('active');\r\n    btnSwitchRegNode.classList.remove('active');\r\n    loginFormNode.classList.add('auth');\r\n    loginFormNode.action = '/auth';\r\n    submitLoginNode.innerText = 'Войти';\r\n  });\r\n  \r\n  btnSwitchRegNode.addEventListener('click', () => {\r\n    btnSwitchRegNode.classList.add('active');\r\n    btnSwitchAuthNode.classList.remove('active');\r\n    loginFormNode.classList.remove('auth');\r\n    loginFormNode.action = '/reg';\r\n    submitLoginNode.innerText = 'Далее';\r\n  });\r\n}\r\n\r\nif (inputLabelInFieldNodes.length) {\r\n  inputLabelInFieldNodes.forEach(item => {\r\n    item.querySelector('input').addEventListener('blur', (e) => {\r\n      e.target.value.length ? e.target.classList.add('active') : e.target.classList.remove('active');\r\n    })\r\n  })\r\n}\r\n\r\nif (loginFormNode) {\r\n  new _AsyncForm__WEBPACK_IMPORTED_MODULE_4__[\"default\"]({\r\n    mainNode: loginFormNode,\r\n    successHandler: () => {\r\n      setTimeout(() => {\r\n        window.location.reload();\r\n      }, 1500)\r\n    },\r\n  });\r\n}\r\n\r\nif (profileEditFormNode) {\r\n  new _AsyncForm__WEBPACK_IMPORTED_MODULE_4__[\"default\"]({\r\n    mainNode: profileEditFormNode,\r\n  })\r\n}\r\n\r\nif (promptNodes.length) {\r\n  promptNodes.forEach(item => new _Prompt__WEBPACK_IMPORTED_MODULE_5__[\"default\"]({mainNode: item}));\r\n}\n\n//# sourceURL=webpack:///./js/index.js?");

/***/ }),

/***/ "./styles/index.sass":
/*!***************************!*\
  !*** ./styles/index.sass ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack:///./styles/index.sass?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/index.js");
/******/ 	
/******/ })()
;