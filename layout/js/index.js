import Slider from "./Slider";
import ContextMenuController from "./ContextMenuController";
import TextField from "./TextField";
import Tabs from "./Tabs";

import './../styles/index.sass';

new Slider({
  sliderSelector: '.js-homeSlider',
  timeOutValue: 19000000000000000,
  type: 'switchClass',
  progress: true,
  navigate: true,
});

new Slider({
  sliderSelector: '.js-homeGeneresSlider',
  timeOutValue: 10000000,
  type: 'verticalTrack',
  countVisibleSlides: 2,
  slideScroll: 2,
  progress: true,
});

new ContextMenuController([
  {
    selector: 'mainNavigation',
    btnSelector: 'toggleMainNavigation',
    activeClass: 'active',
    btnActiveClass: 'active',
    hideMainScrolling: true,
  },
  {
    selector: 'profileForms',
    btnSelector: 'openProfileForms',
    activeClass: 'active',
    hideMainScrolling: true,
  },
], 'js-');

document.querySelectorAll('.js-labelInField').forEach(item => {
  const nodeField = item.querySelector('.js-labelInField-field');
  
  if (!nodeField) {
    return;
  }

  new TextField({
    nodeLabel: item,
    nodeField,
    labelInField: true,
  })
})

document.querySelectorAll('.js-tabs').forEach(item => {
  const tabsName = item.dataset.tabsname;
  const btnSelector = `.js-tabsBtn${tabsName && tabsName.length ? `-${tabsName}` : ''}`;
  const nodesBtn = item.querySelectorAll(btnSelector);
  const nodeActiveBtn = item.querySelectorAll(`${btnSelector}.active`);
  
  if (!nodeActiveBtn.length || nodeActiveBtn.length > 1 || !nodesBtn) {
    return;
  }
  
  new Tabs({
    nodeTabs: item,
    nodesBtn,
    nodeActiveBtn: nodeActiveBtn[0],
  })
})