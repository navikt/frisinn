import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import ForetakList from '../../components/foretak-list/ForetakList';
import { Foretak } from '../../types/SoknadEssentials';
import { DateRange } from '../../utils/dateUtils';
import { SelvstendigNæringdsrivendeAvslagÅrsak } from '../selvstendig-step/selvstendigAvslag';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import {
    FellesInfoHvaMenesMedTaptInntekt,
    FellesInfoAndreUtbetalingerFraNav,
    FellesStoppForSentInntektstapInnlogget,
    FellesStoppIkkeTapPgaKoronaInnlogget,
    FellesStoppYtelseDekkerHeleTapetInnlogget,
    FellesNårStartetInntektstapet,
} from './FellesInfo';
import { HistoriskInntektÅrstall } from '../../types/HistoriskInntektÅrstall';

const rolleNavn = 'selvstendig næringsdrivende';

const intro = ({ antallForetak, foretak }: { antallForetak: number; foretak: Foretak[] }) => {
    if (antallForetak === 1) {
        return (
            <>
                <p>Det er 1 selskap registrert på deg i Brønnøysundregistrene.</p>
                <ForetakList foretak={foretak} />
            </>
        );
    }
    return (
        <>
            <p>
                Det er {antallForetak} selskap registrert på deg i Brønnøysundregistrene. Du skal oppgi inntektene
                samlet for alle selskapene, selv om du kanskje bare har tapt inntekt i det ene selskapet.
            </p>
            <ExpandableInfo closeTitle={'Skjul liste'} title={'Vis selskap som er registrert'} filledBackground={false}>
                <ForetakList foretak={foretak} />
            </ExpandableInfo>
        </>
    );
};
const introAndregangssøknad = () => {
    return (
        <>
            <p>
                Hvis du har flere selskaper som selvstendig næringsdrivende, skal du oppgi inntektene samlet for alle
                selskapene. Dette gjelder også hvis du for eksempel bare har tapt inntekt i ett av selskapene.
            </p>
        </>
    );
};

const StoppForSentInntektstap = () => <FellesStoppForSentInntektstapInnlogget rolle={rolleNavn} />;

const StoppIkkeTapPgaKorona = () => <FellesStoppIkkeTapPgaKoronaInnlogget rolle={rolleNavn} />;

const StoppYtelseDekkerHeleTapet = () => <FellesStoppYtelseDekkerHeleTapetInnlogget rolle={rolleNavn} />;

const StoppIkkeHattInntektFraForetak = ({ inntektÅrstall }: { inntektÅrstall?: number }) => {
    return inntektÅrstall === 2020 ? (
        <>
            Du kan ikke søke om kompensasjon for tapt inntekt, uten at du har tatt ut inntekt fra selskapet før 1. mars
            2020.
        </>
    ) : (
        <>
            Du kan ikke søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, uten at du har tatt ut
            inntekt fra selskapet i 2019.
        </>
    );
};

const StoppIngenHistoriskInntekt = ({ inntektÅrstall }: { inntektÅrstall?: number }) => {
    return inntektÅrstall === 2020 ? (
        <>
            Du kan ikke søke om kompensasjon for tapt inntekt, uten at du har tatt ut inntekt fra selskapet før 1. mars
            2020.
        </>
    ) : (
        <>
            Du kan ikke søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, uten at du har tatt ut
            inntekt fra selskapet i 2019.
        </>
    );
};

const StoppIkkeAlleAvsluttaSelskaperErRegistrert = () => <>Du må registrere alle selskapene før du kan fortsette.</>;

