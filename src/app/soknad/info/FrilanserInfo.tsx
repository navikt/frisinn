import React from 'react';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import DateView from '../../components/date-view/DateView';
import moment from 'moment';
import { DateRange } from '../../utils/dateUtils';
import { FrilanserAvslagÅrsak } from '../frilanser-step/frilanserAvslag';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

const StoppForSentInntektstap = ({ currentSøknadsperiode }: { currentSøknadsperiode: DateRange }) => {
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

const StoppIkkeTapPgaKorona = () => (
    <>
        For å søke om kompensasjon for tapt inntekt som frilanser, må du helt eller delvis ha tapt inntekt som følge av
        koronautbruddet.
    </>
);
const StoppAlderSjekkFeiler = () => (
    <>
        <Element>Du kan ikke søke som frilanser for denne perioden</Element>
        <p style={{ marginTop: '.5rem' }}>Kravet er at du må være mellom 18 og 67 år i perioden du søker for.</p>
    </>
);

const infoHvordanBeregneInntekt = ({ periode }: { periode: DateRange }) => (
    <ExpandableInfo title="Hvordan beregner du inntekt?">
        Inntekten du skal opplyse om er personinntekt for oppdrag, som du mottar for perioden{' '}
        <strong>
            <DateRangeView dateRange={periode} />
        </strong>
        . Personinntekt betyr inntekter minus utgifter i denne perioden.
        <Box margin="l">
            <Element>Inntekter som skal tas med:</Element>
            <ul className="infoList">
                <li>Inntekter du mottar for oppdrag hos en arbeidsgiver </li>
                <li>Eventuelle utbetalinger fra NAV som du får som frilanser </li>
            </ul>
            <Element>Inntekter som ikke skal tas med:</Element>
            <ul className="infoList">
                <li>Uføretrygd </li>
                <li>Alderspensjon </li>
                <li>Inntekt som selvstendig næringsdrivende </li>
            </ul>
        </Box>
    </ExpandableInfo>
);

const StoppYtelseDekkerHeleTapet = () => (
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

const getMessageForAvslag = (årsak: FrilanserAvslagÅrsak, currentSøknadsperiode: DateRange): React.ReactNode => {
    switch (årsak) {
        case FrilanserAvslagÅrsak.harIkkeHattInntektstapPgaKorona:
            return <StoppIkkeTapPgaKorona />;
        case FrilanserAvslagÅrsak.søkerIkkeForGyldigTidsrom:
            return <StoppForSentInntektstap currentSøknadsperiode={currentSøknadsperiode} />;
        case FrilanserAvslagÅrsak.utebetalingFraNAVDekkerHeleInntektstapet:
            return <StoppYtelseDekkerHeleTapet />;
    }
};

const infoErNyetablert = () => (
    <ExpandableInfo title="Hva menes med dette?">
        Hvis du også har vært frilanser før 1. mars 2019, men ikke har hatt inntekt etter 2017, kan du svare ja på dette
        spørsmålet.
    </ExpandableInfo>
);

const FrilanserInfo = {
    StoppForSentInntektstap,
    StoppIkkeTapPgaKorona,
    StoppAlderSjekkFeiler,
    infoHvordanBeregneInntekt,
    StoppYtelseDekkerHeleTapet,
    andreUtbetalingerFraNAV,
    koronaTaptInntekt,
    getMessageForAvslag,
    infoErNyetablert,
};

export default FrilanserInfo;
