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
    
    params.entries.forEach(([key, value]) => {
      newUrl.searchParams.append(key,value);
    });
    
    return this.query({
      newUrl,
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
  
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(params)
    });
  }
}