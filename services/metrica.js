import fetch from "node-fetch";
import {getFormatDate} from "../utils/functions.js";
import FormData from "form-data";
let now = () => getFormatDate(new Date().toString(), '-', ['y', 'm', 'd'], false, "")

let confing = {
    oAuth: "y0_AgAAAABGbH3nAAjx_AAAAADX0BTTJK-O3zY6SDeJPnPS5GkGIUjtK7c",
    url_crm: "https://api-metrika.yandex.net/cdp/api/v1/counter",
    url_manage: "https://api-metrika.yandex.net/management/v1/counter",
    counter: 69707947,
    get_url(p, a, is_crm, ...args) {
        let urls = {
            product: {
                rebase: x => `/${x}/data/orders?merge_mode=SAVE`,
                append: x => `/${x}/data/orders?merge_mode=APPEND`,
                update: x => `/${x}/data/orders?merge_mode=UPDATE`
            }, user: {
                rebase: x => `/${x}/data/contacts?merge_mode=SAVE`,
                append: x => `/${x}/data/contacts?merge_mode=APPEND`,
                update: x => `/${x}/data/contacts?merge_mode=UPDATE`,
            },
            conversion: {
                offline: x=>`/${x}/offline_conversions/upload?client_id_type=CLIENT_ID`,
            }
        }
        let parent = urls[p]
        if (!parent) throw "No support " + p
        let action = parent[a]
        if (!action) throw  "No support " + a
        action.call && (action = action(this.counter, ...args))
        return `${is_crm ? this.url_crm : this.url_manage}${action}`
    },
    
    // !!!НЕ ИЗМЕНЯТЬ!!! key - внутреннее обозначение, value - обозначение в яндексе.
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

async function connect(url, body, method, isJson=true) {
    let headers = {
        "Authorization": `OAuth ${confing.oAuth}`
    }
    if (isJson) {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(body)
    }
    return fetch(url, {
        method, body,
        headers
    })
}

export default {

    async updateStatus(id, client_id, status, is_finish = false) {
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

    async offlineConversation(clientId, target, price, currency = 'RUB') {
        let getUnixTimeUTC = now => Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())/1000)
        let dateTime = getUnixTimeUTC(new Date())
        let data = [
            ['ClientId', "Target", "DateTime", "Price", "Currency"],
            [clientId, target, dateTime, price, currency]
        ];
        let csv = "";
        let seperator = ',';
        for (let i of data) {
            csv += i.join(seperator) + '\n';
        }
        let form = new FormData()
        let csv_buffer = Buffer.from(csv, 'utf-8')
        form.append("file", csv_buffer, {contentType: 'text/csv', filename: 'data.csv'})
        let url = confing.get_url("conversion", 'offline', false)
        let req = await connect(url, form, "POST", false)
        if (req.status > 399) {
            throw await req.json()
        }
        return await req.json()
    }
}