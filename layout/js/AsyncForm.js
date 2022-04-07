import Postman from './Postman.js';

export default class AsyncForm {
  constructor(options) {
    this.mainNode = options.mainNode;
    this.fields = this.mainNode.querySelectorAll('input');
    this.mainNode.addEventListener('submit', this.handleSubmit);
    this.messageNode = this.mainNode.querySelector('.responseMessage');
    this.successHandler = options.successHandler;
    
    this.postman = new Postman();
  }
  
  handleSubmit = async (e) => {
    const params = {};
    
    e.preventDefault();
  
    this.fields.forEach(({name, value}) => {
      if (typeof value === 'string' && value.length > 0) {
        params[name] = value;
      }
    })
    
    const response = await this.postman.post(this.mainNode.action, params);
    const result = await response.json();
    
    if (result.error) {
      this.messageNode.classList.add('error');
    } else {
      this.messageNode.classList.remove('error');
  
      if (this.successHandler) {
        this.successHandler();
      }
    }
    
    this.messageNode.innerText = result.message;
  }
}