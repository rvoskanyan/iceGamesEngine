import {strMonths} from "./constants.js";
import {websiteAddress} from "../config.js";

export const getExtendFile = (fileName) => {
    const parts = fileName.split('.');

    if (parts.length > 1) {
        return parts[parts.length - 1];
    }

    return new Error('Неверное имя файла!');
}

export const getDiscount = (priceTo, priceFrom) => {
    return Math.floor(100 - priceTo / (priceFrom / 100));
}

export const getFormatDate = (date, separator, pattern, monthString, timeSeparator) => {
    const dateObject = new Date(Date.parse(date));
    let newDate = '';
    let timeInit = false;
    let dayInit = false;

    pattern.forEach(item => {
        let value;
        let time = false;

        switch (item) {
            case 'y': {
                value = dateObject.getFullYear();
                break;
            }
            case 'm': {
                value = dateObject.getMonth();

                if (monthString) {
                    value = strMonths[value];
                    break;
                }

                value = value < 9 ? '0' + (value + 1) : value + 1;
                break;
            }
            case 'd': {
                value = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : dateObject.getDate();
                break;
            }
            case 'hour': {
                value = dateObject.getHours() < 10 ? '0' + dateObject.getHours() : dateObject.getHours();
                time = true;
                break;
            }
            case 'min': {
                value = dateObject.getMinutes() < 10 ? '0' + dateObject.getMinutes() : dateObject.getMinutes();
                time = true;
                break;
            }
            case 'sec': {
                value = dateObject.getSeconds() < 10 ? '0' + dateObject.getSeconds() : dateObject.getSeconds();
                time = true;
                break;
            }
        }

        if (time) {
            value && newDate.length
                ? timeInit
                    ? newDate += `${timeSeparator + value}`
                    : newDate += ` ${value}`
                : newDate += `${value}`;

            return timeInit = true;
        }

        value && newDate.length
            ? dayInit && !monthString
                ? newDate += `${separator + value}`
                : newDate += ` ${value}`
            : newDate += `${value}`;

        dayInit = true;
    })

    return newDate;
}

export const getSitemapUrlTag = ({url, lastMod, changeFreq, priority}) => {
    return `
    <url>
        <loc>${url}</loc>
        ${lastMod ? `<lastmod>${lastMod}</lastmod>` : ''}
        <changefreq>${changeFreq}</changefreq>
        <priority>${priority}</priority>
    </url>
  `;
}

export const getSitemapImageTag = ({url, imgPath, deskImg, imgName}) => {
    return `
    <url>
        <loc>${url}</loc>
        <image:image>
            <image:loc>${imgPath}</image:loc>
            <image:caption>${deskImg}</image:caption>
            <image:title>${imgName}</image:title>
        </image:image>
    </url>
  `;
}

export const getSitemap = (params, images = false) => {
    let siteMap = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/main-style.xml"?>
  <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    params.forEach(param => {
        siteMap += images ? getSitemapImageTag(param) : getSitemapUrlTag(param);
    })

    return siteMap += '</urlset>';
}

