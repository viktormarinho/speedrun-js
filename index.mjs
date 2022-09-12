import http from 'http';
import { HttpMethods } from "./class/httpMethods.mjs"
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
     * 
     * @param {SemnetServer} server 
     */
    bind(server) {
        this.endpoints = [...this.endpoints, ...server.endpoints]
    }

}


export const provideServer = (options) => {
    return new SemnetServer(options)
}