import fetch from "node-fetch";
import FormData from "form-data";
import exceljs from "exceljs";

const config = {
    oAuth: "y0_AgAAAABI7bx8AAor1AAAAADnk05ycOfEiiaoR82cU3Ky_vgCooUV7IE",
    url_crm: "https://api-metrika.yandex.net/cdp/api/v1/counter",
    url_manage: "https://api-metrika.yandex.ru/management/v1/counter",
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
}

async function connect(url, body, method) {
    return fetch(url, {
        headers: {
            "Authorization": `OAuth ${config.oAuth}`
        },
        method,
        body,
    })
}

export default {

    async offlineConversation(clientId, target, price, currency = 'RUB') {
        const getUnixTimeUTC = now => Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())/1000)
        const dateTime = getUnixTimeUTC(new Date());
        const url = config.get_url("conversion", 'offline', false);
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Products In Stock');
        const form = new FormData();
        
        worksheet.columns = [
            {header: 'ClientId', key: 'ClientId'},
            {header: 'Target', key: 'Target'},
            {header: 'DateTime', key: 'DateTime'},
            {header: 'Price', key: 'Price'},
            {header: 'Currency', key: 'Currency'},
        ];
    
        worksheet.addRow({
            ClientId: clientId,
            Target: target,
            DateTime: dateTime,
            Price: price,
            Currency: currency,
        })
        
        const csv_buffer = await workbook.csv.writeBuffer();
    
        form.append("file", csv_buffer, {contentType: 'text/csv', filename: 'data.csv'})
        
        let req = await connect(url, form, "POST");
        
        await req.json();
    }
}