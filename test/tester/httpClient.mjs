import http from 'http'

export class HttpClient {
    constructor() {}

    /**
     * 
     * @param {string} url 
     */
    getOptionsFromUrl(url) {
        const requestUrl = new URL(url)

        return {
            host: requestUrl.host.split(':')[0],
            path: requestUrl.pathname,
            port: requestUrl.port
        }
    }

    makeRequest(options, body) {
        return new Promise((resolve, reject) => {
            /**
             * 
             * @param {http.IncomingMessage} response 
             */
            const callback = (response) => {
                let bodyStr = ''

                response.on('data', (chunk) => bodyStr += chunk)
                response.on('error', (err) => reject(err))
                response.on('end', () => resolve({headers: response.headers, body: JSON.parse(bodyStr), code: response.statusCode}))
            }

            const req = http.request(options, callback)

            if (body) {
                req.write(JSON.stringify(body))
            }

            req.end();
        })
    }

    /**
     * 
     * @param {string} url 
     * @param {any} options
     */
    async get(url, options) {
        const urlOptions = this.getOptionsFromUrl(url)
        
        const _options = {
            ...urlOptions,
            method: 'GET',
            ...options
        }

        return await this.makeRequest(_options)
    }

    /**
     * 
     * @param {string} url 
     * @param {any} body 
     * @param {any} options
     */
     async post(url, body, options) {
        const urlOptions = this.getOptionsFromUrl(url)
        
        const _options = {
            ...urlOptions,
            method: 'POST',
            ...options
        }

        return await this.makeRequest(_options, body)
    }

    /**
     * 
     * @param {string} url 
     * @param {any} body 
     * @param {any} options
     */
     async put(url, body, options) {
        const urlOptions = this.getOptionsFromUrl(url)
        
        const _options = {
            ...urlOptions,
            method: 'PUT',
            ...options
        }

        return await this.makeRequest(_options, body)
    }

    /**
     * 
     * @param {string} url 
     * @param {any} options
     */
     async delete(url, options) {
        const urlOptions = this.getOptionsFromUrl(url)
        
        const _options = {
            ...urlOptions,
            method: 'DELETE',
            ...options
        }

        return await this.makeRequest(_options)
    }
}