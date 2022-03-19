export default class {
  constructor(options) {
    this.mainNode = options.mainNode;
    this.blockNode = this.mainNode.querySelector('.js-promptBlock');
    this.openNode = this.mainNode.querySelector('.js-promptOpen');
    this.closeNode = this.mainNode.querySelector('.js-promptClose');
    
    this.openNode.addEventListener('click', this.open);
    this.closeNode.addEventListener('click', this.close);
  }
  
  open = () => {
    this.blockNode.classList.add('active');
  }
  
  close = () => {
    this.blockNode.classList.remove('active');
  }
}