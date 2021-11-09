import Slider from "./Slider";
import ContextMenuController from "./ContextMenuController";
import TextField from "./TextField";
import Tabs from "./Tabs";

import './../styles/index.sass';

const switchHomeSlider = async (slides) => {
  const slideNode = slides[0];
  const videoName = slideNode.dataset.videoName;
  const videoNode = document.createElement('video');
  const sourceNode = document.createElement('source');
  
  const response = await fetch(`http://185.251.88.215:4000/${videoName}`, {
    mode: 'no-cors'
  });
  const video = await response.blob();
  console.log(video);
  //const blob = await video.blob();
  //console.log(video);
  //const url = URL.createObjectURL(blob);
  //
  //
  //videoNode.setAttribute('class', 'video');
  //videoNode.setAttribute('muted', 'true');
  //videoNode.setAttribute('loop', '');
  //sourceNode.setAttribute('src', url);
  //videoNode.append(sourceNode);
  //slideNode.classList.add('activeVideo');
  //
  //slideNode.prepend(videoNode);
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