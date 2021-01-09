class RequestApi {
    constructor(options = {}) {
        this.currentURL = undefined;


        this._baseUrl = null;
        this.cors = options.cors || 'cors';
        this.credentials = options.credentials || 'include';
        this.headers = options.headers || {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        this.redirect = options.redirect || 'follow';

        this.urlWithBase = this.urlWithBase.bind(this);
        this._onRequestFail = function () {
            console.log("request failed")
        }
    }

    set showLoader(showLoaderFunction) {
        this._showLoader = showLoaderFunction;
    }

    set removeLoader(removeLoaderFunction) {
        this._removeLoader = removeLoaderFunction;
    }
    set onRequestFail(onRequestFailFunction) {
        this._onRequestFail = onRequestFailFunction;
    }

    set onlineCheck(onlineCheckFunction) {
        this._onlineCheck = onlineCheckFunction;
    }

    set baseURL(url) {
        // if (!RequestApi.isUrlValid(url)) throw new TypeError("Invalid Url");

        //remove trailing slash 
        if (url[url.length] === "/") {
            url = url.slice(0, url.length - 1);
        }
        this._baseURL = url;
    }

    get baseURL() {
        return this._baseURL;
    }

    static isUrlValid(url) {
        const pattern = new RegExp(
            "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
            "i"
        ); // fragment locator
        return !!pattern.test(url);
    }

    static isAbsoluteUrl(url) {
        const pattern = new RegExp('^(?:[a-z]+:)?//', 'i');
        return pattern.test(url)
    }

    static prepareUrl(url, baseURL) {

        if (RequestApi.isAbsoluteUrl(url)) return url; //absolute url passed; ignored baseurl
        else {
            if (!baseURL) throw new Error("Invalid URL, make sure to pass baseURL if first argument contains relative URL");

            if (url[0] !== "/" && baseURL[baseURL.length - 1] !== '/') url = "/" + url; //add forward slash if not present

            return baseURL + url;
        }
    }

    urlWithBase(url) {
        return RequestApi.prepareUrl(url, this._baseURL);
    }

    handleFailReq(options = {}) {
        if (options.onRequestFail) options.onRequestFail();
        else this._onRequestFail();
        return false;
    }

    handleConnectivity(options) {
        if (this._onlineCheck && !this._onlineCheck()) {
            this.handleFailReq(options)
        }
    }

    async get(url, options={}) {
        try {
            this.handleConnectivity(options);

            this.currentURL = RequestApi.prepareUrl(url, this._baseURL);

            if (options.params) {
                let params = RequestApi.objectToParameter(options.params);
                this.currentURL = this.currentURL + params;
            }

            const reqOptions = {
                method: 'GET',
                mode: this.cors,
                credentials: this.credentials,
                headers: this.headers,
                redirect: this.redirect,
            }

            let data = await fetch(this.currentURL);

            if (!data.ok) return this.handleFailReq(options)

            if (options.contentType) return await data[options.contentType]();
            if (options.onSuccess) options.onSuccess();
            return await data.json();
        } catch (err) {
            console.log(err);
            this.handleFailReq(options);
        }
    }

    /**
     * send post request to server
     * @param {string} url 
     * @param {object} data 
     * @param {object} options 
     * @param {object} options.params  object will be converted to url parameter
     * @param {function} options.encoder data encoder before sending, default JSON.stringify()
     * @param {string} options.contentType fetch api method for converting data, default json
     * @param {function} options.onSuccess 
     * @param {function} options.onRequestFail
     */
    async post(url = '', data = {}, options = {}) {
        this.handleConnectivity(options);

        this.currentURL = RequestApi.prepareUrl(url, this._baseURL);


        if (options.params) {
            let params = RequestApi.objectToParameter(options.params);
            this.currentURL = this.currentURL + params;
        }

        try {
            const reqOptions = {
                method: 'POST',
                mode: this.cors,
                credentials: this.credentials,
                headers: this.headers,
                redirect: this.redirect,
                body: options.encoder ? options.encoder(data) : JSON.stringify(data)
            }

            const response = await fetch(this.currentURL, reqOptions);
            if (!response.ok) this.handleFailReq(options);

            if (options.contentType) return await response[options.contentType]();
            if (options.onSuccess) options.onSuccess();
            // let resolvedRes = await response.json();
            return await response.json();

            // return {
            //     resolvedRes,
            //     status: response.status,
            //     statusText: response.statusText
            // }
        } catch (err) {
            console.log(err);
            this.handleFailReq(options);
        }

    }


    static objectToParameter(params) {
        let paramStr = `?`;
        for (let param in params) {
            paramStr += `${param}=${params[param]}&`
        }

        return paramStr;
    }
}

module.exports = new RequestApi();
module.exports.RequestApi = RequestApi;