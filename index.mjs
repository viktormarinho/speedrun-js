import { provideServer } from './core.mjs';
import ServerQueTemUmPost from "./tenis.mjs"

const server = provideServer();

server.bind(ServerQueTemUmPost)

server.start();