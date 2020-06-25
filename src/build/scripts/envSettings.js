const fsExtra = require('fs-extra');

function createEnvSettingsFile(settingsFile) {
    fsExtra.ensureFile(settingsFile).then((f) => {
        fsExtra.writeFileSync(
            settingsFile,
            `window.appSettings = {
                API_URL: '${process.env.API_URL}',
                LOGIN_URL: '${process.env.LOGIN_URL}',
                PUBLIC_PATH: '${process.env.PUBLIC_PATH}',
                UTILGJENGELIG: '${process.env.UTILGJENGELIG}',
                PERSISTENCE: '${process.env.PERSISTENCE}',
                APP_VERSION: '${process.env.APP_VERSION}',
                APPSTATUS_PROJECT_ID: '${process.env.APPSTATUS_PROJECT_ID}',
                APPSTATUS_DATASET: '${process.env.APPSTATUS_DATASET}',
            };`
        );
    });
}

module.exports = createEnvSettingsFile;
