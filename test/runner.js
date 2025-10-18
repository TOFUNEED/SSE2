const TestRunner = (() => {
    const reportContainer = document.getElementById('test-report');
    if (!reportContainer) {
        console.error('Test report container with id "test-report" not found.');
        return;
    }

    let currentSuiteElement;

    const createSuiteElement = (description) => {
        const suiteDiv = document.createElement('div');
        suiteDiv.className = 'test-suite';

        const title = document.createElement('h2');
        title.textContent = description;
        suiteDiv.appendChild(title);

        const resultsList = document.createElement('ul');
        resultsList.className = 'test-results';
        suiteDiv.appendChild(resultsList);

        reportContainer.appendChild(suiteDiv);
        return suiteDiv;
    };

    const describe = (description, fn) => {
        currentSuiteElement = createSuiteElement(description);
        fn();
    };

    const it = (description, fn) => {
        const caseElement = document.createElement('li');
        caseElement.className = 'test-case';

        try {
            fn();
            caseElement.classList.add('pass');
            caseElement.textContent = `✔ ${description}`;
        } catch (error) {
            caseElement.classList.add('fail');
            caseElement.textContent = `✖ ${description}`;

            const errorDetails = document.createElement('div');
            errorDetails.className = 'error-details';
            errorDetails.textContent = error.stack || error.message;
            caseElement.appendChild(errorDetails);
        }
        currentSuiteElement.querySelector('.test-results').appendChild(caseElement);
    };

    const expect = (actual) => ({
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Assertion failed: Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`);
            }
        },
        toEqual(expected) {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Assertion failed: Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
            }
        },
        toBeNull() {
            if (actual !== null) {
                throw new Error(`Assertion failed: Expected ${JSON.stringify(actual)} to be null`);
            }
        },
        toBeInstanceOf(constructor) {
            if (!(actual instanceof constructor)) {
                throw new Error(`Assertion failed: Expected object to be an instance of ${constructor.name}`);
            }
        },
        toThrow(expectedError) {
            let threwError = false;
            let actualError = null;
            try {
                actual();
            } catch (e) {
                threwError = true;
                actualError = e;
            }

            if (!threwError) {
                throw new Error(`Assertion failed: Expected function to throw an error, but it did not.`);
            }

            if (expectedError && !(actualError instanceof expectedError)) {
                throw new Error(`Assertion failed: Expected to throw ${expectedError.name}, but threw ${actualError.constructor.name}`);
            }
        },
    });

    return { describe, it, expect };
})();

window.describe = TestRunner.describe;
window.it = TestRunner.it;
window.expect = TestRunner.expect;