const infoHvordanBeregneInntekt = ({ periode }: { periode: DateRange }) => (
    <ExpandableInfo title="Hvordan beregner du inntekt?">
        Inntekten du skal opplyse om er personinntekt for næring, og som gjelder for perioden{' '}
        <strong>
            <DateRangeView dateRange={periode} />
        </strong>
        . Personinntekt betyr inntekter minus utgifter i denne perioden.
        <Box margin="l">
            <Element>Inntekter som skal tas med:</Element>
            <ul className="infoList">
                <li>Personinntekt fra næringen</li>
                <li>Eventuelle utbetalinger fra NAV som du får som selvstendig næringsdrivende</li>
            </ul>
            <Element>Inntekter som ikke skal tas med:</Element>
            <ul className="infoList">
                <li>Utbetaling fra denne ordningen</li>
                <li>Inntekt som arbeidstaker</li>
                <li>Inntekt som frilanser</li>
                <li>Uføretrygd</li>
                <li>Alderspensjon</li>
            </ul>
        </Box>
    </ExpandableInfo>
);

const infoTaptInntektPgaKorona = () => <FellesInfoHvaMenesMedTaptInntekt />;

const infoInntektÅrstall = ({ inntektÅrstall }: { inntektÅrstall: number }) => {
    return inntektÅrstall === 2020 ? (
        <>
            <ExpandableInfo title={`Hva betyr dette?`}>
                For å kunne søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, må du ha tatt ut
                inntekt før 1. mars 2020.
            </ExpandableInfo>
        </>
    ) : (
        <>
            <ExpandableInfo title={`Hva betyr dette?`}>
                For å kunne søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, må du ha tatt ut
                inntekt i 2019.
            </ExpandableInfo>
        </>
    );
};

const infoAndreUtbetalingerFraNAV = () => <FellesInfoAndreUtbetalingerFraNav rolle={rolleNavn} />;

const infoSelvstendigInntekt2019 = () => (
    <>
        <ExpandableInfo title="Personinntekt fra næringen din for 2019">
            Her skal du oppgi personinntekten fra næringen din for 2019. Personinntekten må samsvare med
            &quot;personinntekt for næring&quot; som du oppgir til Skatteetaten i skattemeldingen.
            <p>
                Hvis du ikke har levert skattemelding og næringsoppgave til Skatteetaten enda, må du fastsette
                personinntekten fra næringen din. Dette må du gjøre for å kunne sende inn denne søknaden.
            </p>
            <p>
                Når skattemeldingen for 2019 er klar, kontrollerer vi at tallene du legger inn her samsvarer med tallene
                du oppgir til Skattetaten i næringsoppgaven for 2019.
            </p>
        </ExpandableInfo>
    </>
);

const getMessageForAvslag = (
    årsak: SelvstendigNæringdsrivendeAvslagÅrsak,
    inntektÅrstall?: HistoriskInntektÅrstall
): React.ReactNode => {
    switch (årsak) {
        case SelvstendigNæringdsrivendeAvslagÅrsak.oppgirHarIkkeHattInntektFraForetak:
            return <StoppIkkeHattInntektFraForetak inntektÅrstall={inntektÅrstall} />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona:
            return <StoppIkkeTapPgaKorona />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom:
            return <StoppForSentInntektstap />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.harYtelseFraNavSomDekkerTapet:
            return <StoppYtelseDekkerHeleTapet />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.oppgirNullHistoriskInntekt:
            return <StoppIngenHistoriskInntekt inntektÅrstall={inntektÅrstall} />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.ikkeAlleAvsluttaSelskaperErRegistrert:
            return <StoppIkkeAlleAvsluttaSelskaperErRegistrert />;
    }
};

const infoNårStartetInntektstapet = ({ søknadsperiode }: { søknadsperiode: DateRange }) => (
    <FellesNårStartetInntektstapet søknadsperiode={søknadsperiode} />
);

const SelvstendigInfo = {
    intro,
    introAndregangssøknad,
    StoppForSentInntektstap,
    StoppIkkeTapPgaKorona,
    StoppYtelseDekkerHeleTapet,
    StoppIkkeHattInntektFraForetak,
    StoppIngenHistoriskInntekt,
    StoppIkkeAlleAvsluttaSelskaperErRegistrert,
    infoHvordanBeregneInntekt,
    infoInntektÅrstall,
    infoAndreUtbetalingerFraNAV,
    infoTaptInntektPgaKorona,
    getMessageForAvslag,
    infoSelvstendigInntekt2019,
    infoNårStartetInntektstapet,
};

export default SelvstendigInfo;
