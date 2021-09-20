export default class Tabs {
  constructor(options) {
    const {
      nodeTabs,
      nodesBtn,
      nodeActiveBtn,
    } = options;
    
    this.nodeTabs = nodeTabs;
    this.nodesBtn = nodesBtn;
    this.nodeActiveBtn = nodeActiveBtn;
    
    this.start();
  }
  
  start = () => {
    this.nodesBtn.forEach(item => {
      item.addEventListener('click', (e) => {
        if (this.nodeActiveBtn === item) {
          return;
        }
        
        this.switch(e);
      })
    })
  }
  
  switch = (e) => {
    const btnFrom = this.nodeActiveBtn;
    const btnTo = e.target;
    const targetsFrom = this.nodeTabs.querySelectorAll(`.js-tabsTarget-${btnFrom.dataset.target}`);
    const targetsTo = this.nodeTabs.querySelectorAll(`.js-tabsTarget-${btnTo.dataset.target}`);
    
    btnFrom.classList.remove('active');
    btnTo.classList.add('active');
    
    targetsFrom.forEach(item => {
      item.classList.add('hide');
    })
  
    targetsTo.forEach(item => {
      item.classList.remove('hide');
    })
  
    this.nodeActiveBtn = btnTo;
    
    const setAttribute = btnTo.dataset.setattribute;
    
    if (!setAttribute) {
      return;
    }
    
    this.setAttribute(JSON.parse(setAttribute));
  }
  
  setAttribute = (attributes) => {
    attributes.forEach(({name, value, selectorTarget, children}) => {
      if (((!name || !name.length) && !children) || !value || !value.length || !selectorTarget || !selectorTarget.length) {
        return;
      }
  
      const nodeTarget = this.nodeTabs.querySelector(`.js-${selectorTarget}`);
  
      if (!nodeTarget) {
        return;
      }
      
      if (children) {
        return nodeTarget.innerHTML = value;
      }
  
      nodeTarget.setAttribute(name, value);
    })
  }
}