import fetch from "node-fetch";
import {getFormatDate} from "../utils/functions.js";

let now = () => getFormatDate(new Date().toString(), '-', ['y', 'm', 'd'], false, "")

let confing = {
    oAuth: "y0_AgAAAABGbH3nAAjx_AAAAADX0BTTJK-O3zY6SDeJPnPS5GkGIUjtK7c",
    url: "https://api-metrika.yandex.net/cdp/api/v1/counter",
    counter: 69707947,
    get_url(p, a, ...args) {
        let urls = {
            product: {
                rebase: x => `/${x}/data/orders?merge_mode=SAVE`,
                append: x => `/${x}/data/orders?merge_mode=APPEND`,
                update: x => `/${x}/data/orders?merge_mode=UPDATE`
            }, user: {
                rebase: x=>`/${x}/data/contacts?merge_mode=SAVE`,
                append: x=>`/${x}/data/contacts?merge_mode=APPEND`,
                update: x=>`/${x}/data/contacts?merge_mode=UPDATE`,
            }
        }
        let parent = urls[p]
        if (!parent) throw "No support " + p
        let action = parent[a]
        if (!action) throw  "No support " + a
        action.call && (action = action(this.counter, ...args))
        return `${this.url}${action}`
    },
    status: {
        "created": "new",
        "awaited": "wait",
        "confirmed": "success",
        "fail": "cancel",
        "rejected": "cancel",
        "expire": "expire"
    },
    payloads: {
        user: (client_id, name, ya_id, email, is_create = false) => ({
            "contacts": [{
                "uniq_id": client_id,
                "name": name,
                ...(!is_create ? {} : {"create_date_time": now()}),
                "update_date_time": now(),
                "client_ids": [ya_id],
                "emails": [email],
                "phones": [],
            }]
        }),
        product: (id, client_id, amount, status, is_create = false, is_finish = false) => ({
            "orders": [{
                "id": id.toString(),
                "client_uniq_id": client_id.toString(),
                "client_type": "CONTACT",
                ...(!is_create ? {} : {"create_date_time": now()}),
                "update_date_time": now(),
                ...(!is_finish ? {"finish_date_time": null} : {"finish_date_time": now()}),
                "revenue": amount,
                "order_status": confing.status[status],
                "cost": 0,
            }]
        })
    }
}

async function connect(url, body, method) {
    return fetch(url, {
        method, body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `OAuth ${confing.oAuth}`
        }
    })
}

export default {

    async updateStatus(id, client_id, status, is_finish=false) {
        let url = confing.get_url("product", 'update')
        let payload = confing.payloads.product(id, client_id, undefined, status, true, is_finish)
        let req = await connect(url, payload, 'post')
        let data = await req.json()
    },

    async addUser(name, client_id, ya_id, email) {
        let url = confing.get_url("user", "append")
        let payload = confing.payloads.user(client_id, name, ya_id, email, true)
        let req = await connect(url, payload, "post")
        let data = await req.json()
        if (req.status > 399) console.log(data)
    },

    getUser() {

    },

    async addProduct(id, client_id, amount) {
        let url = confing.get_url("product", "append")
        let payload = confing.payloads.product(id, client_id, amount, "created", true)
        let req = await connect(url, payload, "post")
        let data = await req.json()
    },

}