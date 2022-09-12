import { provideServer } from "../index.mjs";
import { Tester } from './tester/tester.mjs';

const tester = new Tester();


tester.testTrue("Default options should be set", () => {
    const testServer = provideServer();

    const defaultOptions = {
        port: 3000,
        hostname: "127.0.0.1",
        onStart: () => {
            console.log(`Server running at http://${this.options.hostname}:${this.options.port}`)
        }
    }

    return tester.compareObj(testServer.options, defaultOptions)
});

tester.testTrue("Options passed override default options", () => {
    const options = { port: 8000 }
    const testServer = provideServer(options);

    return testServer.options.port == options.port
})

tester.run();