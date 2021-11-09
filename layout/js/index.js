import Slider from "./Slider";
import ContextMenuController from "./ContextMenuController";
import TextField from "./TextField";
import Tabs from "./Tabs";

import './../styles/index.sass';

const switchHomeSlider = async (slides) => {
  const slideNode = slides[0];
  const videoName = slideNode.dataset.videoName;
  const videoNode = document.createElement('video');
  
  videoNode.setAttribute('src',`http://185.251.88.215:4000/${videoName}`);
  videoNode.setAttribute('class', 'video');
  videoNode.setAttribute('autoplay', '');
  videoNode.setAttribute('muted', '');
  videoNode.setAttribute('loop', '');
  slideNode.prepend(videoNode);
  
  videoNode.addEventListener('canplaythrough', () => {
    setTimeout(async () => {
      slideNode.classList.add('activeVideo');
    }, 2000)
  });
  
  //let videoNode = slideNode.querySelector('.video');
  //
  //if (!videoNode) {
  //  const videoName = slideNode.dataset.videoName;
  //  const sourceNode = document.createElement('source');
  //
  //  videoNode = document.createElement('video');
  //  videoNode.setAttribute('class', 'video');
  //  videoNode.setAttribute('muted', '');
  //  videoNode.setAttribute('autoplay', '');
  //  videoNode.append(sourceNode);
  //  slideNode.prepend(videoNode);
  //  sourceNode.setAttribute('src',`http://185.251.88.215:4000/${videoName}`);
  //}
  //
  //videoNode.addEventListener('canplaythrough', () => {
  //  setTimeout(async () => {
  //    slideNode.classList.add('activeVideo');
  //    videoNode.play();
  //  }, 2000)
  //});
}

const homeSlider = new Slider({
  selector: '.js-homeSlider',
  onSwitch: switchHomeSlider,
  progress: true,
  navigate: true,
});


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