export function getYmlFeed(offers, genres) {
    const date = new Date().toISOString();
    let categories = '';

    genres.forEach((genre, index) => {
        categories += `
     <category id="${index + 1}">${htmlEntities(genre.name)}</category>`;
    });

    let ymlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${date}">
  <shop>
    <name>ICE GAMES</name>
    <company>ICE GAMES</company>
    <url>${websiteAddress}</url>
    <categories>${categories}
    </categories>
    <offers>`;

    offers.forEach(offer => {
        offer.categoryId = genres.findIndex(genre => genre.name === offer.genres[0].name) + 1;

        ymlFeed += getYmlOffer(offer);
    });

    ymlFeed += `
    </offers>
  </shop>
</yml_catalog>`

    return ymlFeed;
}

export function getYmlOffer(data) {
    return `
        <offer id="${data.alias}">
            <name>${htmlEntities(data.name)}</name>
            <url>${websiteAddress}games/${htmlEntities(data.alias)}</url>
            <price>${data.priceTo}</price>${data.discount > 5 && data.discount < 75 ? `
            <oldprice>${data.priceFrom}</oldprice>` : ''}
            <enable_auto_discounts>true</enable_auto_discounts>
            <currencyId>RUR</currencyId>
            <categoryId>${data.categoryId}</categoryId>
            <picture>${websiteAddress}${htmlEntities(data.img)}</picture>
            <param name="Сервис активации">${htmlEntities(data.activationServiceId.name)}</param>
            <param name="Платформа">PC</param>
            <downloadable>true</downloadable>
        </offer>`;
}

export function getTurboArticlesRssFeedText(articles) {
    let turboArticlesRssFeedText = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:yandex="http://news.yandex.ru"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:turbo="http://turbo.yandex.ru"
     version="2.0">
  <channel>
    <title>Блог ICE GAMES</title>
    <link>https://icegames.store/</link>
    <description>Обзоры игр, познавательные статьи и актуальные новости — всё самое интересное в магазине лицензионных ключей ICE GAMES.</description>
    <language>ru</language>
    ${articles.map(article => {
        const date = new Date(article.createdAt).toUTCString();
        const link = htmlEntities(`${websiteAddress}blog/${article.alias}`);
        const headerImg = htmlEntities(`${websiteAddress}${article.img}`);
        const name = htmlEntities(article.name);
        
        return  `<item turbo="true">
        <link>${link}</link>
        <pubDate>${date}</pubDate>
        <turbo:content>
            <![CDATA[
                <header>
                    <h1>${name}</h1>
                    <figure>
                      <img src="${headerImg}">
                    </figure>
                    <div data-block="breadcrumblist">
                        <a href="https://icegames.store">Главная</a>
                        <a href="https://icegames.store/blog">Блог</a>
                        <a href="${link}">${name}</a>
                    </div>
                </header>${article.blocks.map(block => {
                    const srcImg = `${websiteAddress}${block.img}`;
                    
                    return `${!block.img ? '' : `
                <img class="img" src="${srcImg}"`}
                <div>${block.text}</div>`;
                }).join('')}
                ${article.products && article.products.length ? `<h3>Игры из статьи</h3>
                    <ul>
                        ${article.products.map(product => {
                        const link = `${websiteAddress}games/${product.alias}`;
                
                        return `<li>
                                            <a href="${link}">${product.name}</a>
                                        </li>`;
                    }).join('')}
                </ul>` : ''}
            ]]>
        </turbo:content>
    </item>
`
    }).join('')}
  </channel>
</rss>`;
    
    return turboArticlesRssFeedText;
}

export function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
}

/*
  getArray - Используется для преобразования в массив данных,
  приходящих из полей multiple, если выбран был только один элемент
*/
export const getArray = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

export const getChangeLayout = (str) => {
    const replace = {
        'q': 'й',
        'w': 'ц',
        'e': 'у',
        'r': 'к',
        't': 'е',
        'y': 'н',
        'u': 'г',
        'i': 'ш',
        'o': 'щ',
        'p': 'з',
        'a': 'ф',
        's': 'ы',
        'd': 'в',
        'f': 'а',
        'g': 'п',
        'h': 'р',
        'j': 'о',
        'k': 'л',
        'l': 'д',
        'z': 'я',
        'x': 'ч',
        'c': 'с',
        'v': 'м',
        'b': 'и',
        'n': 'т',
        'm': 'ь',
    };

    const cyrillic = Object.values(replace);
    const latin = Object.keys(replace);

    let resultStr = '';

    str.split('').forEach(item => {
        const char = item.toLowerCase();
        const cyrillicIndex = cyrillic.indexOf(char);
        const latinIndex = latin.indexOf(char);

        cyrillicIndex > -1 ? resultStr += latin[cyrillicIndex] : latinIndex > -1 ? resultStr += cyrillic[latinIndex] : resultStr += char;
    })

    return resultStr;
}

