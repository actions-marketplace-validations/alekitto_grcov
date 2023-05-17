import * as core from '@actions/core';
import * as configuration from './configuration';
import * as coverage from './coverage';
import * as grcov from './grcov';

async function run() {
    const config = await configuration.load();

    let coverageArchive;
    try {
        core.startGroup('Searching for coverage files');
        coverageArchive = await coverage.prepareArchive(config.system.workspace);
    } finally {
        core.endGroup();
    }

    const exe = await grcov.Grcov.get();
    const outputPath = await exe.call(config, coverageArchive);

    core.setOutput('report', outputPath);
}

async function main() {
    try {
        await run();
    } catch (error) {
        core.setFailed((error as Error).message);
    }
}

main();
