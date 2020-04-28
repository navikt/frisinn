import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import ForetakList from '../../components/foretak-list/ForetakList';
import { Foretak } from '../../types/SoknadEssentials';
// import { pluralize } from '../../utils/pluralize';
import DateView from '../../components/date-view/DateView';
import moment from 'moment';

const intro = ({ antallForetak, foretak }: { antallForetak: number; foretak: Foretak[] }) => {
    if (antallForetak === 1) {
        return (
            <>
                <p>Det er 1 selskap registrert på deg i Brønnøysundregistret.</p>
                <ForetakList foretak={foretak} />
            </>
        );
    }
    return (
        <>
            <p>
                Det er {antallForetak} selskap registrert på deg i Brønnøysundregisteret. Du skal oppgi inntektene
                samlet for alle selskapene, selv om du kanskje bare har tapt inntekt i det ene selskapet.
            </p>
            <ExpandableInfo closeTitle={'Skjul liste'} title={'Vis selskap som er registrert'} filledBackground={false}>
                <ForetakList foretak={foretak} />
            </ExpandableInfo>
        </>
    );
};

const advarselForSentInntektstap = ({ nesteMaaned }: { nesteMaaned: Date }) => (
    <>
        <Element>Du må vente med å søke</Element>
        Ordningen er lagt opp til at du må søke etterskuddsvis måned for måned. Du må selv dekke de første 16 dagene av
        inntektstapet ditt. Hvis du har inntektstap i <DateView date={nesteMaaned} format="monthAndYear" /> kan du
        tidligst sende søknad i begynnelsen av{' '}
        <DateView date={moment(nesteMaaned).add(1, 'month').toDate()} format="monthAndYear" />.
    </>
);

const advarselIkkeTapPgaKorona = () => (
    <>
        For å søke om kompensasjon for tapt inntekt, må du helt eller delvis ha tapt inntekt som selvstendig
        næringsdrivende som følge av koronautbruddet.
    </>
);

const advarselAlderSjekkFeiler = () => (
    <>
        <p style={{ marginTop: '.5rem' }}>Kravet er at du må være mellom 18 og 67 år i perioden du søker for.</p>
    </>
);

const ytelseDekkerHeleTapet = () => (
    <>
        For å søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, kan ikke inntektstapet allerede
        være dekket. Det vil si at du ikke kan søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende.
    </>
);

const infoInntektForetak = () => (
    <ExpandableInfo title="Hvordan beregner du inntekt?">
        Hvis du har flere selskap, skal du legge inn samlet beløp
        <Box margin="l">
            <Element>Inntekter som skal tas med:</Element>
            <ul>
                <li>Inntektene du har tatt ut av selskap</li>
                <li>Inntekter som er utbetalinger fra NAV som selvstendig næringsdrivende</li>
            </ul>
            <Element>Inntekter som IKKE skal tas med:</Element>
            <ul>
                <li>Eventuell uføretrygd</li>
                <li>Eventuell alderspensjon</li>
                <li>Eventuell inntekt som frilanser</li>
            </ul>
        </Box>
    </ExpandableInfo>
);

const advarselIkkeHattInntektFraForetak = ({ inntektÅrstall: årstall }: { inntektÅrstall: number }) => (
    <>
        <>Du må ha hatt inntekt før 1. mars i {årstall} for å kunne søke.</>
    </>
);

const infoInntektÅrstall = ({ foretak, inntektÅrstall }: { foretak: Foretak[]; inntektÅrstall: number }) => (
    <>
        <ExpandableInfo title={`Hvorfor inntekt i ${inntektÅrstall}?`}>
            For å kunne søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, må du ha tatt ut inntekt
            fra selskapet. Hvis selskapet er registrert i 2019 eller tidligere, må du ha tatt ut inntekt i 2019. Hvis
            selskapet ditt er registrert i 2020, må du ha tatt ut inntekt i 2020.
        </ExpandableInfo>
    </>
);

const andreUtbetalingerFraNAV = () => (
    <>
        <ExpandableInfo title="Hva vil dette si?">
            Hvis du har en utbetaling fra NAV som dekker hele inntektstapet ditt som selvstendig næringsdrivende, kan du
            ikke søke om kompensasjon. Utbetalingene fra NAV kan være én av disse:
            <ul>
                <li>Omsorgspenger</li>
                <li>Sykepenger</li>
                <li>Foreldrepenger</li>
                <li>Svangerskapspenger</li>
                <li>Pleiepenger</li>
                <li>Opplæringspenger</li>
                <li>Arbeidsavklaringspenger</li>
            </ul>
            Hvis du har én av disse utbetalingene, men bare delvis, kan du søke. Du kan også søke selv om du mottar
            sosial stønad, alderspensjon før fylte 67 år eller uføretrygd fra NAV.
        </ExpandableInfo>
    </>
);

const infoInntektFlereSelskaper = () => <>Du skal legge inn samlet beløp fra alle dine selskaper</>;

const SelvstendigInfo = {
    intro,
    infoInntektForetak,
    advarselForSentInntektstap,
    advarselIkkeTapPgaKorona,
    advarselAlderSjekkFeiler,
    ytelseDekkerHeleTapet,
    advarselIkkeHattInntektFraForetak,
    infoInntektÅrstall,
    andreUtbetalingerFraNAV,
    infoInntektFlereSelskaper,
};

export default SelvstendigInfo;