export const getAlias = (str, replaceSpace = true) => {
    const replace = {
        'a': 'а',
        'b': 'б',
        'v': 'в',
        'g': 'г',
        'd': 'д',
        'ye': 'е',
        'yo': 'ё',
        'zh': 'ж',
        'z': 'з',
        'i': 'и',
        'io': 'й',
        'k': 'к',
        'l': 'л',
        'm': 'м',
        'n': 'н',
        'o': 'о',
        'p': 'п',
        'r': 'р',
        's': 'с',
        't': 'т',
        'u': 'у',
        'f': 'ф',
        'kh': 'х',
        'ts': 'ц',
        'ch': 'ч',
        'sh': 'ш',
        'sch': 'щ',
        'y': 'ы',
        'e': 'э',
        'yu': 'ю',
        'ya': 'я',
    };

    const cyrillic = Object.values(replace);
    const latinTranscript = Object.keys(replace);

    let resultStr = '';

    str.split('').forEach(item => {
        const char = item.toLowerCase();

        if (/\s/.test(char)) {
            return resultStr += replaceSpace ? '-' : ' ';
        }

        if (/[a-z0-9]/.test(char)) {
            return resultStr += char;
        }

        if (/[а-я]/.test(char) && char !== 'ъ' && char !== 'ь') {
            resultStr += latinTranscript[cyrillic.indexOf(char)];
        }
    })

    return replaceSpace ? resultStr.replace(/-{2,}/g, '-') : resultStr;
}

export function getRomanNum(num) {
    if (!+num) {
        return false;
    }

    const key = [
        '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
    ];
    let digits = String(+num).split('');
    let roman = ''
    let i = 3;

    while (i--) {
        roman = (key[+digits.pop() + (i * 10)] || '') + roman;
    }

    return Array(+digits.join('') + 1).join('M') + roman;
}

export const mergeParams = (relatedItems, restItems) => {
    let newRelatedItems = [];

    if (Array.isArray(relatedItems)) {
        newRelatedItems = relatedItems;
    } else if (relatedItems) {
        newRelatedItems = [relatedItems];
    }

    return [
        ...newRelatedItems.map(item => {
            return {
                id: item._id,
                name: item.name,
                selected: true,
            }
        }),
        ...restItems.map(item => {
            return {
                id: item._id,
                name: item.name,
            }
        }),
    ];
}

export const toRoman = (str, matches) => {
    if (!matches || !matches.length) {
        return str;
    }

    for (let i = 0; i < matches.length; i++) {
        const romanNum = getRomanNum(matches[i]);

        str = str.replace(matches[i], romanNum);
    }

    return str;
}

