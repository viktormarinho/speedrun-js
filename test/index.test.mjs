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

tester.testTrue("Options passed should override default options", () => {
    const options = { port: 8000 }
    const testServer = provideServer(options);

    return testServer.options.port == options.port
})

tester.testTrue("Adding same endpoint 2 times w/ same method should throw an error", () => {
    const testServer = provideServer();
    try {
        testServer.get("/hello", () => {})
        testServer.get("/hello", () => {})
        return false
    } catch (e) {
        return true
    }
})

tester.testTrue("Adding same endpoint 2 times w/ different methods should work", () => {
    const testServer = provideServer();
    try {
        testServer.get("/hello", () => {})
        testServer.post("/hello", () => {})

        return true
    } catch (e) {
        return false
    }
})

tester.run();