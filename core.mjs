import http from 'http';

class HttpMethods {
    get(path, handlerFunction) {
        this.endpoints.push(
            {
                url: path,
                request: new Request(handlerFunction, 'GET')
            }
        )
    }

    post(path, handlerFunction) {
        this.endpoints.push(
            {
                url: path,
                request: new Request(handlerFunction, 'POST')
            }
        )
    }

    put(path, handlerFunction) {
        this.endpoints.push(
            {
                url: path,
                request: new Request(handlerFunction, 'PUT')
            }
        )
    }

    delete(path, handlerFunction) {
        this.endpoints.push(
            {
                url: path,
                request: new Request(handlerFunction, 'DELETE')
            }
        )
    }
}

function responseWithError(res, msg) {
    res.end(JSON.stringify({ "errorMsg": msg }))
}

class Request {
    constructor(handlerFunction, method) {
        this.handlerFunction = handlerFunction
        this.method = method
    }

    checkMiddleware(req) {
        return req.method == this.method
    }

    earlyReject(req, res) {
        res.statusCode = 405
        responseWithError(res, `Wrong method; Trying to access ${this.method} route with ${req.method} method.`)
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     */
    extractParams(req) {
        const _params = new URL(req.url, `http://${req.headers.host}`).searchParams
        let params = {}
        _params.forEach((val, key) => params[key] = val)
        return params
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     */
    async extractBody(req) {
        const buffers = [];

        for await (const chunk of req) {
            buffers.push(chunk)
        }

        const data = Buffer.concat(buffers).toString()

        return JSON.parse(data)
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     * @returns 
     */
    async handleRequest(req, res) {
        if (!this.checkMiddleware(req)) return this.earlyReject(req, res);

        let params = this.extractParams(req)
        await this.extractBody(req)
            .then(body => {
                res.end(JSON.stringify(this.handlerFunction(params, body)))
            })
    }
}

class SemnetServer extends HttpMethods {
    // Default options
    options = {
        port: 3000,
        hostname: "127.0.0.1",
        onStart: () => {
            console.log(`Server running at http://${this.options.hostname}:${this.options.port}`)
        }
    }

    constructor(options) {
        super();
        this.server = http.createServer((req, res) => this.handleRequest(req, res))
        this.options = { ...this.options, ...options }
        this.endpoints = []
    }

    start() {
        this.server.listen(this.options.port, this.options.hostname, this.options.onStart)
    }

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
            res.statusCode = 404;
            return responseWithError(res, `Route ${req.url} not found`)
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