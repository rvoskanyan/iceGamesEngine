const getExtendFile = (fileName) => {
  const parts = fileName.split('.');
  
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  
  return new Error('Неверное имя файла!');
}

module.exports = {
  getExtendFile,
}