const os = require('os');
const fs = require('fs');
const express = require('express');
const moment = require('moment-timezone');
const server = express();

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = [
        'http://host.docker.internal:8080',
        'http://localhost:8080',
        'http://web:8080',
        'http://192.168.0.115:8080',
    ];
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.indexOf(requestOrigin) >= 0) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }

    res.removeHeader('X-Powered-By');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT']);
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
    fødselsnummer: '30086421581',
    fornavn: 'GODSLIG',
    mellomnavn: null,
    etternavn: 'KRONJUVEL',
};

// const perioderApril = {
//     søknadsperiode: {
//         fom: '2021-09-14',
//         tom: '2021-09-30',
//     },
// };

// const søknadsperiodeSistePeriode = {
//     søknadsperiode: {
//         fom: '2021-09-01',
//         tom: '2021-09-30',
//     },
// };

const personligeForetak = {
    personligeForetak: [{ organisasjonsnummer: '996532912', navn: 'DELT ANSVARLIG', registreringsdato: '2018-12-31' }],
    tidligsteRegistreringsdato: '2020-03-01',
};

const ingenPersonligeForetak = {
    personligeForetak: [],
    tidligsteRegistreringsdato: null,
};

const getInntektsperiode = () => {
    return {
        inntektsperiode: {
            fom: '2020-01-01',
            tom: '2020-12-31',
        },
    };
};

const startExpressServer = () => {
    const port = process.env.PORT || 8089;

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));

    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.get('/tidspunkt', (req, res) => {
        const m = moment().tz('Europe/Oslo');
        setTimeout(() => {
            res.send({
                'Europe/Oslo': m.format(),
                UTC: m.utc().format(),
            });
        }, 500);
    });

    server.get('/soker-not-logged-in', (req, res) => {
        res.sendStatus(401);
    });

    server.get('/tilgjengelig', (req, res) => {
        setTimeout(() => {
            res.sendStatus(200);
        }, 0);
    });

    server.get('/utilgjengelig', (req, res) => {
        setTimeout(() => {
            res.sendStatus(503);
        }, 200);
    });

    server.get('/login', (req, res) => {
        setTimeout(() => {
            res.sendStatus(404);
        }, 5000);
    });

    server.get('/soker', (req, res) => {
        setTimeout(() => {
            res.send(søkerMock);
        }, 200);
    });

    server.get('/har-sokt-tidligere-periode', (req, res) => {
        setTimeout(() => {
            res.send({ harSøktSomSelvstendigNæringsdrivende: false, harSøktSomFrilanser: false });
        }, 200);
    });

    server.post('/inntektsperiode', (req, res) => {
        setTimeout(() => {
            res.send(getInntektsperiode(req.query));
        }, 10);
    });

    server.get('/perioder', (req, res) => {
        setTimeout(() => {
            res.send({
                søknadsperiode: {
                    fom: '2022-03-01',
                    tom: '2022-03-31',
                },
            });
        }, 220);
    });

    server.get('/personlige-foretak', (req, res) => {
        setTimeout(() => {
            res.send(personligeForetak);
        }, 240);
    });

    server.get('/ingen-personlige-foretak', (req, res) => {
        setTimeout(() => {
            res.send(ingenPersonligeForetak);
        }, 250);
    });

    server.get('/aapen-krav/alder', (req, res) => {
        setTimeout(() => {
            res.send({
                innfrirKrav: true,
                beskrivelse:
                    'Søker er 26 år i begynnelsen av perioden , og 26 i slutten av perioden, og innfrir dermed alderskravet.',
            });
        }, 1000);
    });
    server.get('/krav/alder', (req, res) => {
        setTimeout(() => {
            res.send({
                innfrirKrav: true,
                beskrivelse:
                    'Søker er 26 år i begynnelsen av perioden , og 26 i slutten av perioden, og innfrir dermed alderskravet.',
            });
        }, 500);
    });

    server.get('/krav/selvstendig-naeringsdrivende', (req, res) => {
        setTimeout(() => {
            res.send({
                innfrirKrav: true,
                beskrivelse: 'Er registrert som selvstendig næringsdrivende',
            });
        }, 1000);
    });

    server.get('/krav/maks-en-soknad-per-periode', (req, res) => {
        setTimeout(() => {
            res.send({
                innfrirKrav: true,
                beskrivelse: 'Søkeren har allerede søkt for periode 2020-03-14/2020-04-30, og kan ikke søke nå',
            });
        }, 1000);
    });

    server.post('/soknad', (req, res) => {
        const body = req.body;
        console.log('[POST] body', body);
        res.sendStatus(200);
    });

    server.post('/soknad-err', (req, res) => {
        const body = req.body;
        console.log('[POST] body', body);
        res.sendStatus(501);
    });

    server.post('/soknad-logget-ut', (req, res) => {
        res.sendStatus(401);
    });

    server.get('/mellomlagring', (req, res) => {
        if (existsSync(MELLOMLAGRING_JSON)) {
            const body = readFileSync(MELLOMLAGRING_JSON);
            res.send(JSON.parse(body));
        } else {
            res.send({});
        }
    });

    server.put('/mellomlagring', (req, res) => {
        const body = req.body;
        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
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
