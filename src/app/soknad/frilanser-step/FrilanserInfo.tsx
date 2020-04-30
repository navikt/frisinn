import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import DateView from '../../components/date-view/DateView';
import moment from 'moment';
import { DateRange } from '../../utils/dateUtils';

const advarselForSentInntektstap = ({ currentSøknadsperiode }: { currentSøknadsperiode: DateRange }) => {
    const maanedNestePeriode = moment(currentSøknadsperiode.to).add(1, 'day').toDate();
    const nesteSokeMaaned = moment(maanedNestePeriode).add(1, 'month').toDate();
    return (
        <>
            <Element>Du må vente med å søke</Element>
            Ordningen er lagt opp til at du må søke etterskuddsvis måned for måned. Du må selv dekke de første 16 dagene
            av inntektstapet ditt. Hvis du har inntektstap i{' '}
            <DateView date={maanedNestePeriode} format="monthAndYear" /> kan du tidligst sende søknad i begynnelsen av{' '}
            <DateView date={nesteSokeMaaned} format="monthAndYear" />.
        </>
    );
};

const advarselIkkeTapPgaKorona = () => (
    <>
        For å søke om kompensasjon for tapt inntekt som frilanser, må du helt eller delvis ha tapt inntekt som følge av
        koronautbruddet.
    </>
);
const advarselAlderSjekkFeiler = () => (
    <>
        <Element>Du kan ikke søke som frilanser for denne perioden</Element>
        <p style={{ marginTop: '.5rem' }}>Kravet er at du må være mellom 18 og 67 år i perioden du søker for.</p>
    </>
);

const hvordanBeregneInntekt = () => (
    <ExpandableInfo title="Hvordan beregner du inntekt?">
        <Element>Inntekter som skal tas med:</Element>
        <ul>
            <li>Inntektene du har på ditt arbeid som frilanser</li>
            <li>Inntekter som er utbetalinger fra NAV som frilanser</li>
        </ul>
        <Element>Inntekter som IKKE skal tas med:</Element>
        <ul>
            <li>Eventuell uføretrygd</li>
            <li>Eventuell alderspensjon</li>
            <li>Eventuell inntekt som selvstendig næringsdrivende</li>
        </ul>
    </ExpandableInfo>
);
const infoInntektForetak = () => (
    <>
        <Element>Inntekter som skal tas med:</Element>
        <ul>
            <li>Inntekter du får for oppdrag som frilanser</li>
            <li>
                <p>Utbetalinger fra NAV som kompenserer inntekten din som frilanser.</p>
                <ul>
                    Hvilke utbetalinger fra NAV gjelder dette?
                    <li>Dagpenger</li>
                    <li>Omsorgspenger</li>
                    <li>Sykepenger</li>
                    <li>Foreldrepenger</li>
                    <li>Svangerskapspenger</li>
                    <li>Pleiepenger</li>
                    <li>Opplæringspenger</li>
                    <li>Arbeidsavklaringspenger</li>
                </ul>
            </li>
        </ul>

        <Element>Inntekter som ikke skal tas med:</Element>
        <ul>
            <li>Inntekter som selvstendig næringsdrivende</li>
            <li>Inntekter som arbeidstaker</li>
            <li>Alderspensjon</li>
            <li>Uføretrygd </li>
            <li>Sosial stønad</li>
        </ul>

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

const ytelseDekkerHeleTapet = () => (
    <>
        For å søke om kompensasjon for tapt inntekt som frilanser, kan ikke inntektstapet allerede være dekket. Det vil
        si at du ikke kan søke om kompensasjon for tapt inntekt som frilanser.
    </>
);

const andreUtbetalingerFraNAV = () => (
    <>
        <ExpandableInfo title="Hva vil dette si?">
            Hvis du har en utbetaling fra NAV som dekker hele inntektstapet ditt som frilanser, kan du ikke søke om
            kompensasjon. Utbetalingene fra NAV kan være én av disse:
            <ul>
                <li>Dagpenger</li>
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

const koronaTaptInntekt = () => (
    <ExpandableInfo title="Hva menes med tapt inntekt?">
        Den tapte inntekten du kan få kompensert, gjelder fra tidspunktet du ikke får inn inntekter du normalt ville
        fått hvis det ikke var for koronautbruddet. Det gjelder altså den faktiske inntekten du har mistet, og ikke fra
        når du eventuelt har mistet oppdrag.
    </ExpandableInfo>
);

const FrilanserInfo = {
    infoInntektForetak,
    advarselForSentInntektstap,
    advarselIkkeTapPgaKorona,
    advarselAlderSjekkFeiler,
    hvordanBeregneInntekt,
    ytelseDekkerHeleTapet,
    andreUtbetalingerFraNAV,
    koronaTaptInntekt,
};

export default FrilanserInfo;
