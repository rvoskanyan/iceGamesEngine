export default class Modal {
  constructor(contentNode) {
    this.body = document.querySelector('body');
    this.mainNode = document.createElement('div');
    this.modalContainer = document.createElement('div');
    this.closeBtn = document.createElement('button');
    this.modalContent = document.createElement('div');
    
    this.mainNode.classList.add('modal');
    this.modalContainer.classList.add('modalContainer');
    this.closeBtn.classList.add('btn', 'close');
    this.modalContent.classList.add('modalContent');
    
    this.modalContainer.addEventListener('click', this.close);
    this.closeBtn.addEventListener('click', this.close);
    
    this.modalContent.append(contentNode);
    this.closeBtn.innerText = 'X'
    this.modalContainer.append(this.closeBtn);
    this.modalContainer.append(this.modalContent);
    this.mainNode.append(this.modalContainer);
  
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