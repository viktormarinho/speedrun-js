import fs from "fs";
import { spawn } from "child_process";

let childProccess = spawn('node', ['src/index.mjs']);
let refreshCount = 0;
let refreshTimeout;


fs.watch('src/', (eventType, filename) => {
    if (!refreshTimeout) {
        refreshCount++;
        childProccess.kill();
        childProccess = spawn('node', ['src/index.mjs'])
        console.clear();
        console.log('\x1b[36m' + `Modified file ${filename}, Refreshing. (${refreshCount}x)` + '\x1b[m')
        
        refreshTimeout = setTimeout(function() { refreshTimeout = null }, 500)
    }
})