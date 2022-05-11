export default class PopupController {
  static #instance = null;
  
  constructor(popups) {
    if (PopupController.#instance) {
      return PopupController.#instance;
    }
    
    PopupController.#instance = this;
    
    this.popupNodes = [];
    this.openedIndex = null;
    this.openedChildIndex = null;
    this.currentActiveStateNode = null;
    this.bodyNode = document.querySelector('body');
    
    popups.forEach((item) => {
      const popupNode = document.querySelector(item.popupSelector);
      const btnNode = document.querySelector(item.btnSelector);
      const closeBtnNode = document.querySelector(item.closeBtnSelector);
      
      if (!popupNode || !btnNode) {
        return;
      }
      
      if (item.states?.length) {
        item.states.forEach(item => {
          const btnActiveStateNode = popupNode.querySelector(item.btnSelector);
          const blockStateNode = popupNode.querySelector(item.blockSelector);
          
          if (item.isDefault) {
            this.currentActiveStateNode = blockStateNode;
          }
          
          btnActiveStateNode.addEventListener('click', () => {
            if (this.currentActiveStateNode !== blockStateNode) {
              this.currentActiveStateNode.classList.remove('active');
              blockStateNode.classList.add('active');
              
              this.currentActiveStateNode = blockStateNode;
            }
          })
        })
      }
      
      if (item.children?.length) {
        item.children.forEach(item => {
          const popupNode = document.querySelector(item.popupSelector);
          const btnNode = document.querySelector(item.btnSelector);
          const closeBtnNode = document.querySelector(item.closeBtnSelector);
          
          if (!popupNode || !btnNode) {
            return;
          }
          
          this.popupNodes.push({
            id: item.id,
            popupNode,
            btnNode,
            closeBtnNode,
            children: true,
          });
          
          const index = this.popupNodes.length - 1;
          
          btnNode.addEventListener('click', () => {
            this.handleOpenPopup(index);
          })
          
          if (closeBtnNode) {
            closeBtnNode.addEventListener('click', () => {
              this.closePopup(index);
            })
          }
        })
      }
      
      this.popupNodes.push({
        id: item.id,
        popupNode,
        btnNode,
        closeBtnNode,
      });
      
      const index = this.popupNodes.length - 1;
      
      btnNode.addEventListener('click', () => {
        this.handleOpenPopup(index);
      })
      
      if (closeBtnNode) {
        closeBtnNode.addEventListener('click', () => {
          this.closePopup(index);
        })
      }
    });
  }
  
  activateById = (id) => {
    const index = this.popupNodes.findIndex(item => item.id === id);
    
    if (index === -1 || index === this.openedIndex) {
      return;
    }
    
    this.openPopup(index);
  }
  
  handleOpenPopup = (index) => {
    const popup = this.popupNodes[index];
    
    if (this.openedIndex === index) {
      return this.closePopup(this.openedIndex);
    }
    
    if (this.openedIndex !== null && !popup.children) {
      this.closePopup(this.openedIndex);
    }
    
    this.openPopup(index);
  }
  
  openPopup = (index) => {
    const popup = this.popupNodes[index];
    const popupNode = popup.popupNode;
    const btnNode = popup.btnNode;
    
    popupNode.classList.add('active');
    btnNode.classList.add('active');
    
    if (popup.children) {
      return this.openedChildIndex = index;
    }
    
    this.openedIndex = index;
    this.bodyNode.classList.add('noScrolling');
    
    document.removeEventListener('click', this.docClickListener);
    
    this.docClickListener = (e) => {
      if (!popupNode.contains(e.target) && !btnNode.contains(e.target)) {
        this.closePopup(index);
      }
    }
    
    document.addEventListener('click', this.docClickListener);
  }
  
  closePopup = (index) => {
    const popup = this.popupNodes[index];
    
    popup.popupNode.classList.remove('active');
    popup.btnNode.classList.remove('active');
    
    if (popup.children) {
      return this.openedChildIndex = null;
    }
    
    if (this.openedChildIndex) {
      const childPopup = this.popupNodes[this.openedChildIndex];
      
      childPopup.popupNode.classList.remove('active');
      childPopup.btnNode.classList.remove('active');
      this.openedChildIndex = null;
    }
    
    this.openedIndex = null;
    this.bodyNode.classList.remove('noScrolling');
    
    document.removeEventListener('click', this.docClickListener);
  }
}