export const accented = {
    'A': /[Aa\xaa\xc0-\xc5\xe0-\xe5\u0100-\u0105\u01cd\u01ce\u0200-\u0203\u0226\u0227\u1d2c\u1d43\u1e00\u1e01\u1e9a\u1ea0-\u1ea3\u2090\u2100\u2101\u213b\u249c\u24b6\u24d0\u3371-\u3374\u3380-\u3384\u3388\u3389\u33a9-\u33af\u33c2\u33ca\u33df\u33ff\uff21\uff41]/ig,
    'B': /[Bb\u1d2e\u1d47\u1e02-\u1e07\u212c\u249d\u24b7\u24d1\u3374\u3385-\u3387\u33c3\u33c8\u33d4\u33dd\uff22\uff42]/ig,
    'C': /[Cc\xc7\xe7\u0106-\u010d\u1d9c\u2100\u2102\u2103\u2105\u2106\u212d\u216d\u217d\u249e\u24b8\u24d2\u3376\u3388\u3389\u339d\u33a0\u33a4\u33c4-\u33c7\uff23\uff43]/ig,
    'D': /[Dd\u010e\u010f\u01c4-\u01c6\u01f1-\u01f3\u1d30\u1d48\u1e0a-\u1e13\u2145\u2146\u216e\u217e\u249f\u24b9\u24d3\u32cf\u3372\u3377-\u3379\u3397\u33ad-\u33af\u33c5\u33c8\uff24\uff44]/ig,
    'E': /[Ee\xc8-\xcb\xe8-\xeb\u0112-\u011b\u0204-\u0207\u0228\u0229\u1d31\u1d49\u1e18-\u1e1b\u1eb8-\u1ebd\u2091\u2121\u212f\u2130\u2147\u24a0\u24ba\u24d4\u3250\u32cd\u32ce\uff25\uff45]/ig,
    'F': /[Ff\u1da0\u1e1e\u1e1f\u2109\u2131\u213b\u24a1\u24bb\u24d5\u338a-\u338c\u3399\ufb00-\ufb04\uff26\uff46]/ig,
    'G': /[Gg\u011c-\u0123\u01e6\u01e7\u01f4\u01f5\u1d33\u1d4d\u1e20\u1e21\u210a\u24a2\u24bc\u24d6\u32cc\u32cd\u3387\u338d-\u338f\u3393\u33ac\u33c6\u33c9\u33d2\u33ff\uff27\uff47]/ig,
    'H': /[Hh\u0124\u0125\u021e\u021f\u02b0\u1d34\u1e22-\u1e2b\u1e96\u210b-\u210e\u24a3\u24bd\u24d7\u32cc\u3371\u3390-\u3394\u33ca\u33cb\u33d7\uff28\uff48]/ig,
    'I': /[Ii\xcc-\xcf\xec-\xef\u0128-\u0130\u0132\u0133\u01cf\u01d0\u0208-\u020b\u1d35\u1d62\u1e2c\u1e2d\u1ec8-\u1ecb\u2071\u2110\u2111\u2139\u2148\u2160-\u2163\u2165-\u2168\u216a\u216b\u2170-\u2173\u2175-\u2178\u217a\u217b\u24a4\u24be\u24d8\u337a\u33cc\u33d5\ufb01\ufb03\uff29\uff49]/ig,
    'J': /[Jj\u0132-\u0135\u01c7-\u01cc\u01f0\u02b2\u1d36\u2149\u24a5\u24bf\u24d9\u2c7c\uff2a\uff4a]/ig,
    'K': /[Kk\u0136\u0137\u01e8\u01e9\u1d37\u1d4f\u1e30-\u1e35\u212a\u24a6\u24c0\u24da\u3384\u3385\u3389\u338f\u3391\u3398\u339e\u33a2\u33a6\u33aa\u33b8\u33be\u33c0\u33c6\u33cd-\u33cf\uff2b\uff4b]/ig,
    'L': /[Ll\u0139-\u0140\u01c7-\u01c9\u02e1\u1d38\u1e36\u1e37\u1e3a-\u1e3d\u2112\u2113\u2121\u216c\u217c\u24a7\u24c1\u24db\u32cf\u3388\u3389\u33d0-\u33d3\u33d5\u33d6\u33ff\ufb02\ufb04\uff2c\uff4c]/ig,
    'M': /[Mm\u1d39\u1d50\u1e3e-\u1e43\u2120\u2122\u2133\u216f\u217f\u24a8\u24c2\u24dc\u3377-\u3379\u3383\u3386\u338e\u3392\u3396\u3399-\u33a8\u33ab\u33b3\u33b7\u33b9\u33bd\u33bf\u33c1\u33c2\u33ce\u33d0\u33d4-\u33d6\u33d8\u33d9\u33de\u33df\uff2d\uff4d]/ig,
    'N': /[Nn\xd1\xf1\u0143-\u0149\u01ca-\u01cc\u01f8\u01f9\u1d3a\u1e44-\u1e4b\u207f\u2115\u2116\u24a9\u24c3\u24dd\u3381\u338b\u339a\u33b1\u33b5\u33bb\u33cc\u33d1\uff2e\uff4e]/ig,
    'O': /[Oo\xba\xd2-\xd6\xf2-\xf6\u014c-\u0151\u01a0\u01a1\u01d1\u01d2\u01ea\u01eb\u020c-\u020f\u022e\u022f\u1d3c\u1d52\u1ecc-\u1ecf\u2092\u2105\u2116\u2134\u24aa\u24c4\u24de\u3375\u33c7\u33d2\u33d6\uff2f\uff4f]/ig,
    'P': /[Pp\u1d3e\u1d56\u1e54-\u1e57\u2119\u24ab\u24c5\u24df\u3250\u3371\u3376\u3380\u338a\u33a9-\u33ac\u33b0\u33b4\u33ba\u33cb\u33d7-\u33da\uff30\uff50]/ig,
    'Q': /[Qq\u211a\u24ac\u24c6\u24e0\u33c3\uff31\uff51]/ig,
    'R': /[Rr\u0154-\u0159\u0210-\u0213\u02b3\u1d3f\u1d63\u1e58-\u1e5b\u1e5e\u1e5f\u20a8\u211b-\u211d\u24ad\u24c7\u24e1\u32cd\u3374\u33ad-\u33af\u33da\u33db\uff32\uff52]/ig,
    'S': /[Ss\u015a-\u0161\u017f\u0218\u0219\u02e2\u1e60-\u1e63\u20a8\u2101\u2120\u24ae\u24c8\u24e2\u33a7\u33a8\u33ae-\u33b3\u33db\u33dc\ufb06\uff33\uff53]/ig,
    'T': /[Tt\u0162-\u0165\u021a\u021b\u1d40\u1d57\u1e6a-\u1e71\u1e97\u2121\u2122\u24af\u24c9\u24e3\u3250\u32cf\u3394\u33cf\ufb05\ufb06\uff34\uff54]/ig,
    'U': /[Uu\xd9-\xdc\xf9-\xfc\u0168-\u0173\u01af\u01b0\u01d3\u01d4\u0214-\u0217\u1d41\u1d58\u1d64\u1e72-\u1e77\u1ee4-\u1ee7\u2106\u24b0\u24ca\u24e4\u3373\u337a\uff35\uff55]/ig,
    'V': /[Vv\u1d5b\u1d65\u1e7c-\u1e7f\u2163-\u2167\u2173-\u2177\u24b1\u24cb\u24e5\u2c7d\u32ce\u3375\u33b4-\u33b9\u33dc\u33de\uff36\uff56]/ig,
    'W': /[Ww\u0174\u0175\u02b7\u1d42\u1e80-\u1e89\u1e98\u24b2\u24cc\u24e6\u33ba-\u33bf\u33dd\uff37\uff57]/ig,
    'X': /[Xx\u02e3\u1e8a-\u1e8d\u2093\u213b\u2168-\u216b\u2178-\u217b\u24b3\u24cd\u24e7\u33d3\uff38\uff58]/ig,
    'Y': /[Yy\xdd\xfd\xff\u0176-\u0178\u0232\u0233\u02b8\u1e8e\u1e8f\u1e99\u1ef2-\u1ef9\u24b4\u24ce\u24e8\u33c9\uff39\uff59]/ig,
    'Z': /[Zz\u0179-\u017e\u01f1-\u01f3\u1dbb\u1e90-\u1e95\u2124\u2128\u24b5\u24cf\u24e9\u3390-\u3394\uff3a\uff5a]/ig,
};

