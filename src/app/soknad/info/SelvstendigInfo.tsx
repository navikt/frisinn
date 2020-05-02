import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import ForetakList from '../../components/foretak-list/ForetakList';
import { Foretak } from '../../types/SoknadEssentials';
import DateView from '../../components/date-view/DateView';
import moment from 'moment';
import { DateRange } from '../../utils/dateUtils';
import { SelvstendigNæringdsrivendeAvslagÅrsak } from '../selvstendig-step/selvstendigAvslag';

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

const StoppForSentInntektstap = ({ currentSøknadsperiode }: { currentSøknadsperiode: DateRange }) => {
    const maanedNestePeriode = moment(currentSøknadsperiode.to).add(1, 'day').toDate();
    const nesteSokeMaaned = moment(maanedNestePeriode).add(1, 'month').toDate();
    return (
        <>
            Du må vente med å søke som selvstendig næringsdrivende. Ordningen er lagt opp til at du må søke
            etterskuddsvis måned for måned. Du må selv dekke de første 16 dagene av inntektstapet ditt. Hvis du har
            inntektstap i <DateView date={maanedNestePeriode} format="monthAndYear" /> kan du tidligst sende søknad i
            begynnelsen av <DateView date={nesteSokeMaaned} format="monthAndYear" />.
        </>
    );
};

const StoppIkkeTapPgaKorona = () => (
    <>
        For å søke om kompensasjon for tapt inntekt, må du helt eller delvis ha tapt inntekt som selvstendig
        næringsdrivende som følge av koronautbruddet.
    </>
);

const StoppYtelseDekkerHeleTapet = () => (
    <>
        For å søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, kan ikke inntektstapet allerede
        være dekket. Det vil si at du ikke kan søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende.
    </>
);

const StoppIkkeHattInntektFraForetak = ({ inntektÅrstall }: { inntektÅrstall: number }) => {
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

const StoppIngenHistoriskInntekt = ({ inntektÅrstall }: { inntektÅrstall: number }) => {
    return inntektÅrstall === 2020 ? (
        <>
            Du kan ikke søke om kompensasjon for tapt inntekt, uten at du har tatt ut inntekt fra selskapet før 1. mars
            2020.
        </>
    ) : (
        <>
            For å kunne søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, må du ha tatt ut inntekt
            i 2019
        </>
    );
};

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

const koronaTaptInntekt = () => (
    <ExpandableInfo title="Hva menes med tapt inntekt?">
        Den tapte inntekten du kan få kompensert, gjelder fra tidspunktet du ikke får inn inntekter du normalt ville
        fått hvis det ikke var for koronautbruddet. Det gjelder altså den faktiske inntekten du har mistet, og ikke fra
        når du eventuelt har mistet oppdrag.
    </ExpandableInfo>
);

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

const infoInntektFlereSelskaper = () => <>Du skal oppgi inntektene samlet for alle selskapene.</>;

const getMessageForAvslag = (
    årsak: SelvstendigNæringdsrivendeAvslagÅrsak,
    inntektÅrstall: number,
    currentSøknadsperiode: DateRange
): React.ReactNode => {
    switch (årsak) {
        case SelvstendigNæringdsrivendeAvslagÅrsak.erIkkeSelvstendigNæringsdrivende:
            return <StoppIkkeHattInntektFraForetak inntektÅrstall={inntektÅrstall} />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona:
            return <StoppIkkeTapPgaKorona />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom:
            return <StoppForSentInntektstap currentSøknadsperiode={currentSøknadsperiode} />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.utebetalingFraNAVDekkerHeleInntektstapet:
            return <StoppYtelseDekkerHeleTapet />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattHistoriskInntekt:
            return <StoppIngenHistoriskInntekt inntektÅrstall={inntektÅrstall} />;
    }
};

const SelvstendigInfo = {
    intro,
    StoppForSentInntektstap,
    StoppIkkeTapPgaKorona,
    StoppYtelseDekkerHeleTapet,
    StoppIkkeHattInntektFraForetak,
    StoppIngenHistoriskInntekt,
    infoInntektForetak,
    infoInntektÅrstall,
    andreUtbetalingerFraNAV,
    infoInntektFlereSelskaper,
    koronaTaptInntekt,
    getMessageForAvslag,
};

export default SelvstendigInfo;
