import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';

const advarselForSentInntektstap = () => (
    <AlertStripeAdvarsel>
        Du kan ikke søke for denne perioden fordi du får dekket først fra og med den 17. dagen etter inntektsstapet
        startet.
    </AlertStripeAdvarsel>
);

const advarselIkkeTapPgaKorona = () => (
    <AlertStripeAdvarsel>Du kan ikke søke om kompensasjon for tap som ikke er forårsaket av Korona</AlertStripeAdvarsel>
);
const advarselAlderSjekkFeiler = () => (
    <AlertStripeAdvarsel>
        <Element>Du kan ikke søke som frilanser for denne perioden</Element>
        <p style={{ marginTop: '.5rem' }}>Kravet er at du må være mellom 18 og 67 år i perioden du søker for.</p>
    </AlertStripeAdvarsel>
);

const infoInntektForetak = () => (
    <>
        <Box margin="l">
            <Element>Inntekter som skal tas med:</Element>
            <ul>
                <li>Inntektene du har på dine foretak. Dette er omsetning - utgifter</li>
                <li>Inntekter som er utbetalinger fra NAV som selvstendig næringsdrivende</li>
            </ul>
            <Element>Inntekter som IKKE skal tas med:</Element>
            <ul>
                <li>Eventuell uføretrygd</li>
                <li>Eventuell alderspensjon</li>
                <li>Eventuell inntekt som frilanser</li>
            </ul>
        </Box>
    </>
);

const FrilanserInfo = {
    infoInntektForetak,
    advarselForSentInntektstap,
    advarselIkkeTapPgaKorona,
    advarselAlderSjekkFeiler,
};

export default FrilanserInfo;
