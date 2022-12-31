import Postman from "../Postman.js";

const default_url = document.location.origin+'/'
class Payment {
    #_options = {
        method: '',
        request: new Postman(),
        base_url: '/',
        currency: 'RUB'
    }

    #_events = {
        initial:null
    }

    constructor(method, {base_url='/', currency='RUB'}) {
        this.#_options.method = method
        this.#_options.base_url = base_url
        this.#_callEvent('initial', this, {method, type:'initial', base_url})
    }

    eventListener(event, callback) {
        let ev = this.#_events[event]
        if (ev === undefined) {
            console.warn("This is event don't support")
            return
        }
        this.#_events[event] = callback
    }

    #_callEvent(event, context, ...args) {
        let a = this.#_events[event]
        if (a && a.call) {
            a.call(context, ...args)
        }
    }

    async checkout(product_ids, isTwo, email, orderId, yaClientId) {
        let response = await this.#_options.request.post(
          this.#_options.base_url + 'api/beta/payment/checkout/' + this.#_options.method,
          {products: product_ids, isTwo, email, orderId, yaClientId}
        );

        return await response.json();
    }

    static async get_method(base_url) {
        base_url = base_url || default_url;

        const response = await new Postman().get(base_url + 'api/beta/payment/method')
        const result = await response.json();
        const method = result.data;

        if (result.err) {
            return null;
        }

        return new Payment(method._id, {base_url});
    }

    static check_order(orderId) {
        if (!orderId) throw "orderId is required"
        let post = new Postman().post(default_url+"api/beta/payment/checkout/status", {
            orderId
        })
        return post.then(a => a.json())
    }
}

export default Payment