export default class Modal {
  constructor(contentNode) {
    this.body = document.querySelector('body');
    this.mainNode = document.createElement('div');
    this.closeBtn = document.createElement('button');
    
    this.mainNode.classList.add('modal');
    this.closeBtn.classList.add('btn', 'close');
    
    this.mainNode.addEventListener('click', this.close);
    this.closeBtn.addEventListener('click', this.close);
    
    this.closeBtn.innerText = 'X'
    this.mainNode.append(this.closeBtn);
    this.mainNode.append(contentNode);
  
    this.body.prepend(this.mainNode);
    this.body.classList.add('noScrolling');
  }
  
  close = (e) => {
    if (e.target === e.currentTarget) {
      this.mainNode.remove();
      this.body.classList.remove('noScrolling');
    }
  }
}