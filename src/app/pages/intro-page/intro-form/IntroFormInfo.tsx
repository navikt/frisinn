import React from 'react';
import DateRangeView from '../../../components/date-range-view/DateRangeView';
import { DateRange } from '../../../utils/dateUtils';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '../../../components/expandable-content/ExpandableInfo';
import Lenke from 'nav-frontend-lenker';

const ikkeGyldigAlder = ({ periode }: { periode: DateRange }) => (
    <>
        <Element>Du kan ikke søke om kompensasjon for tapt inntekt</Element>
        For å søke må du ha vært mellom fra 18 og 67 år i perioden <DateRangeView dateRange={periode} />
    </>
);

const selvstendigIkkeTapPgaKorona = () => (
    <>
        <Element>Du kan ikke søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende</Element>
        For å søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, må du helt eller delvis ha tapt
        inntekt som følge av koronautbruddet.
    </>
);

const selvstendigForSentInntektstap = () => (
    <>
        <Element>Du må vente med å søke kompensasjon for tapt inntekt som selvstendig næringsdrivende </Element>
        Du må selv dekke de første 16 dagene med inntektstap. Ordningen er lagt opp til at du må søke etterskuddsvis
        måned for måned. Hvis du har inntektstap i mai 2020 kan du først sende søknad i begynnelsen av juni.
    </>
);

const selvstendigFårDekketTapet = () => (
    <>
        <Element>Du kan ikke søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende</Element>
        Når du allerede har dekket tapt inntekt som selvstendig næringsdrivende, kan du ikke søke kompensasjon for den
        samme inntekten som er dekket.
    </>
);

const frilanserIkkeTapPgaKorona = () => (
    <>
        <Element>Du kan ikke søke om kompensasjon for tapt inntekt som frilanser</Element>
        For å søke om kompensasjon for tapt inntekt som frilanser, må du helt eller delvis ha tapt inntekt som følge av
        koronautbruddet.
    </>
);

const frilanserForSentInntektstap = () => (
    <>
        <Element>Du må vente med å søke kompensasjon for tapt inntekt som frilanser</Element>
        Du må selv dekke de første 16 dagene med inntektstap. Ordningen er lagt opp til at du må søke etterskuddsvis
        måned for måned. Hvis du har inntektstap i mai 2020 kan du først sende søknad i begynnelsen av juni.
    </>
);

const frilanserFårDekketTapet = () => (
    <>
        <Element>Du kan ikke søke om kompensasjon for tapt inntekt som frilanser</Element>
        Når du allerede har dekket tapt inntekt som frilanser, kan du ikke søke kompensasjon for den samme inntekten som
        er dekket.
    </>
);

const frilanserNAVsDefinisjon = () => (
    <ExpandableInfo title="Hva er en frilanser?">
        Du er frilanser når du mottar lønn for enkeltstående oppdrag uten å være fast eller midlertidig ansatt hos den
        du utfører oppdraget for. Du må sjekke om oppdragene dine er registrert som frilansoppdrag, på{' '}
        <Lenke href="https://www.skatteetaten.no/skjema/mine-inntekter-og-arbeidsforhold/" target="_blank">
            skatteetaten sine nettsider
        </Lenke>{' '}
        (åpnes i nytt vindu).
    </ExpandableInfo>
);

const ikkeFrilanserOgIkkeRettSomSelvstendig = () => (
    <>
        Du opplyser at du ikke er frilanser, du kan heller ikke søke om kompensasjon for tapt inntekt som selvstendig
        næringsdrivende. Det betyr at du ikke kan ha rett på kompensasjon etter denne ordningen.{' '}
    </>
);

const selvstendigIkkeTattUtLønn = () => (
    <>
        <Element>Du kan ikke søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende</Element>
        For å kunne søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende, må du ha tatt ut inntekt fra
        selskapet. Hvis selskapet er registrert i 2019 eller tidligere, må du ha tatt ut inntekt i 2019. Hvis selskapet
        ditt er registrert i 2020, må du ha tatt ut inntekt i 2020.
    </>
);

const hvaRegnesSomInntektstap = () => (
    <ExpandableInfo title="Hva regnes som inntektstap?">
        Inntekt som du normalt ville tatt ut, men som du ikke har kunnet som følge av koronautbruddet.
    </ExpandableInfo>
);
const selvstendigHvaMenesMedInntekt = () => (
    <ExpandableInfo title="Hva menes med dette?">
        For å kunne søke om kompensasjon for tapt inntekt, må du ha tatt ut inntekt fra selskapet ditt. Hvis selskapet
        er registrert i 2019 eller tidligere, må du ha tatt ut inntekt i 2019. Hvis selskapet er registrert i 2020, må
        du ha tatt ut inntekt i løpet av 2020.
    </ExpandableInfo>
);

