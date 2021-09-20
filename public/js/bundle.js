/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
      /******/ 	"use strict";
      /******/ 	var __webpack_modules__ = ({
            
            /***/ "./js/ContextMenu.js":
            /*!***************************!*\
              !*** ./js/ContextMenu.js ***!
              \***************************/
            /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                  
                  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ContextMenu)\n/* harmony export */ });\nclass ContextMenu {\r\n  constructor(options) {\r\n    const {\r\n      nodeContextMenu,\r\n      nodeToggleBtn,\r\n      activeClass,\r\n      hideMainScrolling,\r\n      btnActiveClass,\r\n    } = options;\r\n    \r\n    this.nodeContextMenu = nodeContextMenu;\r\n    this.nodeToggleBtn = nodeToggleBtn;\r\n    this.activeClass = activeClass;\r\n    this.hideMainScrolling = hideMainScrolling;\r\n    this.btnActiveClass = btnActiveClass;\r\n  }\r\n  \r\n  open = () => {\r\n    this.nodeContextMenu.classList.toggle(this.activeClass);\r\n    if (this.btnActiveClass) {\r\n      this.nodeToggleBtn.classList.toggle(this.btnActiveClass);\r\n    }\r\n    if (this.hideMainScrolling) {\r\n      document.body.classList.add('noScrolling');\r\n    }\r\n  }\r\n  \r\n  close = () => {\r\n    this.nodeContextMenu.classList.toggle(this.activeClass);\r\n    if (this.btnActiveClass) {\r\n      this.nodeToggleBtn.classList.toggle(this.btnActiveClass);\r\n    }\r\n    if (this.hideMainScrolling) {\r\n      document.body.classList.remove('noScrolling');\r\n    }\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/ContextMenu.js?");
                  
                  /***/ }),
            
            /***/ "./js/ContextMenuController.js":
            /*!*************************************!*\
              !*** ./js/ContextMenuController.js ***!
              \*************************************/
            /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                  
                  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ContextMenuController)\n/* harmony export */ });\n/* harmony import */ var _ContextMenu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContextMenu */ \"./js/ContextMenu.js\");\n\r\n\r\nclass ContextMenuController {\r\n  constructor(listControlled, prefixSelector) {\r\n    this.optionsControlled = listControlled;\r\n    this.prefixSelector = prefixSelector;\r\n    this.objectsControlled = [];\r\n    this.opened = [];\r\n    \r\n    this.start();\r\n  }\r\n  \r\n  start = () => {\r\n    this.optionsControlled.forEach((item, index) => {\r\n      const nodeContextMenu = document.querySelector(`.${this.prefixSelector + item.selector}`);\r\n      const nodeToggleBtn = document.querySelector(`.${this.prefixSelector + item.btnSelector}`);\r\n      \r\n      this.objectsControlled.push(\r\n        new _ContextMenu__WEBPACK_IMPORTED_MODULE_0__.default({\r\n          nodeContextMenu,\r\n          nodeToggleBtn,\r\n          activeClass: item.activeClass,\r\n          hideMainScrolling: item.hideMainScrolling,\r\n          btnActiveClass: item.btnActiveClass,\r\n        })\r\n      );\r\n  \r\n      nodeToggleBtn.addEventListener('click', () => {\r\n        this.handleClickToggleButton(index);\r\n      })\r\n    })\r\n  }\r\n  \r\n  handleClickToggleButton = (index) => {\r\n    const indexInOpened = this.opened.findIndex(item => item.index === index);\r\n    \r\n    if (indexInOpened >= 0) {\r\n      return this.closeControlled(index, indexInOpened)\r\n    }\r\n  \r\n    this.opened.forEach(item => {\r\n      this.objectsControlled[item.index].close();\r\n      document.removeEventListener('click', item.listenerDocumentClick);\r\n    });\r\n    this.opened = [];\r\n    \r\n    this.openControlled(index);\r\n  }\r\n  \r\n  openControlled = (index) => {\r\n    const listenerDocumentClick = (e) => {\r\n      if (!this.objectsControlled[index].nodeContextMenu.contains(e.target) && (!this.objectsControlled[index].nodeToggleBtn.contains(e.target))) {\r\n        this.closeControlled(index, 0);\r\n      }\r\n    }\r\n    \r\n    document.addEventListener('click', listenerDocumentClick)\r\n    \r\n    this.objectsControlled[index].open();\r\n    this.opened.push({\r\n      index,\r\n      listenerDocumentClick,\r\n    })\r\n  }\r\n  \r\n  closeControlled = (index, indexInOpened) => {\r\n    document.removeEventListener('click', this.opened[indexInOpened].listenerDocumentClick)\r\n    \r\n    this.objectsControlled[index].close();\r\n    this.opened.splice(indexInOpened, 1);\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/ContextMenuController.js?");
                  
                  /***/ }),
            
            /***/ "./js/Slider.js":
            /*!**********************!*\
              !*** ./js/Slider.js ***!
              \**********************/
            /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                  
                  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Slider)\n/* harmony export */ });\nclass Slider {\r\n  constructor(options) {\r\n    const {\r\n      sliderSelector,\r\n      timeOutValue = 10000,\r\n      type = 'track',\r\n      countVisibleSlides = 1,\r\n      slideScroll = 1,\r\n      progress = false,\r\n      navigate = false,\r\n    } = options;\r\n    \r\n    this.type = type;\r\n    this.countVisibleSlides = countVisibleSlides;\r\n    this.slideScroll = slideScroll;\r\n    this.timeOutValue = timeOutValue;\r\n    this.progress = progress;\r\n    this.navigate = navigate;\r\n  \r\n    this.node = document.querySelector(sliderSelector);\r\n    if (!this.node) {\r\n      return console.error(`Не удалось найти контейнер слайдера с селектором: ${sliderSelector}`);\r\n    }\r\n    this.slidesNodes = this.node.querySelectorAll('.js-slide');\r\n    this.prevBtnNode = this.node.querySelector('.js-prevSlide');\r\n    this.nextBtnNode = this.node.querySelector('.js-nextSlide');\r\n    this.visibleAreaNode = this.node.querySelector('.js-visibleAreaSlider');\r\n    this.tapeNode = this.node.querySelector('.js-tapeSlider');\r\n  \r\n    this.countSlides = this.slidesNodes.length;\r\n    const countScreens = (this.countSlides - (this.countVisibleSlides - this.slideScroll)) / this.slideScroll;\r\n    this.countScreens = Math.ceil((this.countSlides - (this.countVisibleSlides - this.slideScroll)) / this.slideScroll);\r\n    this.ceilScreens = Number.isInteger(countScreens);\r\n    this.shareProgress = 100 / this.countScreens;\r\n    this.slideActive = 0;\r\n    this.screenActive = 1;\r\n  \r\n    if (sliderSelector.length < 1) {\r\n      return console.error('Не указан селектор слайдера');\r\n    }\r\n  \r\n    if (!this.node) {\r\n      return console.error(`Не удалось найти контейнер слайдера с селектором: ${sliderSelector}`);\r\n    }\r\n  \r\n    if (!this.prevBtnNode) {\r\n      return console.error('Не удалось найти элемент кнопки переключения предыдущего слайда, который должен иметь селектор .js-prevSlide');\r\n    }\r\n  \r\n    if (!this.nextBtnNode) {\r\n      return console.error('Не удалось найти элемент кнопки переключения следующего слайда, который должен иметь селектор .js-nextSlide');\r\n    }\r\n  \r\n    if (!this.visibleAreaNode) {\r\n      console.warn('Не удалось найти элемент видимой области слайдера, который должен иметь селектор .js-visibleAreaSlider');\r\n    }\r\n  \r\n    if (!this.tapeNode) {\r\n      console.warn('Не удалось найти элемент видимой области слайдера, который должен иметь селектор .js-tapeSlider');\r\n    }\r\n  \r\n    if (this.navigate) {\r\n      this.navNodes = this.node.querySelectorAll('.js-itemNavSlider');\r\n    \r\n      if (this.navNodes.length !== this.countSlides) {\r\n        console.warn(`\r\n          Внимание! Количество слайдов и элементов навигации по слайдам не соответствует. Необходимо это исправить во\r\n          избежание ошибок работы слайдера.\r\n        `);\r\n      } else {\r\n        this.navigateInitial = true;\r\n      }\r\n    }\r\n\r\n    if (this.progress) {\r\n      this.progressNode = this.node.querySelector('.js-progressSlider');\r\n      \r\n      if (!this.progressNode) {\r\n        console.warn('Не удалось найти прогресс-бар слайдера, который должен иметь селектор .js-progressSlider');\r\n      } else {\r\n        this.progressInitial = true;\r\n      }\r\n    }\r\n  \r\n    this.nextBtnNode.addEventListener('click', () => this.handleSwitch(this.screenActive + 1));\r\n    this.prevBtnNode.addEventListener('click', () => this.handleSwitch(this.screenActive - 1));\r\n  \r\n    switch (this.type) {\r\n      case 'switchClass': {\r\n        this.countVisibleSlides = 1;\r\n        this.slideScroll = 1;\r\n        this.handleSwitch = this.getSwitcher(this.switchClass);\r\n        this.tapeNode = true;\r\n        if (this.navigateInitial) {\r\n          this.navNodes.forEach((item, index) => item.addEventListener('click', () => this.handleSwitch(index)));\r\n        }\r\n        this.nextBtnNode.addEventListener('click', () => this.handleSwitch(this.slideActive + this.slideScroll));\r\n        this.prevBtnNode.addEventListener('click', () => this.handleSwitch(this.slideActive - this.slideScroll));\r\n        break;\r\n      }\r\n      case 'track': {\r\n        //this.tape.addEventListener('mousedown', this.moveTape);\r\n        this.widthSlide = this.visibleAreaNode.offsetWidth / this.countVisibleSlides;\r\n        this.slidesNodes.forEach(item => item.style.width = `${this.widthSlide}px`);\r\n        this.positionTape = 0;\r\n        this.handleSwitch = this.getSwitcher(this.trackSwitch);\r\n        break;\r\n      }\r\n      case 'verticalTrack': {\r\n        this.heightSlide = this.visibleAreaNode.offsetHeight / this.countVisibleSlides;\r\n        this.slidesNodes.forEach(item => item.style.height = `${this.heightSlide}px`);\r\n        this.positionTape = 0;\r\n        this.handleSwitch = this.getSwitcher(this.verticalTrackSwitch);\r\n        break;\r\n      }\r\n    }\r\n    \r\n    if (this.progressInitial) {\r\n      this.progressNode.style.setProperty('--share', `${this.shareProgress}%`);\r\n      this.progressNode.style.setProperty('--progress', `0%`);\r\n    }\r\n  }\r\n  \r\n  getSwitcher = (handler) => {\r\n    const generalActions = (oldSlide, newSlide) => {\r\n      if (this.navigateInitial) {\r\n        this.navNodes[oldSlide].classList.remove('active');\r\n        this.navNodes[newSlide].classList.add('active');\r\n      }\r\n  \r\n      if (this.progressInitial) {\r\n        this.progressNode.style.setProperty('--progress', `${this.shareProgress * newSlide}%`);\r\n      }\r\n    }\r\n    \r\n    if (this.timeOutValue > 500) {\r\n      this.timeOut = setTimeout(() => handler(this.slideActive + this.slideScroll), this.timeOutValue);\r\n      \r\n      return (...args) => {\r\n        handler(...args, generalActions);\r\n        clearTimeout(this.timeOut);\r\n        this.timeOut = setTimeout(() => handler(this.slideActive + this.slideScroll), this.timeOutValue);\r\n      }\r\n    }\r\n    \r\n    return (...args) => {\r\n      handler(...args, generalActions);\r\n    }\r\n  }\r\n  \r\n  switchClass = (targetSlide, generalActions) => {\r\n    const oldSlide = this.slideActive;\r\n    \r\n    this.slidesNodes[this.slideActive].classList.remove('active');\r\n    \r\n    this.slideActive = targetSlide;\r\n    \r\n    if (targetSlide >= this.countSlides) {\r\n      this.slideActive = 0;\r\n    }\r\n    \r\n    if (targetSlide < 0) {\r\n      this.slideActive = this.countSlides - 1;\r\n    }\r\n    \r\n    this.slidesNodes[this.slideActive].classList.add('active');\r\n  \r\n    generalActions(oldSlide, this.slideActive);\r\n  }\r\n  \r\n  trackSwitch = (slide, generalActions) => {\r\n    const oldSlide = this.slideActive;\r\n    \r\n    this.slideActive = slide;\r\n    \r\n    if (slide >= this.countSlides) {\r\n      this.slideActive = 0;\r\n    }\r\n    \r\n    if (slide < 0) {\r\n      this.slideActive = this.slides.length - 1;\r\n    }\r\n    \r\n    this.positionSliders = -this.slideActive * this.widthSlide\r\n    \r\n    this.tape.style.transform = `translateX(${this.positionSliders}px)`;\r\n  \r\n    generalActions(oldSlide, this.slideActive);\r\n  }\r\n  \r\n  verticalTrackSwitch = (targetScreen, generalActions) => {if (targetScreen > this.screenActive) {\r\n      if (targetScreen > this.countScreens) {\r\n        this.positionTape = 0;\r\n        this.screenActive = 1;\r\n      } else {\r\n        this.positionTape -= (targetScreen - this.screenActive) * this.slideScroll * this.heightSlide;\r\n        this.screenActive = targetScreen;\r\n      }\r\n    } else {\r\n      if (targetScreen < 1) {\r\n        this.positionTape = (this.countSlides - this.countVisibleSlides) * -this.heightSlide;\r\n        this.screenActive = this.countScreens;\r\n      } else {\r\n        this.positionTape += (this.screenActive - targetScreen) * this.slideScroll * this.heightSlide;\r\n        this.screenActive = targetScreen;\r\n      }\r\n    }\r\n    \r\n    if (targetScreen === this.countScreens) {\r\n      this.positionTape = (this.countSlides - this.countVisibleSlides) * -this.heightSlide;\r\n      this.screenActive = this.countScreens;\r\n    }\r\n    \r\n    if (targetScreen === 1) {\r\n      this.positionTape = 0;\r\n      this.screenActive = 1;\r\n    }\r\n  \r\n    this.tapeNode.style.transform = `translateY(${this.positionTape}px)`;\r\n  \r\n    this.progressNode.style.setProperty('--progress', `${this.shareProgress * (this.screenActive - 1)}%`);\r\n  }\r\n  \r\n  moveTape = (click) => {\r\n    const targetClick = click.pageX;\r\n    \r\n    let translateX = 0;\r\n    let moveX = 0;\r\n    \r\n    document.onmousemove = (e) => {\r\n      moveX = e.pageX;\r\n      translateX = moveX - targetClick + this.positionSliders;\r\n      this.tape.style.transform = `translate(${translateX}px, 0)`;\r\n      this.tape.classList.add('moving');\r\n    }\r\n    \r\n    this.tape.onmouseup = () => {\r\n      document.onmousemove = null;\r\n      this.tape.onmouseup = null;\r\n      this.tape.mouseout = null;\r\n      this.tape.classList.remove('moving');\r\n      \r\n      if (moveX === 0) {\r\n        this.tape.style.transform = `translate(${this.positionSliders}px, 0)`;\r\n        return;\r\n      }\r\n      \r\n      if (targetClick - moveX > 29) {\r\n        this.trackSwitch(this.slideActive + 1);\r\n        return;\r\n      }\r\n      \r\n      if (targetClick - moveX < -29) {\r\n        this.trackSwitch(this.slideActive - 1);\r\n        return;\r\n      }\r\n      \r\n      this.tape.style.transform = `translate(${this.positionSliders}px, 0)`;\r\n    }\r\n    \r\n    this.tape.onmouseout = () => {\r\n      document.onmousemove = null;\r\n      this.tape.onmouseup = null;\r\n      this.tape.mouseout = null;\r\n      this.tape.classList.remove('moving');\r\n      \r\n      if (targetClick - moveX > 29) {\r\n        this.trackSwitch(this.slideActive + 1);\r\n        return;\r\n      }\r\n      \r\n      if (targetClick - moveX < -29) {\r\n        this.trackSwitch(this.slideActive - 1);\r\n        return;\r\n      }\r\n      \r\n      this.tape.style.transform = `translate(${this.positionSliders}px, 0)`;\r\n    }\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/Slider.js?");
                  
                  /***/ }),
            
            /***/ "./js/Tabs.js":
            /*!********************!*\
              !*** ./js/Tabs.js ***!
              \********************/
            /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                  
                  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Tabs)\n/* harmony export */ });\nclass Tabs {\r\n  constructor(options) {\r\n    const {\r\n      nodeTabs,\r\n      nodesBtn,\r\n      nodeActiveBtn,\r\n    } = options;\r\n    \r\n    this.nodeTabs = nodeTabs;\r\n    this.nodesBtn = nodesBtn;\r\n    this.nodeActiveBtn = nodeActiveBtn;\r\n    \r\n    this.start();\r\n  }\r\n  \r\n  start = () => {\r\n    this.nodesBtn.forEach(item => {\r\n      item.addEventListener('click', (e) => {\r\n        if (this.nodeActiveBtn === item) {\r\n          return;\r\n        }\r\n        \r\n        this.switch(e);\r\n      })\r\n    })\r\n  }\r\n  \r\n  switch = (e) => {\r\n    const btnFrom = this.nodeActiveBtn;\r\n    const btnTo = e.target;\r\n    const targetsFrom = this.nodeTabs.querySelectorAll(`.js-tabsTarget-${btnFrom.dataset.target}`);\r\n    const targetsTo = this.nodeTabs.querySelectorAll(`.js-tabsTarget-${btnTo.dataset.target}`);\r\n    \r\n    btnFrom.classList.remove('active');\r\n    btnTo.classList.add('active');\r\n    \r\n    targetsFrom.forEach(item => {\r\n      item.classList.add('hide');\r\n    })\r\n  \r\n    targetsTo.forEach(item => {\r\n      item.classList.remove('hide');\r\n    })\r\n  \r\n    this.nodeActiveBtn = btnTo;\r\n    \r\n    const setAttribute = btnTo.dataset.setattribute;\r\n    \r\n    if (!setAttribute) {\r\n      return;\r\n    }\r\n    \r\n    this.setAttribute(JSON.parse(setAttribute));\r\n  }\r\n  \r\n  setAttribute = (attributes) => {\r\n    attributes.forEach(({name, value, selectorTarget, children}) => {\r\n      if (((!name || !name.length) && !children) || !value || !value.length || !selectorTarget || !selectorTarget.length) {\r\n        return;\r\n      }\r\n  \r\n      const nodeTarget = this.nodeTabs.querySelector(`.js-${selectorTarget}`);\r\n  \r\n      if (!nodeTarget) {\r\n        return;\r\n      }\r\n      \r\n      if (children) {\r\n        return nodeTarget.innerHTML = value;\r\n      }\r\n  \r\n      nodeTarget.setAttribute(name, value);\r\n    })\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/Tabs.js?");
                  
                  /***/ }),
            
            /***/ "./js/TextField.js":
            /*!*************************!*\
              !*** ./js/TextField.js ***!
              \*************************/
            /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                  
                  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ TextField)\n/* harmony export */ });\nclass TextField {\r\n  constructor(options) {\r\n    const {\r\n      nodeLabel,\r\n      nodeField,\r\n      labelInField,\r\n    } = options;\r\n    \r\n    this.nodeLabel = nodeLabel;\r\n    this.nodeFiled = nodeField;\r\n    this.labelInField = labelInField || false;\r\n    \r\n    this.start();\r\n  }\r\n  \r\n  start = () => {\r\n    if (this.labelInField) {\r\n      this.nodeFiled.addEventListener('change', () => {\r\n        this.nodeFiled.value.length ? this.nodeLabel.classList.add('active') : this.nodeLabel.classList.remove('active')\r\n      })\r\n    }\r\n  }\r\n}\n\n//# sourceURL=webpack:///./js/TextField.js?");
                  
                  /***/ }),
            
            /***/ "./js/index.js":
            /*!*********************!*\
              !*** ./js/index.js ***!
              \*********************/
            /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                  
                  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Slider */ \"./js/Slider.js\");\n/* harmony import */ var _ContextMenuController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContextMenuController */ \"./js/ContextMenuController.js\");\n/* harmony import */ var _TextField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TextField */ \"./js/TextField.js\");\n/* harmony import */ var _Tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Tabs */ \"./js/Tabs.js\");\n/* harmony import */ var _styles_index_sass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../styles/index.sass */ \"./styles/index.sass\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nnew _Slider__WEBPACK_IMPORTED_MODULE_0__.default({\r\n  sliderSelector: '.js-homeSlider',\r\n  timeOutValue: 10000,\r\n  type: 'switchClass',\r\n  progress: true,\r\n  navigate: true,\r\n});\r\n\r\nnew _Slider__WEBPACK_IMPORTED_MODULE_0__.default({\r\n  sliderSelector: '.js-homeGeneresSlider',\r\n  timeOutValue: 10000000,\r\n  type: 'verticalTrack',\r\n  countVisibleSlides: 2,\r\n  slideScroll: 2,\r\n  progress: true,\r\n});\r\n\r\nnew _ContextMenuController__WEBPACK_IMPORTED_MODULE_1__.default([\r\n  {\r\n    selector: 'mainNavigation',\r\n    btnSelector: 'toggleMainNavigation',\r\n    activeClass: 'active',\r\n    btnActiveClass: 'active',\r\n    hideMainScrolling: true,\r\n  },\r\n  {\r\n    selector: 'profileForms',\r\n    btnSelector: 'openProfileForms',\r\n    activeClass: 'active',\r\n    hideMainScrolling: true,\r\n  },\r\n], 'js-');\r\n\r\ndocument.querySelectorAll('.js-labelInField').forEach(item => {\r\n  const nodeField = item.querySelector('.js-labelInField-field');\r\n  \r\n  if (!nodeField) {\r\n    return;\r\n  }\r\n\r\n  new _TextField__WEBPACK_IMPORTED_MODULE_2__.default({\r\n    nodeLabel: item,\r\n    nodeField,\r\n    labelInField: true,\r\n  })\r\n})\r\n\r\ndocument.querySelectorAll('.js-tabs').forEach(item => {\r\n  const tabsName = item.dataset.tabsname;\r\n  const btnSelector = `.js-tabsBtn${tabsName && tabsName.length ? `-${tabsName}` : ''}`;\r\n  const nodesBtn = item.querySelectorAll(btnSelector);\r\n  const nodeActiveBtn = item.querySelectorAll(`${btnSelector}.active`);\r\n  \r\n  if (!nodeActiveBtn.length || nodeActiveBtn.length > 1 || !nodesBtn) {\r\n    return;\r\n  }\r\n  \r\n  new _Tabs__WEBPACK_IMPORTED_MODULE_3__.default({\r\n    nodeTabs: item,\r\n    nodesBtn,\r\n    nodeActiveBtn: nodeActiveBtn[0],\r\n  })\r\n})\n\n//# sourceURL=webpack:///./js/index.js?");
                  
                  /***/ }),
            
            /***/ "./styles/index.sass":
            /*!***************************!*\
              !*** ./styles/index.sass ***!
              \***************************/
            /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                  
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