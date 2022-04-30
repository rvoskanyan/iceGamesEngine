import {strMonths} from "./constants.js";

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

export const getFormatDate = (date, separator, pattern, monthString) => {
  const dateObject = new Date(Date.parse(date));
  let newDate = '';
  
  pattern.forEach(item => {
    let value;
    
    switch (item) {
      case 'y': {
        value = dateObject.getFullYear();
        break;
      }
      case 'm': {
        value = date.getMonth();
        
        if (monthString) {
          value = strMonths[value];
          break;
        }
        
        value = value < 9 ? '0' + (value + 1) : value + 1;
        break;
      }
      case 'd': {
        value = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        break;
      }
    }
    
    value && newDate.length ? newDate += `${separator + value}` : newDate += `${value}`;
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

export const getSitemap = (params) => {
  let siteMap = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/main-style.xml"?>
  <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  params.forEach(param => {
    siteMap += getSitemapUrlTag(param);
  })
  
  return siteMap += '</urlset>';
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

export const getAlias = (str) => {
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
      return resultStr += '-';
    }
    
    if (/[a-z0-9]/.test(char)) {
      return resultStr += char;
    }
    
    if (/[а-я]/.test(char) && char !== 'ъ' && char !== 'ь') {
      resultStr += latinTranscript[cyrillic.indexOf(char)];
    }
  })
  
  return resultStr;
}

export const mergeParams = (relatedItems, restItems) => {
  return [
    ...relatedItems.map(item => {
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