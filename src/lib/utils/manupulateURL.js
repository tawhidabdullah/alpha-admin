const isObjectEmpty = value => {
  return !value || !Object.keys(value).length > 0;
};

const manupulateURL = (url, urlOptions = {}) => {
  if (isObjectEmpty(urlOptions)) return url;

  const params = urlOptions.params || {};
  const placeHolders = urlOptions.placeHolders || {};



  return url
    .split('/')
    .map(currentValue => {
      if (currentValue.includes(':') && !isObjectEmpty(placeHolders) && !currentValue.includes('?')) {
        console.log('currentValue',currentValue);
        let actualPlaceholderValue = placeHolders[currentValue.replace(':', '')];
        console.log('actualPlaceholderValue',actualPlaceholderValue);
        currentValue = actualPlaceholderValue;
      }
      
      if (currentValue.includes(':') && !isObjectEmpty(placeHolders) && currentValue.includes('?')) {
        let fuckValue = currentValue.split('?'); 
        if(fuckValue && fuckValue.length > 0){
          fuckValue = fuckValue.map(item => {
            return placeHolders[item.replace(':', '')] ? placeHolders[item.replace(':', '')] : item
          })
        }
        console.log('fuckValue',fuckValue);
        let actualPlaceholderValue = fuckValue.join('?');
        console.log('actualPlaceholderValue',actualPlaceholderValue,'currentVAlue',currentValue);
        console.log('placeHolders',placeHolders);
        currentValue = actualPlaceholderValue;
      }

      if (currentValue.includes('?')) {
        currentValue = currentValue
          .split('&')
          .map(currentValue => {
            const param = currentValue.slice(currentValue.indexOf('=') + 1);
            return currentValue.replace(param, params[param] || '');
          })
          .join('&');
      }
      return currentValue;
    })
    .join('/');
};

export default manupulateURL;
