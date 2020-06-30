import React from 'react';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import { Element } from 'nav-frontend-typografi';
import { DateRange, getMonthName } from '../../utils/dateUtils';
import moment from 'moment';
import { formatDate } from '../../components/date-view/DateView';
import { Søknadsperiodeinfo } from '../../types/SoknadEssentials';
import { FormattedMessage } from 'react-intl';

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
            Her skal du legge inn datoen fra første gang inntektstapet ditt startet på grunn av koronautbruddet. Hvis
            inntektstapet for eksempel startet 14. mars 2020, er det denne datoen du skal legge inn her.
            <p>
                Hvis du har hatt en <strong>annen</strong> utbetaling fra NAV i perioden <strong>etter</strong> at
                inntektstapet ditt startet, legger du inn datoen fra den dagen utbetalingen fra NAV stoppet. Det vil si
                at hvis du for eksempel har hatt omsorgspenger frem til 25. {mnd}, skal du legge inn 26. {mnd} som dato
                for når inntektstapet ditt startet.
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

export const FellesStoppSentInntektstap = ({
    rolle,
    søknadsperiodeinfo: { førsteUgyldigeStartdatoForInntektstap, søknadsperiode },
}: {
    rolle: string;
    søknadsperiodeinfo: Søknadsperiodeinfo;
}) => {
    const dagOgMnd = formatDate(førsteUgyldigeStartdatoForInntektstap, 'dateAndMonth');
    const mnd = getMonthName(førsteUgyldigeStartdatoForInntektstap);
    const nesteMnd = getMonthName(moment(søknadsperiode.to).add(2, 'month').toDate());
    return (
        <>
            <Element>Du må vente med å søke kompensasjon for tapt inntekt som {rolle}</Element>
            Du må selv dekke de første 16 dagene av inntektstapet. Det vil si at hvis inntektstapet ditt startet{' '}
            {dagOgMnd} eller senere, dekker du selv hele {mnd}. Ordningen er lagt opp til at du må søke etterskuddsvis
            måned for måned. I dette tilfelle betyr det at du tidligst kan sende inn søknad i begynnelsen av {nesteMnd}.
        </>
    );
};

export const FellesStoppForSentInntektstapInnlogget = ({
    rolle,
    søknadsperiodeinfo: { førsteUgyldigeStartdatoForInntektstap },
}: {
    rolle: string;
    søknadsperiodeinfo: Søknadsperiodeinfo;
}) => {
    const dagOgMnd = formatDate(førsteUgyldigeStartdatoForInntektstap, 'dateAndMonth');
    const mnd = getMonthName(førsteUgyldigeStartdatoForInntektstap);
    return (
        <>
            <Element>Du må vente med å søke som {rolle}</Element>
            Du må selv dekke de første 16 dagene av inntektstapet. Det vil si at hvis inntektstapet ditt startet{' '}
            {dagOgMnd} eller senere, dekker du selv hele {mnd}. Ordningen er lagt opp til at du må søke etterskuddsvis
            måned for måned.
        </>
    );
};

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

export const FellesStopIngentUttaksdagerIPeriode = () => (
    <FormattedMessage id="fieldvalidation.ingenUttaksdagerIPeriode" />
);