export const transliteration = (str, matches) => {
    for (let i = 0; i < matches.length; i++) {
        const index = ru.indexOf(matches[i]);

        str = str.replace(matches[i], en[index]);
    }

    return str;
}

export const ru = ['А', 'а', 'Б', 'б', 'В', 'в', 'Г', 'г', 'Д', 'д', 'Е', 'е', 'Ё', 'ё', 'Ж', 'ж', 'З', 'з',
    'И', 'и', 'Й', 'й', 'К', 'к', 'Л', 'л', 'М', 'м', 'Н', 'н', 'О', 'о', 'П', 'п', 'Р', 'р',
    'С', 'с', 'Т', 'т', 'У', 'у', 'Ф', 'ф', 'Х', 'х', 'Ц', 'ц', 'Ч', 'ч', 'Ш', 'ш', 'Щ', 'щ',
    'Ъ', 'ъ', 'Ы', 'ы', 'Ь', 'ь', 'Э', 'э', 'Ю', 'ю', 'Я', 'я'];
export const en = ['A', 'a', 'B', 'b', 'V', 'v', 'G', 'g', 'D', 'd', 'E', 'e', 'E', 'e', 'ZH', 'zh', 'Z', 'z',
    'I', 'i', 'I', 'i', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 'P', 'p', 'R', 'r',
    'S', 's', 'T', 't', 'U', 'u', 'F', 'f', 'H', 'h', 'C', 'c', 'CH', 'ch', 'SH', 'sh', 'SCH', 'sch',
    '\'', '\'', 'Y', 'y', '\'', '\'', 'E', 'e', 'YU', 'Yu', 'YA', 'ya'];

