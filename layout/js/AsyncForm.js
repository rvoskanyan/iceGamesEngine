import Postman from './Postman.js';

export default class AsyncForm {
  constructor(options) {
    this.mainNode = options.mainNode;
    this.fields = this.mainNode.querySelectorAll('input');
    this.autoSizeInputNodes = this.mainNode.querySelectorAll('.autoSizeInput');
    this.mainNode.addEventListener('submit', this.handleSubmit);
    this.messageNode = options.resultMessageNode;
    this.successHandler = options.successHandler;
    this.extraParams = options.extraParams || [];
    this.validationMethods = {};
    this.sendParams = {};
    
    this.setValidationMethods = (name) => {
      const errorElemNode = this.mainNode.querySelector(`.js-error-${name}`);
      
      if (this.validationMethods[name]) {
        return;
      }
      
      this.validationMethods[name] = {
        setError: () => {
          errorElemNode.classList.add('error');
        },
        removeError: () => {
          errorElemNode.classList.remove('error');
        }
      }
    }
    
    this.fields.forEach(field => {
      const {
        name,
      } = field;
      
      this.setValidationMethods(name);
    });
  
    this.autoSizeInputNodes.forEach(autoSizeInputNode => {
      const name = autoSizeInputNode.dataset.name;
  
      this.setValidationMethods(name);
    });
    
    this.postman = new Postman();
  }
  
  validate = (validErrors) => {
    validErrors.forEach(validError => this.validationMethods[validError].setError());
  }
  
  handleSubmit = async (e) => {
    e.preventDefault();
    this.sendParams = {};
  
    this.fields.forEach(field => {
      const {
        name,
        value,
        type,
        checked,
      } = field;
      
      if (type === 'submit') {
        return;
      }
      
      if (type === 'radio' || type === 'checkbox') {
        if (!checked) {
          return;
        }
      }
      
      if (typeof value === 'string' && value.length > 0) {
        this.sendParams[name] = value;
      }
    })
  
    this.autoSizeInputNodes.forEach(autoSizeInputNode => {
      const name = autoSizeInputNode.dataset.name;
      const value = autoSizeInputNode.querySelector('.value').innerText;
  
      if (typeof value === 'string' && value.length > 0) {
        this.sendParams[name] = value;
      }
    })
  
    this.extraParams.forEach(extraParam => {
      const value = this.mainNode.dataset[extraParam];
      
      if (typeof value === 'string' && value.length > 0) {
        this.sendParams[extraParam] = value;
      }
    })
  
    if (window.yaCounter69707947?.getClientID) {
      this.sendParams.yaClientId = yaCounter69707947.getClientID()
    }
    
    const response = await this.postman.post(this.mainNode.action, this.sendParams);
    const result = await response.json();
    
    if (result.validErrors) {
      this.validate(result.validErrors);
    }
  
    if (!result.error && this.successHandler) {
      this.successHandler(this.sendParams, result);
    }
    
    if (!this.messageNode) {
      return;
    }
    
    if (result.error) {
      this.messageNode.classList.add('error');
    } else {
      this.messageNode.classList.remove('error');
    }
    
    this.messageNode.innerText = result.message;
  }
}
