import config from '../config.json';
import apiMap from '../apiMap.json';
import Converter from './converter.js';

// import utils
import { manupulateURL } from './utils';

let converter = new Converter();

class Connector {
  //TODO
  constructor() {
    this.options = {};
  }

  /**
   * @method request sends request to server
   * this function determines api url and method from config.json
   * and sends request and converts recieved data to general format
   * @param {String} item
   * @param {String} format
   * @param {Object} data optional
   * @returns {Object}  converted data
   */

  async request(item, format = 'json', options = {}) {
    let api = apiMap[config.server][item]; //api url & method

    // configuring options for fetch request

    this.options = {
      ...this.options,
      method: api.method,
      credentials: 'include',
      headers: new Headers({
        ...(format === 'json' && {
          'Content-Type': 'application/json',
        }),
        ...(options.headers && {
          ...options.headers,
        }),
      }),

      ...(format === 'json'
        ? {
          body: api.method !== 'get' ? JSON.stringify(options.body) : null,
        }
        : {
          body: api.method !== 'get' ? options.body : null,
        }),
    };

    function getUrlOptions(urlOptions) {
      if (api.method === 'get') {
        let params = {};

        if (!urlOptions?.params?.limitNumber) {
          params.limitNumber = 100000000000;
        };

        console.log('urlparams', urlOptions);

        return {
          ...(urlOptions && {
            ...urlOptions,
          }),
          params: {
            ...(urlOptions &&
              urlOptions.params && {
              ...urlOptions.params,
            }),
            ...params,
          },
        };
      }
      return urlOptions;
    }

    function getUrl(url) {
      if (url && api.method === 'get') {
        return url.includes('?')
          ? url + '&limit=limitNumber'
          : url + '?limit=limitNumber';
      }
      return url;
    }

    //*replace variable parts in url with actual data if params exists |or| just return the url

    // console.log('myUrl', getUrl(api.url), getUrlOptions(options.urlOptions));

    const url = manupulateURL(
      getUrl(api.url),
      getUrlOptions(options.urlOptions)
    );

    console.log('myUrl', url);

    // change the formate to text if the server is wooCommerce
    if (config['server'] === 'wooCommerce') {
      // format = 'text';
    }

    try {
      let res = await fetch(config.baseURL + url, this.options);

      if (res.status >= 200 && res.status < 300) {
        let formattedData = await res['json'](); //await res.json(), res.text()
        if (formattedData.status === 'error') {
          throw formattedData.error;
        }

        let convertedData = await converter[item || ''](formattedData); //convert recieved data to app general format
        return convertedData;
      } else {
        let error = await res['json']();

        throw error;
      }
    } catch (err) {
      throw err;
      //TODO: breakdown errors
    }
  }
}

export default Connector;
