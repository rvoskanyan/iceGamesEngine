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

/*
  GetArray - Используется для преобразования в массив данных,
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