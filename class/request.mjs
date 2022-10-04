import { responseWithError } from './../common/responseWithError.mjs'
import http from 'http';
import { Extractor } from './extractor.mjs';

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
    validateMiddlewares(requestData) {
        for (let mw of this.middlewares) {
            if (!mw.validate(requestData)) return { ok: false, middleware: mw }
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

        const params = Extractor.extractParams(req)
        const headers = req.headers;

        try {
            const body = await Extractor.extractBody(req)

            const requestData = {params, body, headers}

            const {ok, middleware} = this.validateMiddlewares(requestData);

            if (!ok) {
                return middleware.rejectFunction(req, res)
            }

            res.end(JSON.stringify(this.handlerFunction(requestData)))
        } catch (err) {
            return responseWithError(res, err.message, 400);
        }
    }
}