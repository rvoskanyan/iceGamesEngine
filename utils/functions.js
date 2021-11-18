const getExtendFile = (fileName) => {
  const parts = fileName.split('.');
  
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  
  return new Error('Неверное имя файла!');
}

const getDiscount = (priceTo, priceFrom) => {
  return Math.floor(100 - priceTo / (priceFrom / 100));
}

module.exports = {
  getExtendFile,
  getDiscount,
}