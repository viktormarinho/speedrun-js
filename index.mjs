import http from 'http';
import { HttpMethods } from "./class/httpMethods.mjs"
import { Middleware } from "./class/middleware.mjs"
import { responseWithError } from "./common/responseWithError.mjs"

class SemnetServer extends HttpMethods {
    options = {
        port: 3000,
        hostname: "127.0.0.1",
        onStart: () => {
            console.log(`Server running at http://${this.options.hostname}:${this.options.port}`)
        }
    }

    /**
     * 
     * @param {*} options 
     */
    constructor(options) {
        super();
        this.server = http.createServer((req, res) => this.handleRequest(req, res))
        this.options = { ...this.options, ...options }
        this.endpoints = []
        this.middlewares = []
    }

    start() {
        this.server.listen(this.options.port, this.options.hostname, this.options.onStart)
    }

    /**
     * 
     * @param {string} path 
     * @returns
     */
    findEndpoint(path) {
        let found = false
        this.endpoints.forEach((endp) => {
            if (endp.url == path) {
                found = true
            }
        })
        return found
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     * @returns 
     */
    handleRequest(req, res) {
        res.setHeader('Content-Type', 'application/json')
        const url = new URL(req.url, `http://${this.options.hostname}:${this.options.port}`)

        if (!this.findEndpoint(url.pathname)) {
            return responseWithError(res, `Route ${req.url} not found`, 404)
        }

        this.endpoints.forEach(endpoint => {
            if (endpoint.url == url.pathname) {
                endpoint.request.handleRequest(req, res)
            }
        })

    }

    /**
     * Creates a middleware that will be applied over all requests in this server.
     * @param {Function} validateFunc 
     * Callback function that receives a Request object (type http.IncomingMessage) and returns
     * true if everything with the request is okay to pass forward. Returns false otherwise.
     * 
     * This function will be called inside the speedrunjs.Request class, so you have access to its
     * methods using the **this** keyword too. Some useful ones may be:
     * 
     * **this.extractParams(req: http.IncomingMessage)** - Returns an object with the all the url parameters in the request.
     * 
     * **async** **this.extractBody(req: http.IncomingMessage)** - Returns the request body in a JSON Object. Can fail to parse
     * the body data, so its recommended that you insert a **.catch()** clause. Usage example: 
     * 
            let any_err;

            await this.extractBody(req)
                .then(body => {
                    res.end(JSON.stringify(this.handlerFunction(params, body)))
                })
                .catch(err => {
                    any_err = err.message;
                })
            
            if (any_err) {
                return responseWithError(res, any_err, 400);
            }
     * @param {*} middlewareConfig
     * Optional middleware configuration. Strongly suggest that you add it. When your validate
     * returns false, contains the information about the response that will be sent back from the server.
     * 
     * Default:
     * 
     * const middlewareConfig = {
     *      rejectCode: 400,
     *      rejectMsg: 'Rejected by middleware.'
     * } 
     */
    createMiddleware(validateFunc, middlewareConfig) {
        const defaultConfig = {
            rejectCode: 400,
            rejectMsg: `Rejected by middleware.`
        }

        const config = {...defaultConfig, ...middlewareConfig}

        this.middlewares.push(new Middleware(validateFunc, config))
    }

    /**
     * 
     * @param {SemnetServer} server 
     */
    bind(server) {
        server.endpoints.forEach((endp) => {
            this.createEndpoint({...endp})
        })
    }

}


export const provideServer = (options) => {
    return new SemnetServer(options)
}