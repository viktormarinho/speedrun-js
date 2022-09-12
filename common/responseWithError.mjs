import http from 'http';

/**
 * 
 * @param {http.IncomingMessage} res 
 * @param {string} msg 
 * @param {number} code 
 */
export function responseWithError(res, msg, code) {
    res.statusCode = code || 500;
    res.end(JSON.stringify({ "errorMsg": msg }))
}