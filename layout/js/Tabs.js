export default class Tabs {
  constructor(options) {
    const {
      mainNode,
    } = options;
    
    this.mainNode = mainNode;
    this.tabBtnNodes = this.mainNode.querySelectorAll('.js-tabBtn');
    this.activeTabBtnNode = this.tabBtnNodes[0];
    
    this.tabBtnNodes.forEach(item => {
      item.addEventListener('click', this.switchTab)
    });
  }
  
  switchTab = (e) => {
    const targetNode = e.target;
    
    if (this.activeTabBtnNode === targetNode) {
      return;
    }
    
    const fromTabId = this.activeTabBtnNode.dataset.targetId;
    const toTabId = targetNode.dataset.targetId;
    
    this.activeTabBtnNode.classList.remove('active');
    targetNode.classList.add('active');
  
    this.activeTabBtnNode = targetNode;
    
    this.mainNode.querySelector(`.js-tabBlock-${fromTabId}`).classList.remove('active');
    this.mainNode.querySelector(`.js-tabBlock-${toTabId}`).classList.add('active');
  }
}