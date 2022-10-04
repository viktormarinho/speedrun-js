import http from 'http'

export class Extractor {
    /**
     * 
     * @param {http.IncomingMessage} req 
     */
    static async extractBody(req) {
        const buffers = [];

        for await (const chunk of req) {
            buffers.push(chunk)
        }

        const data = Buffer.concat(buffers).toString()
        
        // Return empty object if there is no body
        try { return JSON.parse(data) } catch (_) { return {} }
    }
    
    /**
     * 
     * @param {http.IncomingMessage} req 
     */
     static extractParams(req) {
        const _params = new URL(req.url, `http://${req.headers.host}`).searchParams
        let params = {}
        _params.forEach((val, key) => params[key] = val)
        return params
    }
     
}