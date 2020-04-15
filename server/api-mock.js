const os = require('os');
const fs = require('fs');
const express = require('express');
const _ = require('lodash');

const server = express();

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = ['http://host.docker.internal:8080', 'http://localhost:8080', 'http://web:8080'];
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

const MELLOMLAGRING_JSON = `${os.tmpdir()}/frisinn-mellomlagring.json`;

const isJSON = (str) => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
};

const writeFileAsync = async (path, text) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, text, 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const readFileSync = (path) => {
    return fs.readFileSync(path, 'utf8');
};

const existsSync = (path) => fs.existsSync(path);

const søkerMock = {
    fornavn: 'Test',
    mellomnavn: undefined,
    etternavn: 'Testesen',
    fødselsnummer: '22075944547',
    myndig: true,
};

const perioderMock = {
    søknadsperiode: {
        fom: '2020-04-1',
        tom: '2020-04-30',
    },
    kanSøkeSomFrilanser: {
        fom: '2020-05-06',
        tom: '2020-05-30',
    },
    kanSøkeSomSelvstendigNæringsdrivende: {
        fom: '2020-05-01',
        tom: '2020-05-30',
    },
};

const enkeltpersonforetakMock = {
    enkeltpersonforetak: [
        {
            organisasjonsnummer: '995298775',
            navn: 'ARBEIDS- OG VELFERDSDIREKTORATET AVD SANNERGATA',
            registreringsdato: '2006-06-01',
        },
    ],
    tidligsteReistreringsdato: '2006-06-01',
};

const startExpressServer = () => {
    const port = process.env.PORT || 8089;

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));
    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.get('/soker-not-logged-in', (req, res) => {
        res.send(401);
    });

    server.get('/soker', (req, res) => {
        setTimeout(() => {
            res.send(søkerMock);
        }, 250);
    });

    server.get('/soker', (req, res) => {
        setTimeout(() => {
            res.send(søkerMock);
        }, 250);
    });

    server.get('/perioder', (req, res) => {
        setTimeout(() => {
            res.send(perioderMock);
        }, 250);
    });

    server.get('/enkeltpersonforetak', (req, res) => {
        setTimeout(() => {
            res.send(enkeltpersonforetakMock);
        }, 250);
    });

    server.get('/krav/alder', (req, res) => {
        setTimeout(() => {
            res.send({
                innfrirKrav: true,
                beskrivelse:
                    'Søker er 26 år i begynnelsen av perioden , og 26 i slutten av perioden, og innfrir dermed alderskravet.',
            });
        }, 1000);
    });

    server.get('/krav/selvstendig-naeringsdrivende', (req, res) => {
        setTimeout(() => {
            res.send({
                innfrirKrav: true,
                beskrivelse: 'Er registrert som selvstendig næringsdrivende',
            });
        }, 1000);
    });

    server.get('/krav/frilanser', (req, res) => {
        setTimeout(() => {
            res.send({
                innfrirKrav: false,
                beskrivelse: 'Er ikke registrert som frilanser',
            });
        }, 1000);
    });

    server.post('/soknad', (req, res) => {
        const body = req.body;
        console.log('[POST] body', body);
        res.sendStatus(200);
    });

    server.get('/mellomlagring', (req, res) => {
        if (existsSync(MELLOMLAGRING_JSON)) {
            const body = readFileSync(MELLOMLAGRING_JSON);
            res.send(JSON.parse(body));
        } else {
            res.send({});
        }
    });

    server.post('/mellomlagring', (req, res) => {
        const body = req.body;
        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
    });
    server.delete('/mellomlagring', (req, res) => {
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify({}, null, 2));
        res.sendStatus(200);
    });

    server.listen(port, () => {
        console.log(`Express mock-api server listening on port: ${port}`);
    });
};

startExpressServer();
