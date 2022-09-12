import { responseWithError } from "./../common/responseWithError.mjs";
import http from 'http'

export class Middleware {
    constructor(validateFunc, config) {
        this.validate = validateFunc;
        this.config = config;
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    rejectFunc(req, res) {
        responseWithError(res, this.config.rejectMsg, this.config.rejectCode);
    }
}