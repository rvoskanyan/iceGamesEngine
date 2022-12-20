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

    async checkout(product_ids, isTwo, email) {
        let post = await this.#_options.request.post(this.#_options.base_url+'api/beta/payment/checkout/'+this.#_options.method, {products:product_ids, isTwo, email})
        let data = await post.json()

        return data.checkout
    }

    static get_method(base_url) {
        if (!base_url) base_url = default_url
        console.log(base_url)
        let post = new Postman().get(base_url+'api/beta/payment/methods')
        return post.then(data=>data.json()).then(p=>{
            let a = []
            let {data} = p
            console.log(data, p)
            for (let i of data) {
                a.push(new Payment(i._id, {base_url}))
            }
            if (!!a.length) return  a[0]
            return null
        })
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