export default class Turn {
  static #instance = null;
  
  constructor() {
    if (Turn.#instance) {
      return Turn.#instance;
    }
    
    this.status = 'wait';
    this.turnFunctions = [];
  }
  
  push = (func) => {
    this.turnFunctions.push(func);
    
    if (this.status === 'wait') {
      this.status = 'completion';
      this.completion().then();
    }
  }
  
  completion = async () => {
    const func = this.turnFunctions.shift();
    
    await func();
    
    if (this.turnFunctions.length) {
      return this.completion();
    }
  
    this.status = 'wait';
  }
}