export const getSoundIndex = (inputStr) => {
    const codes = {
        A: {0: [0, -1, -1], I: [[0, 1, -1]], J: [[0, 1, -1]], Y: [[0, 1, -1]], U: [[0, 7, -1]]},
        B: [[7, 7, 7]],
        C: {
            0: [5, 5, 5],
            1: [4, 4, 4],
            Z: {0: [4, 4, 4], S: [[4, 4, 4]]},
            S: {0: [4, 4, 4], Z: [[4, 4, 4]]},
            K: [[5, 5, 5], [45, 45, 45]],
            H: {0: [5, 5, 5], 1: [4, 4, 4], S: [[5, 54, 54]]}
        },
        D: {
            0: [3, 3, 3],
            T: [[3, 3, 3]],
            Z: {0: [4, 4, 4], H: [[4, 4, 4]], S: [[4, 4, 4]]},
            S: {0: [4, 4, 4], H: [[4, 4, 4]], Z: [[4, 4, 4]]},
            R: {S: [[4, 4, 4]], Z: [[4, 4, 4]]}
        },
        E: {0: [0, -1, -1], I: [[0, 1, -1]], J: [[0, 1, -1]], Y: [[0, 1, -1]], U: [[1, 1, -1]], W: [[1, 1, -1]]},
        F: {0: [7, 7, 7], B: [[7, 7, 7]]},
        G: [[5, 5, 5]],
        H: [[5, 5, -1]],
        I: {0: [0, -1, -1], A: [[1, -1, -1]], E: [[1, -1, -1]], O: [[1, -1, -1]], U: [[1, -1, -1]]},
        J: [[4, 4, 4]],
        K: {0: [5, 5, 5], H: [[5, 5, 5]], S: [[5, 54, 54]]},
        L: [[8, 8, 8]],
        M: {0: [6, 6, 6], N: [[66, 66, 66]]},
        N: {0: [6, 6, 6], M: [[66, 66, 66]]},
        O: {0: [0, -1, -1], I: [[0, 1, -1]], J: [[0, 1, -1]], Y: [[0, 1, -1]]},
        P: {0: [7, 7, 7], F: [[7, 7, 7]], H: [[7, 7, 7]]},
        Q: [[5, 5, 5]],
        R: {0: [9, 9, 9], Z: [[94, 94, 94], [94, 94, 94]], S: [[94, 94, 94], [94, 94, 94]]},
        S: {
            0: [4, 4, 4],
            Z: {0: [4, 4, 4], T: [[2, 43, 43]], C: {Z: [[2, 4, 4]], S: [[2, 4, 4]]}, D: [[2, 43, 43]]},
            D: [[2, 43, 43]],
            T: {
                0: [2, 43, 43],
                R: {Z: [[2, 4, 4]], S: [[2, 4, 4]]},
                C: {H: [[2, 4, 4]]},
                S: {H: [[2, 4, 4]], C: {H: [[2, 4, 4]]}}
            },
            C: {
                0: [2, 4, 4],
                H: {
                    0: [4, 4, 4],
                    T: {0: [2, 43, 43], S: {C: {H: [[2, 4, 4]]}, H: [[2, 4, 4]]}, C: {H: [[2, 4, 4]]}},
                    D: [[2, 43, 43]]
                }
            },
            H: {
                0: [4, 4, 4],
                T: {0: [2, 43, 43], C: {H: [[2, 4, 4]]}, S: {H: [[2, 4, 4]]}},
                C: {H: [[2, 4, 4]]},
                D: [[2, 43, 43]]
            }
        },
        T: {
            0: [3, 3, 3],
            C: {0: [4, 4, 4], H: [[4, 4, 4]]},
            Z: {0: [4, 4, 4], S: [[4, 4, 4]]},
            S: {0: [4, 4, 4], Z: [[4, 4, 4]], H: [[4, 4, 4]], C: {H: [[4, 4, 4]]}},
            T: {S: {0: [4, 4, 4], Z: [[4, 4, 4]], C: {H: [[4, 4, 4]]}}, C: {H: [[4, 4, 4]]}, Z: [[4, 4, 4]]},
            H: [[3, 3, 3]],
            R: {Z: [[4, 4, 4]], S: [[4, 4, 4]]}
        },
        U: {0: [0, -1, -1], E: [[0, -1, -1]], I: [[0, 1, -1]], J: [[0, 1, -1]], Y: [[0, 1, -1]]},
        V: [[7, 7, 7]],
        W: [[7, 7, 7]],
        X: [[5, 54, 54]],
        Y: [[1, -1, -1]],
        Z: {
            0: [4, 4, 4],
            D: {0: [2, 43, 43], Z: {0: [2, 4, 4], H: [[2, 4, 4]]}},
            H: {0: [4, 4, 4], D: {0: [2, 43, 43], Z: {H: [[2, 4, 4]]}}},
            S: {0: [4, 4, 4], H: [[4, 4, 4]], C: {H: [[4, 4, 4]]}}
        }
    };
    const wordCalc = (str, iscyrInput) => {
        let output = '';
        let i = 0;
        let iscyr = iscyrInput || true;
        let previous = -1;
        let power = 6;
        let last;

        while (i < str.length) {
            let current = last = codes[str[i]];
            let code;
            let k;

            for (let j = k = 1; k < power + 1; k++) {
                if (!str[i + k] || !current[str[i + k]]) {
                    break;
                }

                current = current[str[i + k]];

                if (current[0]) {
                    last = current;
                    j = k + 1;
                }
            }

            if (!i) {
                code = last[0][0];
            } else if (!str[i + k] || codes[str[i + k]][0][0]) {
                code = iscyr ? (last.length > 1 ? last[1][2] : last[0][2]) : last[0][2];
            } else {
                code = iscyr ? (last.length > 1 ? last[1][1] : last[0][1]) : last[0][1];
            }

            if ((code !== -1) && (code !== previous)) {
                output += code;
            }

            previous = code;

            i += k;
        }

        output = output.substr(0, power).replace(/^03(8|$)/, '53$1'); // отель, готель, хотел

        if (output && output.length < 3) {
            output += (new Array(3 - output.length + 1)).join('0');
        }

        return output;
    };

    let str = inputStr.toUpperCase().trim();
    const trans = str.match(/[А-Я]/ig);
    const nums = str.match(/\d/g);
    let iscyr = false;

    if (nums) {
        str = toRoman(str, nums);
    }

    str = str.replace(/\s\+\s/g, ' AND ');

    for (const letter in accented) {
        str.replace(accented[letter], letter);
    }

    if (trans) {
        str = transliteration(str, trans);
        iscyr = true;
    }

    str = str.replace(/[^\s^A-Z]/g, '').replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');

    if (!str.length) {
        return null;
    }

    const matches = str.split(/\s/);

    for (let i = 0, l = matches.length; i < l; i++) {
        const word = matches[i];

        matches[i] = wordCalc(word, iscyr);
    }

    return matches;
}

