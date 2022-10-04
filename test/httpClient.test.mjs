import { HttpClient } from "./tester/httpClient.mjs";

const client = new HttpClient();

const res = await client.post("http://127.0.0.1:3000/oioi", { bloq: false })

console.log(res)