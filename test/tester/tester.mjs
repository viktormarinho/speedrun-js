
function logPassed(msg) {
    console.log('\x1b[42m%s\x1b[0m', ' PASSED ', msg)
}

function logFailed(msg) {
    console.log('\x1b[41m%s\x1b[0m', ' FAILED ', msg)
}

export class Tester {
    constructor() {
        this.passedCount = 0;
        this.failedCount = 0;
        this.tests = [];
    }

    /**
     * 
     * @param {*} object1 
     * @param {*} object2 
     * @returns 
     */
    compareObj(object1, object2) {
        const tmp = {...object1, ...object2}
        return JSON.stringify(object2) === JSON.stringify(tmp)
    }

    /**
     * 
     * @param {string} description 
     * @param {Function} testFunc 
     */
    testTrue(description, testFunc) {
       this.tests.push({ description: description, testFunc: testFunc, expecting: true})
    }

    /**
     * 
     * @param {string} description 
     * @param {Function} testFunc 
     */
    testFalse(description, testFunc) {
        this.tests.push({ description: description, testFunc: testFunc, expecting: false})
    }

    run() {
        this.tests.forEach(test => {
            const result = test.testFunc()

            if (result == test.expecting) {
                this.passedCount++;
                logPassed(test.description)
            } else {
                this.failedCount++;
                logFailed(test.description)
            }
        })
        
        console.log('\n')
        if (this.failedCount > 0) {
            logFailed("TESTS FAILED")
        } else {
            logPassed("ALL TESTS PASSED")
        }
        console.log(`\n`,
        `📗 Passed: ${this.passedCount} \n`, 
        `📕 Failed: ${this.failedCount} \n`,
        `📘 Total: ${this.failedCount + this.passedCount} \n`,
        `\n`
        )   
    }
    
}