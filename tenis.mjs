import { provideServer } from './core.mjs';

const server = provideServer();

server.post("/tenis", (params, body) => {

    return body
})

export default server