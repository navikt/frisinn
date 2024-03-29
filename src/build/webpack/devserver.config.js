require('dotenv').config();
const mustacheExpress = require('mustache-express');
const path = require('path');
const envSettings = require('../../../envSettings');

/* Start */

const configureDevServer = (decoratorFragments) => ({
    before: (app) => {
        app.engine('html', mustacheExpress());
        app.set('views', `${__dirname}/../../../dist/dev`);
        app.set('view engine', 'mustache');
        app.get(`${process.env.PUBLIC_PATH}/dist/settings.js`, (req, res) => {
            res.set('content-type', 'application/javascript');
            res.send(`${envSettings()}`);
        });
        app.get('/dist/settings.js', (req, res) => {
            res.set('content-type', 'application/javascript');
            res.send(`${envSettings()}`);
        });
        app.get(/^\/(?!.*dist).*$/, (req, res) => {
            res.render('index.html', Object.assign(decoratorFragments));
        });
    },
    watchContentBase: false,
    quiet: false,
    noInfo: false,
    stats: 'minimal',
    publicPath: `${process.env.PUBLIC_PATH}/dist`,
});

module.exports = configureDevServer;
