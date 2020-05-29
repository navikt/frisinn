import React from 'react';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import { Element } from 'nav-frontend-typografi';
import { DateRange } from '../../utils/dateUtils';
import moment from 'moment';

export const FellesInfoHvaMenesMedTaptInntekt = () => (
    <ExpandableInfo title="Hva menes med tapt inntekt?">
        Den tapte inntekten du kan få kompensert, gjelder fra tidspunktet du ikke får inn inntekter du normalt ville
        fått hvis det ikke var for koronautbruddet. Det gjelder altså den faktiske inntekten du har mistet, og ikke fra
        når du eventuelt har mistet oppdrag.
    </ExpandableInfo>
);

export const FellesNårStartetInntektstapet = ({ søknadsperiode }: { søknadsperiode: DateRange }) => {
    const mnd = moment(søknadsperiode.to).subtract(1, 'month').format('MMMM');
    return (
        <ExpandableInfo title="Hvilken dato skal legges inn?">
            Her skal du legge inn datoen fra da inntektstapet ditt startet på grunn av koronautbruddet.
            <p>
                Hvis du har hatt en utbetaling fra NAV i perioden <strong>etter</strong> at inntektstapet ditt startet,
                legger du inn datoen fra den dagen utbetalingen fra NAV stoppet.
            </p>
            <p>
                Det vil si at hvis du for eksempel har hatt omsorgspenger frem til 25. {mnd}, skal du legge inn 26.{' '}
                {mnd} som dato for når inntektstapet ditt startet.
            </p>
        </ExpandableInfo>
    );
};

export const FellesInfoAndreUtbetalingerFraNav = ({ rolle }: { rolle: string }) => (
    <ExpandableInfo title="Hva vil dette si?">
        Hvis du allerede har en utbetaling fra NAV som kompenserer det samme inntektstapet som {rolle}, kan du ikke
        søke. Du kan søke selv om du mottar sosial stønad, alderspensjon før fylte 67 år eller uføretrygd fra NAV.
    </ExpandableInfo>
);

export const FellesStoppSentInntektstap = ({ rolle }: { rolle: string }) => (
    <>
        <Element>Du må vente med å søke kompensasjon for tapt inntekt som {rolle}</Element>
        Du må selv dekke de første 16 dagene av inntektstapet. Det vil si at hvis inntektstapet ditt startet 15. april,
        dekker du selv hele april. Ordningen er lagt opp til at du må søke etterskuddsvis måned for måned. I dette
        tilfelle betyr det at du tidligst kan sende inn søknad i begynnelsen av juni 2020.
    </>
);

export const FellesStoppForSentInntektstapInnlogget = ({ rolle }: { rolle: string }) => (
    <>
        <Element>Du må vente med å søke som {rolle}</Element>
        Du må selv dekke de første 16 dagene av inntektstapet. Det vil si at hvis inntektstapet ditt startet 15. april,
        dekker du selv hele april. Ordningen er lagt opp til at du må søke etterskuddsvis måned for måned.
    </>
);

export const FellesStoppIkkeTapPgaKoronaInnlogget = ({ rolle }: { rolle: string }) => (
    <>
        For å søke om kompensasjon for tapt inntekt, må du helt eller delvis ha tapt inntekt som {rolle} som følge av
        koronautbruddet.
    </>
);

export const FellesStoppYtelseDekkerHeleTapetInnlogget = ({ rolle }: { rolle: string }) => (
    <>
        For å søke om kompensasjon for tapt inntekt som {rolle}, kan ikke inntektstapet allerede være dekket. Det vil si
        at du ikke kan søke om kompensasjon for tapt inntekt som {rolle}.
    </>
);
