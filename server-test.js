const path = require('path');
const process = require('process');
const express = require('express');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const compression = require('compression');
const helmet = require('helmet');
const envSettings = require('./envSettings');

const server = express();
server.use(helmet());
server.use(compression());
server.set('views', `${__dirname}/dist`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

console.error('process.env.PORT', process.env.PORT);
console.error('process.env.PUBLIC_PATH', process.env.PUBLIC_PATH);
console.error('process.env.API_URL', process.env.API_URL);

const PUBLIC_PATH = process.env.PUBLIC_PATH;

server.use(`/dist`, express.static(path.resolve(__dirname, 'dist')));
server.use(`${PUBLIC_PATH}/dist/js`, express.static(path.resolve(__dirname, 'dist/js')));
server.use(`${PUBLIC_PATH}/dist/css`, express.static(path.resolve(__dirname, 'dist/css')));

const routerHealth = express.Router();
server.use(`${PUBLIC_PATH}/health`, routerHealth);
routerHealth.get('/isAlive', (req, res) => res.sendStatus(200));
routerHealth.get('/isReady', (req, res) => res.sendStatus(200));

server.get(`${process.env.PUBLIC_PATH}/dist/settings.js`, (req, res) => {
    res.set('content-type', 'application/javascript');
    res.send(`${envSettings()}`);
});
server.get(`/dist/settings.js`, (req, res) => {
    res.set('content-type', 'application/javascript');
    res.send(`${envSettings()}`);
});

const renderApp = () =>
    new Promise((resolve, reject) => {
        server.render('index.html', (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });

const startServer = (html) => {
    server.get(/^\/(?!.*dist).*$/, (req, res) => {
        res.send(html);
    });
    server.get(`${process.env.PUBLIC_PATH}/dist/settings.js`, (req, res) => {
        res.set('content-type', 'application/javascript');
        res.send(`${envSettings()}`);
    });
    server.get(`/dist/settings.js`, (req, res) => {
        res.set('content-type', 'application/javascript');
        res.send(`${envSettings()}`);
    });

    const port = process.env.PORT || 8080;
    server.listen(port, () => {
        console.log(`Server-test Web App listening on port: ${port}`);
    });
};

const startExpressWebServer = async () => {
    if (!process.env.PUBLIC_PATH) {
        console.error('PUBLIC_PATH env var must be defined!');
        process.exit(1);
    }
    if (!process.env.API_URL) {
        console.error('API_URL env var must be defined!');
        process.exit(1);
    }
    try {
        const html = await renderApp();
        startServer(html);
    } catch (e) {
        console.error(e);
    }
};

startExpressWebServer();
