export default class PopupController {
  static #instance = null;
  
  constructor(popups) {
    if (PopupController.#instance) {
      return PopupController.#instance;
    }
  
    PopupController.#instance = this;
    
    this.popupNodes = [];
    this.openedIndex = null;
    this.currentActiveStateNode = null;
    this.bodyNode = document.querySelector('body');
    
    popups.forEach((item) => {
      const popupNode = document.querySelector(item.popupSelector);
      const btnNode = document.querySelector(item.btnSelector);
      
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
      
      this.popupNodes.push({
        id: item.id,
        popupNode,
        btnNode,
      });
      
      const index = this.popupNodes.length - 1;
  
      btnNode.addEventListener('click', () => {
        this.handleOpenPopup(index);
      })
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
    if (this.openedIndex === index) {
      return this.closePopup(this.openedIndex);
    }
    
    if (this.openedIndex !== null) {
      this.closePopup(this.openedIndex);
    }
  
    this.openPopup(index);
  }
  
  openPopup = (index) => {
    const popupNode = this.popupNodes[index].popupNode;
    const btnNode = this.popupNodes[index].btnNode;
  
    this.openedIndex = index;
    this.bodyNode.classList.add('noScrolling');
    
    popupNode.classList.add('active');
    btnNode.classList.add('active');
  
    document.removeEventListener('click', this.docClickListener);
    
    this.docClickListener = (e) => {
      if (!popupNode.contains(e.target) && !btnNode.contains(e.target)) {
        this.closePopup(index);
      }
    }
    
    document.addEventListener('click', this.docClickListener);
  }
  
  closePopup = (index) => {
    this.popupNodes[index].popupNode.classList.remove('active');
    this.popupNodes[index].btnNode.classList.remove('active');
    
    this.openedIndex = null;
    this.bodyNode.classList.remove('noScrolling');
    
    document.removeEventListener('click', this.docClickListener);
  }
}