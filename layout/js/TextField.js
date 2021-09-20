export default class TextField {
  constructor(options) {
    const {
      nodeLabel,
      nodeField,
      labelInField,
    } = options;
    
    this.nodeLabel = nodeLabel;
    this.nodeFiled = nodeField;
    this.labelInField = labelInField || false;
    
    this.start();
  }
  
  start = () => {
    if (this.labelInField) {
      this.nodeFiled.addEventListener('change', () => {
        this.nodeFiled.value.length ? this.nodeLabel.classList.add('active') : this.nodeLabel.classList.remove('active')
      })
    }
  }
}