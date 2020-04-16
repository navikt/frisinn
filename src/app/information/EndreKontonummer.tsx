import React from 'react';
import Lenke from 'nav-frontend-lenker';
import InfoWrapper from './InfoWrapper';

const EndreKontonummer = () => (
    <InfoWrapper>
        <p>Du må ha registrert ett korrekt kontonummer hos NAV for å kunne sende inn denne søknaden.</p>
        <Lenke href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/slik-registrerer-og-endrer-du-kontonummer-hos-nav">
            Se hvordan du registrerer eller endrer kontonummer
        </Lenke>
    </InfoWrapper>
);

export default EndreKontonummer;
