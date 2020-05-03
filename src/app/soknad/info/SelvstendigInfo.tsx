import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import ForetakList from '../../components/foretak-list/ForetakList';
import { Foretak } from '../../types/SoknadEssentials';
import { DateRange } from '../../utils/dateUtils';
import { SelvstendigNæringdsrivendeAvslagÅrsak } from '../selvstendig-step/selvstendigAvslag';
import DateRangeView from '../../components/date-range-view/DateRangeView';

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

const StoppForSentInntektstap = () => {
    return (
        <>
            Du må selv dekke de første 16 dagene av inntektstapet. Det vil si at hvis inntektstapet ditt startet 15.
            april, dekker du selv hele april. Ordningen er lagt opp til at du må søke etterskuddsvis måned for måned.
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
                <li>Inntekter du har tatt ut av selskapet</li>
                <li>Eventuelle utbetalinger fra NAV som du får som selvstendig næringsdrivende</li>
            </ul>
            <Element>Inntekter som ikke skal tas med:</Element>
            <ul className="infoList">
                <li>Uføretrygd</li>
                <li>Alderspensjon</li>
                <li>Frilansinntekt</li>
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
            Hvis du allerede har en utbetaling fra NAV som kompenserer det samme inntektstapet som selvstendig
            næringsdrivende, kan du ikke søke. Du kan søke selv om du mottar sosial stønad, alderspensjon før fylte 67
            år eller uføretrygd fra NAV.
        </ExpandableInfo>
    </>
);

const infoSelvstendigInntekt2019 = () => (
    <>
        <ExpandableInfo title="TODO: her må vi forklare mer">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit saepe eius esse quas animi, aliquam
            cupiditate unde consequuntur vitae libero nisi ea sint maxime at ullam sequi rem quo sed!
        </ExpandableInfo>
    </>
);

const getMessageForAvslag = (årsak: SelvstendigNæringdsrivendeAvslagÅrsak, inntektÅrstall: number): React.ReactNode => {
    switch (årsak) {
        case SelvstendigNæringdsrivendeAvslagÅrsak.erIkkeSelvstendigNæringsdrivende:
            return <StoppIkkeHattInntektFraForetak inntektÅrstall={inntektÅrstall} />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona:
            return <StoppIkkeTapPgaKorona />;
        case SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom:
            return <StoppForSentInntektstap />;
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
    infoHvordanBeregneInntekt,
    infoInntektÅrstall,
    andreUtbetalingerFraNAV,
    koronaTaptInntekt,
    getMessageForAvslag,
    infoSelvstendigInntekt2019,
};

export default SelvstendigInfo;