const hvaErStartdatoForInntektstap = () => (
    <ExpandableInfo title="Fra hvilken dato gjelder inntektstap som følge av koronautbruddet?">
        Inntektstap som følge av koronautbruddet har virkning fra 16. mars 2020. Du må selv finne datoen for når ditt
        inntektstap startet (ikke når du mistet oppdrag).
    </ExpandableInfo>
);

const ikkeValgtSelvstendigEllerFrilanser = () => (
    <>
        Du opplyser at du ikke er frilanser, og ikke selvstendig næringsdrivende. Det betyr at du ikke kan ha rett på
        kompensasjon etter denne ordningen.
    </>
);

const selvstendigIkkeOkOgErIkkeFrilanser = () => (
    <>
        Du kan ikke søke som selvstendig næringsdrivende og du oppgir du ikke er frilanser. Da kan du ikke bruke denne
        søknaden nå.
    </>
);

const harAlleredeSøkt = () => (
    <>
        Når du har søkt om andre utbetalinger fra NAV for det samme inntektstapet, kan du velge å
        <ul>
            <li>ikke gå videre med denne søknaden, eller å </li>
            <li>trekke den andre søknaden du har hos NAV, og gå videre til å søke om denne kompensasjonen</li>
        </ul>
        Du kan kun få dekket det samme inntektstapet én gang.
    </>
);

const fårDekketTapetSomSelvstendigForklaring = () => (
    <ExpandableInfo title="Hva vil dette si?">
        Hvis du har en utbetaling fra NAV som dekker hele inntektstapet ditt som selvstendig næringsdrivende, kan du
        ikke søke om kompensasjon. Utbetalingene fra NAV kan være én av disse:
        <ul className="infoList">
            <li>Omsorgspenger</li>
            <li>Sykepenger</li>
            <li>Foreldrepenger</li>
            <li>Svangerskapspenger</li>
            <li>Pleiepenger</li>
            <li>Opplæringspenger</li>
            <li>Arbeidsavklaringspenger</li>
        </ul>
        <p>
            Hvis du har én av disse utbetalingene, men bare delvis, kan du søke. Du kan også søke selv om du mottar
            sosial stønad, alderspensjon før fylte 67 år eller uføretrygd fra NAV.
        </p>
    </ExpandableInfo>
);

const fårDekketTapetSomFrilanserForklaring = () => (
    <ExpandableInfo title="Hva vil dette si?">
        Hvis du har en utbetaling fra NAV som dekker hele inntektstapet ditt som frilanser, kan du ikke søke om
        kompensasjon. Utbetalingene fra NAV kan være én av disse:
        <ul className="infoList">
            <li>Dagpenger</li>
            <li>Omsorgspenger</li>
            <li>Sykepenger</li>
            <li>Foreldrepenger</li>
            <li>Svangerskapspenger</li>
            <li>Pleiepenger</li>
            <li>Opplæringspenger</li>
            <li>Arbeidsavklaringspenger</li>
        </ul>
        <p>
            Hvis du har én av disse utbetalingene, men bare delvis, kan du søke. Du kan også søke selv om du mottar
            sosial stønad, alderspensjon før fylte 67 år eller uføretrygd fra NAV.
        </p>
    </ExpandableInfo>
);

const vilIkkeTrekkeAnnenSøknadSelvstendig = () => (
    <>
        Dersom du ikke trekker denne andre søknaden, kan du ikke søke kompensasjon som selvstendig næringsdrivende. Du
        kan fortsatt svare på spørsmålene nedenfor for å se om du kan søke som frilanser.
    </>
);
const vilIkkeTrekkeAnnenSøknadFrilanser = () => (
    <>Dersom du ikke trekker denne andre søknaden, kan du ikke søke kompensasjon som frilanser.</>
);

const IntroFormInfo = {
    ikkeGyldigAlder,
    selvstendigIkkeTattUtLønn,
    selvstendigIkkeTapPgaKorona,
    selvstendigForSentInntektstap,
    selvstendigHvaMenesMedInntekt,
    selvstendigFårDekketTapet,
    frilanserIkkeTapPgaKorona,
    frilanserForSentInntektstap,
    frilanserFårDekketTapet,
    hvaRegnesSomInntektstap,
    hvaErStartdatoForInntektstap,
    frilanserNAVsDefinisjon,
    ikkeValgtSelvstendigEllerFrilanser,
    selvstendigIkkeOkOgErIkkeFrilanser,
    harAlleredeSøkt,
    fårDekketTapetSomSelvstendigForklaring,
    fårDekketTapetSomFrilanserForklaring,
    ikkeFrilanserOgIkkeRettSomSelvstendig,
    vilIkkeTrekkeAnnenSøknadSelvstendig,
    vilIkkeTrekkeAnnenSøknadFrilanser,
};
export default IntroFormInfo;
