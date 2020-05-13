/*
    Heavily inspired by Mattermost, https://github.com/mattermost/mattermost-webapp/blob/master/e2e/run_tests.js good job guys.
*/

const chalk = require('chalk');
const cypress = require('cypress');
const shell = require('shelljs');
// const argv = require('yargs').argv;
// const fse = require('fs-extra');

const TEST_DIR = './packages/integration-tests/projects/suite-web';

const grepCommand = (word = '') => {
    // -r, recursive search on subdirectories
    // -I, ignore binary
    // -l, only names of files to stdout/return
    // -w, expression is searched for as a word
    return `grep -rIlw '${word}' ${TEST_DIR}`;
};

const grepFiles = (command) => {
    return shell.exec(command, {silent: true}).stdout.
        split('\n').
        filter((f) => f.includes('.test.'));
};

function getTestFiles() {
    return grepFiles(grepCommand());
}

async function runTests() {
    const {
        BRANCH,
        BROWSER,
        BUILD_ID,
        CYPRESS_baseUrl, // eslint-disable-line camelcase
        DIAGNOSTIC_WEBHOOK_URL,
        HEADLESS,
        TEST_DASHBOARD_URL,
        TYPE,
        WEBHOOK_URL,
    } = process.env;

    const bucketFolder = Date.now();

    // await fse.remove('results');
    // await fse.remove('screenshots');

    const browser = BROWSER || 'chrome';
    const initialTestFiles = getTestFiles().sort((a, b) => a.localeCompare(b));
    finalTestFiles = initialTestFiles;

    if (!finalTestFiles.length) {
        console.log(chalk.red('Nothing to test!'));
        return;
    }

    // const mochawesomeReportDir = 'results/mochawesome-report';
    // const {invert, group, stage} = argv;
    let failedTests = 0;


    for (let i = 0; i < finalTestFiles.length; i++) {
        const testFile = finalTestFiles[i];

        // Log which files were being tested
        // console.log(chalk.magenta.bold(`${invert ? 'All Except --> ' : ''}${testStage}${stage && group ? '| ' : ''}${testGroup}`));
        // console.log(chalk.magenta(`(Testing ${i + 1} of ${finalTestFiles.length})  - `, testFile));

        const spec = __dirname + testFile.substr(testFile.lastIndexOf('/tests'));

        const {totalFailed, ...result } = await cypress.run({
            browser,
            // headless,
            headed: true,
            spec,
            config: {
                baseUrl: 'http://localhost:3000',
                supportFile: `${__dirname}/support/index.ts`,
                pluginsFile: `${__dirname}/plugins/index.js`,
                defaultCommandTimeout: 60000,
                screenshotsFolder: `${__dirname}/screenshots`,
                integrationFolder: `${__dirname}/tests`,
                videosFolder: `${__dirname}/videos`,
                video: true,
                chromeWebSecurity: false,
                trashAssetsBeforeRuns: false,
            },
            configFile: false,
            
        });
        console.log('result', result);
        failedTests += totalFailed;
    }

    process.exit(failedTests);
}

runTests();
