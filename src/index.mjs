import { provideServer } from "../index.mjs";

const server = provideServer();

server.createMiddleware(async ({body}) => {
    console.log('passando pello mw', body)
    return body.bloq
})

server.get("/oioi", ({params, headers}) => {
    return { msg: "Bomdia", headers, params }
})

server.post("/oioi", ({body}) => {
    return { recebi: body }
})

server.start();