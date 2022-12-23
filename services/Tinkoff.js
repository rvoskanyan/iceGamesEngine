import fetch from "node-fetch";

export default class Tinkoff {
  #_options = {
    debug: true,
    dev_url: "https://rest-api-test.tinkoff.ru/v2",
    prod_url: "https://securepay.tinkoff.ru/v2",
    urls: {
      init: '/Init/'
    },
    currency: {
      RUB: 643
    }
  }
  #_terminalKey = null; // terminalKey - This a secretToken
  #_password = null; // password - This a privateToken
  
  constructor(terminalKey, password, debug = true) {
    this.#_terminalKey = terminalKey
    this.#_password = password
    this.#_options.debug = debug
  }
  
  get_currency(currency) {
    return this.#_options.currency[currency] || this.#_options.currency.RUB
  }
  
  #_get_url(url) {
    let base = this.#_options.debug ? this.#_options.dev_url : this.#_options.prod_url
    return `${base}${this.#_options.urls[url]}`
  }
  
  async checkout(amount, orderId, token = undefined, currency = 'RUB', isTwo, receipt) {
    currency = this.get_currency(currency)
    let url = this.#_get_url('init')
    let get_success = isTwo ? `https://icegames.store/cart?step=2&OrderId=${orderId}` : 'https://icegames.store/'
    
    let res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        TerminalKey: this.#_terminalKey,
        Currency: currency,
        Amount: amount*100,
        OrderId: orderId.toString(),
        Token: token,
        SuccessURL: get_success,
        NotificationURL: "https://icegames.store/webhook/v1/tinkoff",
        Receipt: receipt,
      })
    })
    
    let data = await res.json()
    
    if (data.Success) {
      let {orderId, PaymentId, PaymentURL} = data
      return {PaymentURL, PaymentId, orderId}
    } else {
      console.log(data)
    }
    /*
    * {
       "Success" : true, //success or false = error
       "ErrorCode" : "0", // success
       "TerminalKey" : "TinkoffBankTest",
       "Status" : "NEW",
       "PaymentId": "13660", // session for payment
       "OrderId" : "21050", // our order Id
       "Amount" : 100000, // amount
       "PaymentURL" : "https://securepay.tinkoff.ru/rest/Authorize/1B63Y1" //checkout url
     }
    * */
  }
}