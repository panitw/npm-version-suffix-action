const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const path = require('path');

const addSuffix = (version, suffix) => {
    var strRegExPattern = '\\b.*-'+suffix+'\\.[0-9]\\b';
    if (version.match(new RegExp(strRegExPattern, 'g'))) {
        const lastDot = version.lastIndexOf('.');
        const lastRunningNum = parseInt(version.substring(lastDot + 1));
        return version.substring(0, lastDot + 1) + (lastRunningNum + 1);
    } else {
        return version + '-' + suffix + '.1';
    }
}

const main = async () => {
    try {
        const suffix = core.getInput('suffix');
        const workspace = process.env.GITHUB_WORKSPACE;
        const dir = path.resolve(workspace);
        const packageData = fs.readFileSync(path.join(dir, 'package.json'), 'utf8');
        const package = JSON.parse(packageData);
        const currentVersion = package.version;
        const newVersion = addSuffix(currentVersion, suffix);
        await exec.exec('npm', ['version', newVersion, '--no-git-tag-version']);
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();