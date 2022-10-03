import { responseWithError } from './../common/responseWithError.mjs'
import http from 'http';

export class Request {
    /**
     * 
     * @param {Function} handlerFunction 
     * @param {string} method 
     */
    constructor(handlerFunction, method, middlewares) {
        this.handlerFunction = handlerFunction;
        this.method = method;
        this.middlewares = middlewares;
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @returns 
     */
    requestMethodMiddleware(req) {
        return req.method == this.method
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    rejectWrongMethod(req, res) {
        responseWithError(res, `Wrong method; Trying to access ${this.method} route with ${req.method} method.`, 405)
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
     */
    validateMiddlewares(req) {
        for (let mw of this.middlewares) {
            if (!mw.validate(req)) return { ok: false, middleware: mw }
        }
        return { ok: true }
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     * @returns 
     */
    async handleRequest(req, res) {
        if (!this.requestMethodMiddleware(req)) return this.rejectWrongMethod(req, res);
        
        const {ok, middleware} = this.validateMiddlewares(req);

        if (!ok) {
            return middleware.rejectFunction(req, res)
        }

        let params = this.extractParams(req)
        
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
    }
}