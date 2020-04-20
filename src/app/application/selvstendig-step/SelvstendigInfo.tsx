import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Element, Undertittel } from 'nav-frontend-typografi';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import ForetakList from '../../components/foretak-list/ForetakList';
import InfoPanel from '../../components/info-panel/InfoPanel';
import { Foretak } from '../../types/ApplicationEssentials';
import { DateRange } from '../../utils/dateUtils';

const intro = (antallForetak: number, foretak: Foretak[]) => (
    <>
        <p>
            Vi har funnet {antallForetak} foretak registrert på deg som du kan søke om tapt inntekt for. Informasjonen
            du oppgir på denne siden skal gjelde for alle foretakene dine samlet.
        </p>
        <ExpandableInfo closeTitle={'Skjul liste'} title={'Vis foretak vi har registrert'}>
            <ForetakList foretak={foretak} />
        </ExpandableInfo>
    </>
);

const advarselForSentInntektstap = () => (
    <AlertStripeAdvarsel>
        Du kan ikke søke for denne perioden fordi du får dekket først fra og med den 17. dagen etter inntektsstapet
        startet.
    </AlertStripeAdvarsel>
);

const advarselIkkeTapPgaKorona = () => (
    <AlertStripeAdvarsel>Du kan ikke søke om kompensasjon for tap som ikke er forårsaket av Korona</AlertStripeAdvarsel>
);

const infoInntektForetak = (availableDateRange: DateRange) => (
    <InfoPanel>
        <Undertittel>Din inntekt som selvstendig næringsdrivende</Undertittel>
        <p>
            Vi trenger å vite hvilken inntekt du hadde som selvstendig næringsdrivende i perioden{' '}
            <strong>
                <DateRangeView dateRange={availableDateRange} />
            </strong>
            .
        </p>
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
    </InfoPanel>
);

const SelvstendigInfo = {
    intro,
    infoInntektForetak,
    advarselForSentInntektstap,
    advarselIkkeTapPgaKorona,
};

export default SelvstendigInfo;
