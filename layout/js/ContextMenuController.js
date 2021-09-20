import ContextMenu from "./ContextMenu";

export default class ContextMenuController {
  constructor(listControlled, prefixSelector) {
    this.optionsControlled = listControlled;
    this.prefixSelector = prefixSelector;
    this.objectsControlled = [];
    this.opened = [];
    
    this.start();
  }
  
  start = () => {
    this.optionsControlled.forEach((item, index) => {
      const nodeContextMenu = document.querySelector(`.${this.prefixSelector + item.selector}`);
      const nodeToggleBtn = document.querySelector(`.${this.prefixSelector + item.btnSelector}`);
      
      this.objectsControlled.push(
        new ContextMenu({
          nodeContextMenu,
          nodeToggleBtn,
          activeClass: item.activeClass,
          hideMainScrolling: item.hideMainScrolling,
          btnActiveClass: item.btnActiveClass,
        })
      );
  
      nodeToggleBtn.addEventListener('click', () => {
        this.handleClickToggleButton(index);
      })
    })
  }
  
  handleClickToggleButton = (index) => {
    const indexInOpened = this.opened.findIndex(item => item.index === index);
    
    if (indexInOpened >= 0) {
      return this.closeControlled(index, indexInOpened)
    }
  
    this.opened.forEach(item => {
      this.objectsControlled[item.index].close();
      document.removeEventListener('click', item.listenerDocumentClick);
    });
    this.opened = [];
    
    this.openControlled(index);
  }
  
  openControlled = (index) => {
    const listenerDocumentClick = (e) => {
      if (!this.objectsControlled[index].nodeContextMenu.contains(e.target) && (!this.objectsControlled[index].nodeToggleBtn.contains(e.target))) {
        this.closeControlled(index, 0);
      }
    }
    
    document.addEventListener('click', listenerDocumentClick)
    
    this.objectsControlled[index].open();
    this.opened.push({
      index,
      listenerDocumentClick,
    })
  }
  
  closeControlled = (index, indexInOpened) => {
    document.removeEventListener('click', this.opened[indexInOpened].listenerDocumentClick)
    
    this.objectsControlled[index].close();
    this.opened.splice(indexInOpened, 1);
  }
}