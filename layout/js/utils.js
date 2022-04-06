export const urlEncodeFormData = (fd) => {
  let s = '';
  
  function encode(s) {
    return encodeURIComponent(s).replace(/%20/g,'+');
  }
  
  for (let pair of fd.entries()) {
    if (typeof pair[1]=='string') {
      s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
    }
  }
  
  return s;
}