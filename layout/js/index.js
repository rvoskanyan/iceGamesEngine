import Slider from "./Slider";
import ContextMenuController from "./ContextMenuController";
import TextField from "./TextField";
import Tabs from "./Tabs";

import './../styles/index.sass';

const homeSlider = new Slider({
  selector: '.js-homeSlider',
  onSwitch: switchHomeSlider,
  progress: true,
  navigate: true,
});

function switchHomeSlider(slides, prevSlides = []) {
  const slideNode = slides[0];
  const prevSlide = prevSlides[0];
  let videoNode = slideNode.querySelector('.video');
  
  if (prevSlide) {
    prevSlide.classList.remove('activeVideo');
    prevSlide.querySelector('.video').remove();
  }
  
  if (!videoNode) {
    const videoName = slideNode.dataset.videoName;
    const sourceNode = document.createElement('source');
    
    videoNode = document.createElement('video');
    videoNode.setAttribute('class', 'video');
    videoNode.setAttribute('muted', '');
    videoNode.append(sourceNode);
    slideNode.prepend(videoNode);
    sourceNode.setAttribute('src',`http://185.251.88.215:4000/${videoName}`);
  }
  
  videoNode.addEventListener('canplaythrough', () => {
    setTimeout(async () => {
      slideNode.classList.add('activeVideo');
      videoNode.play();
      homeSlider.changeTimeoutOnce(videoNode.duration * 1000);
    }, 2000);
  });
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