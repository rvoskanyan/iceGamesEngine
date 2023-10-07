export default class Range {
  constructor (options) {
    const {
      mainNode,
      min,
      max,
      points,
    } = options;
    
    this.mainNode = mainNode;
    this.max = max;
    this.min = min;
    this.width = parseFloat(getComputedStyle(this.mainNode).width);
    this.pointObjects = [];
    this.changeListeners = [];
    
    points.forEach((point, index) => {
      const pointNode = document.createElement('div');
      const pointObject = {
        node: pointNode,
        value: point.value,
        name: pointNode.name,
      };
      
      this.pointObjects.push(pointObject);
      
      pointNode.classList.add('point');
      pointNode.innerText = point.value;
  
      mainNode.append(pointNode);
      
      if (!this.step) {
        pointNode.innerText = max;
  
        const maxPointWidth = parseFloat(getComputedStyle(pointNode).width);
        const rangeWidth = parseFloat(getComputedStyle(this.mainNode).width);
        
        this.rangeWidth = rangeWidth;
  
        this.step = (max - min) / (rangeWidth - maxPointWidth);
        pointNode.innerText = point.value;
      }
  
      pointNode.style.left = `${(point.value - min) / this.step}px`;
  
      pointNode.addEventListener('mousedown', this.downPointListener);
      pointNode.addEventListener('touchstart', this.downPointListener);
      pointNode.addEventListener('changeValue', (e) => {
        this.pointObjects[index].value = +e.target.innerText;
        this.dispatchChange();
      })
    });
  }
  
  downPointListener = async (e) => {
    const pointNode = e.target;
  
    this.prevActivePoint && (this.prevActivePoint.style.zIndex = 'initial');
    this.prevActivePoint = pointNode;
    pointNode.style.zIndex = '1';
    
    if (pointNode === document.activeElement) {
      return;
    }
    
    document.addEventListener('mousemove', this.moveListener);
    document.addEventListener('touchmove', this.moveListener);
    
    document.addEventListener('mouseup', this.upDocumentListener);
    document.addEventListener('touchend', this.upDocumentListener);
  
    this.currentActivePoint = pointNode;
    this.cursorStartPosition = e.pageX || e.changedTouches[0].clientX;
    this.pointStartPosition = parseInt(getComputedStyle(pointNode).left);
  }
  
  moveListener = (e) => {
    const pointNode = this.currentActivePoint;
    const cursorStartPosition = this.cursorStartPosition;
    const pointStartPosition = this.pointStartPosition;
    const pointWidth = parseFloat(getComputedStyle(pointNode).width);
    const rangeWidth = this.rangeWidth;
    let offset;
    
    this.pointMovied = true;
    e.preventDefault();
  
    if (e.pageX) {
      offset = e.pageX - cursorStartPosition;
    } else {
      offset = e.changedTouches[0].clientX - cursorStartPosition
    }
    
    let position = offset + pointStartPosition;
    let pointValue = Math.round(position * this.step + this.min);
  
    if (position > rangeWidth - pointWidth) {
      position = rangeWidth - pointWidth;
      pointValue = this.max;
    }
  
    if (position < 0) {
      position = 0;
      pointValue = this.min;
    }
  
    pointNode.style.left = `${position}px`;
    pointNode.innerText = pointValue;
  }
  
  upDocumentListener = (e) => {
    const pointNode = this.currentActivePoint;
    
    document.removeEventListener('mousemove', this.moveListener);
    document.removeEventListener('touchmove', this.moveListener);
  
    document.removeEventListener('mouseup', this.upDocumentListener);
    document.removeEventListener('touchend', this.upDocumentListener);
    
    if (!this.pointMovied) {
      const range = document.createRange();
      const sel = window.getSelection();
      
      pointNode.setAttribute('contenteditable', '');
      
      range.selectNodeContents(pointNode);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      
      pointNode.addEventListener('keypress', this.pointKeypressListener);
      pointNode.addEventListener('blur', this.pointBlurListener);
      
      return;
    }
    
    this.pointMovied = false;
    pointNode.dispatchEvent(new Event('changeValue'));
  }
  
  pointKeypressListener = (e) => {
    const pointNode = e.target;
    
    if (e.key === 'Enter') {
      e.returnValue = false;
      return pointNode.blur();
    }
    
    const value = parseInt(pointNode.innerText) || 0;
    const num = parseInt(e.key);
    
    if ((num !== 0 && !num) || !(value <= this.max)) {
      e.returnValue = false;
      
      if (e.preventDefault) {
        e.preventDefault();
      }
    }
    
    if (pointNode.innerText[0] === '0') {
      pointNode.innerText = pointNode.innerText.replace(/^0+/, '');
    }
  }
  
  pointBlurListener = (e) => {
    const pointNode = e.target;
    const max = this.max;
    const min = this.min;
    let value = +pointNode.innerText;
    
    if (value > max) {
      value = max;
    } else if (value < min) {
      value = min;
    }
  
    pointNode.innerText = value;
    
    pointNode.removeEventListener('keypress', this.pointKeypressListener);
    pointNode.removeEventListener('blur', this.pointBlurListener);
    
    pointNode.removeAttribute('contenteditable');
  
    pointNode.style.left = `${(value - this.min) / this.step}px`;
    pointNode.dispatchEvent(new Event('changeValue'));
  }
  
  addChangeListener = (listener) => {
    this.changeListeners.push(listener);
  }
  
  dispatchChange = () => {
    this.changeListeners.forEach(listener => listener(this.pointObjects.map(item => ({value: item.value, name: item.name}))))
  }
}