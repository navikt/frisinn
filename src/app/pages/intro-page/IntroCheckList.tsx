import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';

const IntroCheckList = () => (
    <Ekspanderbartpanel tittel="Kjekt å vite når du skal søke:">
        <p>
            Nå går du videre i prosessen til utfyllingen av selve søknaden om kompensasjon for tapt inntekt som følge av
            koronautbruddet.
        </p>
        <p>
            Du trenger bank-id for å logge deg inn i søknaden.{' '}
            <Lenke href="https://www.norge.no/elektronisk-id" target="_blank">
                Slik skaffer du bank-id.
            </Lenke>
        </p>
        <p>
            Du vil måtte svare på noen av de samme spørsmålene som ovenfor når du har logget deg inn. En del
            opplysninger henter vi fra offentlige registre, mens noen opplysninger må du skrive inn på nytt.{' '}
        </p>
        <p>Du er selv ansvarlig for å gi oss riktige opplysninger. Vi kontrollerer opplysningene du gir.</p>{' '}
    </Ekspanderbartpanel>
);

export default IntroCheckList;
