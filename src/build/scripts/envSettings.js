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
                AVSLUTTA_SELSKAPER: '${process.env.AVSLUTTA_SELSKAPER}',
                STARTET_PAA_SOKNAD: '${process.env.STARTET_PAA_SOKNAD}',
                ARBEIDSTAKERINNTEKT: '${process.env.ARBEIDSTAKERINNTEKT}',
                ANDREGANGSSOKNAD: '${process.env.ANDREGANGSSOKNAD}',
                SIMULER_JUNI: '${process.env.SIMULER_JUNI}',
                APP_VERSION: '${process.env.APP_VERSION}',
            };`
        );
    });
}

module.exports = createEnvSettingsFile;
