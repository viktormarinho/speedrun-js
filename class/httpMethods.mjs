import { Request } from "./request.mjs"

export class HttpMethods {
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