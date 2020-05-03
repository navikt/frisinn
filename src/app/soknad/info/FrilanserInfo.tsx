import React from 'react';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import { DateRange } from '../../utils/dateUtils';
import { FrilanserAvslagÅrsak } from '../frilanser-step/frilanserAvslag';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import {
    FellesInfoHvaMenesMedTaptInntekt,
    FellesInfoAndreUtbetalingerFraNav,
    FellesStoppForSentInntektstapInnlogget,
    FellesStoppIkkeTapPgaKoronaInnlogget,
    FellesStoppYtelseDekkerHeleTapetInnlogget,
} from './FellesInfo';

const rolleNavn = 'frilanser';

const StoppForSentInntektstap = () => <FellesStoppForSentInntektstapInnlogget rolle={rolleNavn} />;

const StoppIkkeTapPgaKorona = () => <FellesStoppIkkeTapPgaKoronaInnlogget rolle={rolleNavn} />;

const StoppYtelseDekkerHeleTapet = () => <FellesStoppYtelseDekkerHeleTapetInnlogget rolle={rolleNavn} />;

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

const infoAndreUtbetalingerFraNAV = () => <FellesInfoAndreUtbetalingerFraNav rolle={rolleNavn} />;

const infoTaptInntektPgaKorona = () => <FellesInfoHvaMenesMedTaptInntekt />;

const getMessageForAvslag = (årsak: FrilanserAvslagÅrsak): React.ReactNode => {
    switch (årsak) {
        case FrilanserAvslagÅrsak.harIkkeHattInntektstapPgaKorona:
            return <StoppIkkeTapPgaKorona />;
        case FrilanserAvslagÅrsak.søkerIkkeForGyldigTidsrom:
            return <StoppForSentInntektstap />;
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
    StoppYtelseDekkerHeleTapet,
    infoHvordanBeregneInntekt,
    infoAndreUtbetalingerFraNAV,
    infoTaptInntektPgaKorona,
    infoErNyetablert,
    getMessageForAvslag,
};

export default FrilanserInfo;
