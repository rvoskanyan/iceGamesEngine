export default class Postman {
  static #instance = null;
  
  constructor() {
    if (Postman.#instance) {
      return Postman.#instance;
    }
    
    Postman.#instance = this;
  }
  
  get = (url, params) => {
    const newUrl = new URL(url);
  
    params && Object.entries(params).forEach(([key, value]) => {
      newUrl.searchParams.append(key, value);
    });
    
    return this.query({
      url: newUrl,
      method: 'GET',
    });
  }
  
  post = (url, params) => {
    return this.query({
      url,
      params,
      method: 'POST',
    });
  }
  
  put = (url, params) => {
    return this.query({
      url,
      params,
      method: 'PUT',
    });
  }
  
  delete = (url) => {
    return this.query({
      url,
      method: 'DELETE',
    });
  }
  
  query = (options) => {
    const {
      url,
      method,
      params = {},
    } = options;
    
    const init = {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    }
    
    if (method !== 'GET') {
      init.body = JSON.stringify(params);
    }
  
    return fetch(url, init);
  }
}