export default class Modal {
  constructor(options) {
    const {
      contentNode,
      switching = false,
      elems,
      activeIndex,
    } = options;
    
    this.contentNode = contentNode;
    this.switching = switching;
    this.elems = elems;
    this.activeIndex = activeIndex;
    
    this.body = document.querySelector('body');
    this.mainNode = document.createElement('div');
    this.closeBtn = document.createElement('button');
    
    if (this.switching) {
      this.prevBtn = document.createElement('button');
      this.nextBtn = document.createElement('button');
  
      this.prevBtn.addEventListener('click', () => this.switchElem(this.activeIndex - 1));
      this.nextBtn.addEventListener('click', () => this.switchElem(this.activeIndex + 1));
  
      this.prevBtn.classList.add('btn', 'prevModal');
      this.nextBtn.classList.add('btn', 'nextModal');
  
      this.mainNode.append(this.prevBtn);
      this.mainNode.append(this.nextBtn);
    }
    
    this.mainNode.classList.add('modal', 'active');
    this.closeBtn.classList.add('btn', 'close');
    
    this.mainNode.addEventListener('click', this.close);
    this.closeBtn.addEventListener('click', this.close);
    
    this.closeBtn.innerText = 'X'
    this.mainNode.append(this.closeBtn);
    this.mainNode.append(this.switching ? this.elems[this.activeIndex] : this.contentNode);
  
    this.body.prepend(this.mainNode);
    this.body.classList.add('noScrolling');
  }
  
  close = (e) => {
    if (e.target === e.currentTarget) {
      this.mainNode.remove();
      this.body.classList.remove('noScrolling');
    }
  }
  
  switchElem = (index) => {
    this.elems[this.activeIndex].remove();
    
    this.activeIndex = index;
    
    if (this.activeIndex < 0) {
      this.activeIndex = this.elems.length - 1;
    }
    
    if (this.activeIndex + 1 > this.elems.length) {
      this.activeIndex = 0;
    }
    
    this.mainNode.append(this.elems[this.activeIndex]);
  }
}