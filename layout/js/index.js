import Slider from "./Slider";
import ContextMenuController from "./ContextMenuController";
import TextField from "./TextField";
import Tabs from "./Tabs";

import './../styles/index.sass';

let playVideoTimeOutId;

const homeSlider = new Slider({
  selector: '.js-homeSlider',
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
  videoNode.setAttribute('src',`http://185.251.88.215:4000/${videoName}`);
}


//new Slider({
//  sliderSelector: '.js-homeGeneresSlider',
//  timeOutValue: 10000000,
//  type: 'verticalTrack',
//  countVisibleSlides: 2,
//  slideScroll: 2,
//  progress: true,
//});
//
//new ContextMenuController([
//  {
//    selector: 'mainNavigation',
//    btnSelector: 'toggleMainNavigation',
//    activeClass: 'active',
//    btnActiveClass: 'active',
//    hideMainScrolling: true,
//  },
//  {
//    selector: 'profileForms',
//    btnSelector: 'openProfileForms',
//    activeClass: 'active',
//    hideMainScrolling: true,
//  },
//], 'js-');
//
//document.querySelectorAll('.js-labelInField').forEach(item => {
//  const nodeField = item.querySelector('.js-labelInField-field');
//
//  if (!nodeField) {
//    return;
//  }
//
//  new TextField({
//    nodeLabel: item,
//    nodeField,
//    labelInField: true,
//  })
//})
//
//document.querySelectorAll('.js-tabs').forEach(item => {
//  const tabsName = item.dataset.tabsname;
//  const btnSelector = `.js-tabsBtn${tabsName && tabsName.length ? `-${tabsName}` : ''}`;
//  const nodesBtn = item.querySelectorAll(btnSelector);
//  const nodeActiveBtn = item.querySelectorAll(`${btnSelector}.active`);
//
//  if (!nodeActiveBtn.length || nodeActiveBtn.length > 1 || !nodesBtn) {
//    return;
//  }
//
//  new Tabs({
//    nodeTabs: item,
//    nodesBtn,
//    nodeActiveBtn: nodeActiveBtn[0],
//  })
//})