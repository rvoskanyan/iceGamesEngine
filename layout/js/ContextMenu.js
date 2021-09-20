export default class ContextMenu {
  constructor(options) {
    const {
      nodeContextMenu,
      nodeToggleBtn,
      activeClass,
      hideMainScrolling,
      btnActiveClass,
    } = options;
    
    this.nodeContextMenu = nodeContextMenu;
    this.nodeToggleBtn = nodeToggleBtn;
    this.activeClass = activeClass;
    this.hideMainScrolling = hideMainScrolling;
    this.btnActiveClass = btnActiveClass;
  }
  
  open = () => {
    this.nodeContextMenu.classList.toggle(this.activeClass);
    if (this.btnActiveClass) {
      this.nodeToggleBtn.classList.toggle(this.btnActiveClass);
    }
    if (this.hideMainScrolling) {
      document.body.classList.add('noScrolling');
    }
  }
  
  close = () => {
    this.nodeContextMenu.classList.toggle(this.activeClass);
    if (this.btnActiveClass) {
      this.nodeToggleBtn.classList.toggle(this.btnActiveClass);
    }
    if (this.hideMainScrolling) {
      document.body.classList.remove('noScrolling');
    }
  }
}