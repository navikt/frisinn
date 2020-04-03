const express = require('express');
// const Busboy = require('busboy');

const server = express();

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = ['http://host.docker.internal:8084', 'http://localhost:8084', 'http://web:8084'];
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.indexOf(requestOrigin) >= 0) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }

    res.removeHeader('X-Powered-By');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE']);
    res.set('Access-Control-Allow-Credentials', true);
    next();
});

const søkerMock = {
    fornavn: 'Test',
    mellomnavn: undefined,
    etternavn: 'Testesen',
    fødselsnummer: '12345123456',
    myndig: true
};

const startExpressServer = () => {
    const port = process.env.PORT || 8089;

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));
    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.get('/soker', (req, res) => {
        res.send(søkerMock);
    });

    server.post('/soknad/send-application', (req, res) => {
        const body = req.body;
        console.log('[POST] body', body);
        res.sendStatus(200);
    });

    server.listen(port, () => {
        console.log(`Express mock-api server listening on port: ${port}`);
    });
};

startExpressServer();
