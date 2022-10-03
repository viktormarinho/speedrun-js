import { provideServer } from "../index.mjs";

const server = provideServer();

server.createMiddleware((req) => false, { rejectCode: 401, rejectMsg: 'Rejected By midas'})

server.get("/oioi", (params, body) => {
    return { msg: "Bomdia" }
})

server.post("/oioi", (params, body) => {
    return { msg: "Dale guys" }
})

server.start();