export const normalizeStr = (inputStr) => {
    let str = inputStr.toUpperCase().trim();
    const trans = str.match(/[А-Я]/ig);
    const nums = str.match(/\d/g);

    if (nums) {
        str = toRoman(str, nums);
    }

    str = str.replace(/\s\+\s/g, ' AND ');

    for (const letter in accented) {
        str.replace(accented[letter], letter);
    }

    if (trans) {
        str = transliteration(str, trans);
    }

    return str.replace(/[^\s^A-Z]/g, '').replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
}

export function isEqualBySound(firsStr, secondStr) {
    const firsSound = getSoundIndex(firsStr);
    const secondSound = getSoundIndex(secondStr);
    let coincidences = 0;

    if (firsSound.length !== secondSound.length) {
        return false;
    }

    firsSound.forEach(item => {
        if (secondSound.indexOf(item) !== -1) {
            coincidences++;
        }
    })

    return coincidences === firsSound.length;
}

export function getGrams(str) {
    str = str.trim().toLowerCase();

    if (!str.length) {
        return undefined;
    }

    if (str.length === 1) {
        return [str];
    }

    if (str.length === 2) {
        return [str[0], str, str[1]]
    }

    const grams = [];

    for (let i = 1; i <= str.length; i++) {
        if (i === str.length) {
            grams.push(str.slice(i - 3), str.slice(i - 2), str.slice(i - 1));

            continue;
        }

        if (i < 3) {
            grams.push(str.slice(0, i));

            continue;
        }

        grams.push(str.slice(i - 3, i));
    }

    return grams;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generation_number(length = 4) {
    if (length < 2) length = 2
    return getRandomInt(parseInt('1'.repeat(length))-parseInt('1'.repeat(length-1)), parseInt("9".repeat(length)))
}
export function generation_string(length=8) {
    let white_word = '1234567890@#$qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    let w = ''
    for (let i = 0; i < length; i++) {
        let index = getRandomInt(0, white_word.length-1)
        w += white_word[index]
    }
    return w
}