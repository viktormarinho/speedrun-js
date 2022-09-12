import { Request } from "./request.mjs"

export class HttpMethods {
    /**
     * 
     * @param {string} path 
     * @param {Function} handlerFunction 
     */
    get(path, handlerFunction) {
        this.endpoints.push(
            {
                url: path,
                request: new Request(handlerFunction, 'GET')
            }
        )
    }

    /**
     * 
     * @param {string} path 
     * @param {Function} handlerFunction 
     */
    post(path, handlerFunction) {
        this.endpoints.push(
            {
                url: path,
                request: new Request(handlerFunction, 'POST')
            }
        )
    }

    /**
     * 
     * @param {string} path 
     * @param {Function} handlerFunction 
     */
    put(path, handlerFunction) {
        this.endpoints.push(
            {
                url: path,
                request: new Request(handlerFunction, 'PUT')
            }
        )
    }

    /**
     * 
     * @param {string} path 
     * @param {Function} handlerFunction 
     */
    delete(path, handlerFunction) {
        this.endpoints.push(
            {
                url: path,
                request: new Request(handlerFunction, 'DELETE')
            }
        )
    }
}