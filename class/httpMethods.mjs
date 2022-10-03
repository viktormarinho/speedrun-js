import { Request } from "./request.mjs"

export class HttpMethods {

    /**
     * 
     * @param {string} path 
     * @param {Request} request 
     */
    createEndpoint(path, request) {
        for (const endp of this.endpoints) {
            if (endp.url === path && endp.request.method === request.method) {
                throw new Error('Trying to create two endpoints with same path and method')
            }
        }
        this.endpoints.push({ url: path, request: request })
    }

    /**
     * 
     * @param {string} path 
     * @param {Function} handlerFunction 
     */
    get(path, handlerFunction) {
        this.createEndpoint(path, new Request(handlerFunction, 'GET', this.middlewares))
    }

    /**
     * 
     * @param {string} path 
     * @param {Function} handlerFunction 
     */
    post(path, handlerFunction) {
        this.createEndpoint(path, new Request(handlerFunction, 'POST', this.middlewares))
    }

    /**
     * 
     * @param {string} path 
     * @param {Function} handlerFunction 
     */
    put(path, handlerFunction) {
        this.createEndpoint(path, new Request(handlerFunction, 'PUT', this.middlewares))
    }

    /**
     * 
     * @param {string} path 
     * @param {Function} handlerFunction 
     */
    delete(path, handlerFunction) {
        this.createEndpoint(path, new Request(handlerFunction, 'DELETE', this.middlewares))
    }
}