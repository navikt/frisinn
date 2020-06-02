import React from 'react';
import moment from 'moment';
import Lenke from 'nav-frontend-lenker';
import { Element } from 'nav-frontend-typografi';
import DateRangeView from '../../../components/date-range-view/DateRangeView';
import DateView, { formatDate } from '../../../components/date-view/DateView';
import ExpandableInfo from '../../../components/expandable-content/ExpandableInfo';
import { FellesStoppSentInntektstap } from '../../../soknad/info/FellesInfo';
import { DateRange, getMonthName } from '../../../utils/dateUtils';
import { Søknadsperiodeinfo } from '../../../types/SoknadEssentials';

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

const selvstendigForSentInntektstap = ({ søknadsperiodeinfo }: { søknadsperiodeinfo: Søknadsperiodeinfo }) => (
    <FellesStoppSentInntektstap rolle="selvstendig næringsdrivende" søknadsperiodeinfo={søknadsperiodeinfo} />
);

const selvstendigFårDekketTapet = () => (
    <>
        <Element>Du kan ikke søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende</Element>
        Når du allerede har dekket tapt inntekt som selvstendig næringsdrivende, kan du ikke søke kompensasjon for den
        samme inntekten som er dekket.
    </>
);

const selvstendigKanSøke = () => (
    <>
        Du kan søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende.
        <p>
            <strong>Du kommer videre til søknadsskjemaet etter at du har svart på de resterende spørsmålene.</strong>
        </p>
    </>
);

const frilanserIkkeTapPgaKorona = () => (
    <>
        <Element>Du kan ikke søke om kompensasjon for tapt inntekt som frilanser</Element>
        For å søke om kompensasjon for tapt inntekt som frilanser, må du helt eller delvis ha tapt inntekt som følge av
        koronautbruddet.
    </>
);

const frilanserForSentInntektstap = ({ søknadsperiodeinfo }: { søknadsperiodeinfo: Søknadsperiodeinfo }) => (
    <FellesStoppSentInntektstap rolle="frilanser" søknadsperiodeinfo={søknadsperiodeinfo} />
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

const selvstendigIkkeTattUtInntekt = () => (
    <>
        <Element>Du kan ikke søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende</Element>
        For å kunne søke om kompensasjon for tapt inntekt, må du ha tatt ut inntekt fra selskapet ditt. Hvis selskapet
        er registrert i 2019 eller tidligere, må du ha tatt ut inntekt i 2019.
        <br /> Hvis selskapet er registrert i 2020, må du ha tatt ut inntekt før 1. mars 2020.
    </>
);

const hvaRegnesSomInntektstap = () => (
    <ExpandableInfo title="Hva regnes som inntektstap?">
        Inntekt som du normalt ville tatt ut, men som du ikke har kunnet som følge av koronautbruddet.
    </ExpandableInfo>
);

const infoSelvstendigTrekkeAnnenSøknad = () => (
    <ExpandableInfo title="Hva betyr dette?">
        Eksempel:
        <br />
        Du har søkt om omsorgspenger, men nå vil du heller søke om kompensasjon for tapt inntekt i denne ordningen. Da
        må du trekke søknaden om omsorgspenger. Dtte gjør du ved å{' '}
        <Lenke href="https://www.nav.no/person/kontakt-oss/nb/skriv-til-oss">sende en beskjed til oss</Lenke>.
    </ExpandableInfo>
);

const infoFrilanserTrekkeAnnenSøknad = () => (
    <ExpandableInfo title="Hva betyr dette?">
        Eksempel:
        <br />
        Du har søkt om dagpenger, men nå vil du heller søke om kompensasjon for tapt inntekt i denne ordningen. Da må du
        trekke søknaden om dagpenger. Dtte gjør du ved å{' '}
        <Lenke href="https://www.nav.no/person/kontakt-oss/nb/skriv-til-oss">sende en beskjed til oss</Lenke>.
    </ExpandableInfo>
);

const selvstendigHvaMenesMedInntekt = () => (
    <ExpandableInfo title="Hva menes med dette?">
        For å kunne søke kompensasjon for tapt inntekt, må du ha hatt personinntekt fra næringen din. Hvis selskapet er
        registrert i 2019 eller tidligere, må du ha hatt personinntekt fra næringen i 2019. Hvis selskapet er registrert
        i 2020, må du ha hatt personinntekt fra næringen før 1. mars 2020.
    </ExpandableInfo>
);

const hvaErStartdatoForInntektstap = ({
    søknadsperiodeinfo: { førsteUgyldigeStartdatoForInntektstap, søknadsperiode },
}: {
    søknadsperiodeinfo: Søknadsperiodeinfo;
}) => {
    const dag = formatDate(førsteUgyldigeStartdatoForInntektstap, 'dateAndMonth');
    const mnd = getMonthName(førsteUgyldigeStartdatoForInntektstap);
    const nesteMnd = moment(søknadsperiode.to).add(2, 'month').toDate();
    return (
        <ExpandableInfo title="Du må selv dekke de 16 første dagene av inntektstapet">
            Du må selv dekke de første 16 dagene av inntektstapet. Det vil si at hvis inntektstapet ditt startet {dag}{' '}
            eller senere, dekker du selv hele {mnd}. Ordningen er lagt opp til at du må søke etterskuddsvis måned for
            måned. I dette tilfellet betyr det at du tidligst kan sende inn søknad i begynnelsen av{' '}
            <DateView date={nesteMnd} format="monthAndYear" />.
        </ExpandableInfo>
    );
};

const ikkeValgtSelvstendigEllerFrilanser = () => (
    <>
        Du opplyser at du ikke er frilanser, og ikke selvstendig næringsdrivende. Det betyr at du ikke kan ha rett på
        kompensasjon etter denne ordningen.
    </>
);

const selvstendigIkkeOkOgErIkkeFrilanser = () => (
    <>
        Du kan ikke søke som selvstendig næringsdrivende og du oppgir at du ikke er frilanser. Da kan du ikke bruke
        denne søknaden nå.
    </>
);

const harAlleredeSøkt = () => (
    <>
        Når du har søkt om andre utbetalinger fra NAV for det samme inntektstapet, kan du velge å
        <ul>
            <li>ikke gå videre med denne søknaden, eller</li>
            <li>trekke den andre søknaden du har hos NAV, og gå videre til å søke om denne kompensasjonen</li>
        </ul>
        Du kan kun få dekket det samme inntektstapet én gang.
    </>
);

const fårDekketTapetAllerede = (
    rolle: string
) => `Har du allerede en utbetaling fra NAV som kompenserer det samme inntektstapet som ${rolle},
kan du ikke søke. Hvis du har en utbetaling fra NAV som bare delvis dekker inntektstapet ditt, kan du søke om
kompensasjon for den delen du ikke får dekket.`;

const fårDekketTapetSomSelvstendigForklaring = () => (
    <ExpandableInfo title="Hva vil dette si?">{fårDekketTapetAllerede('selvstendig næringsdrivende')}</ExpandableInfo>
);

const fårDekketTapetSomFrilanserForklaring = () => (
    <ExpandableInfo title="Hva vil dette si?">{fårDekketTapetAllerede('frilanser')}</ExpandableInfo>
);

const vilIkkeTrekkeAnnenSøknadSelvstendig = () => (
    <>
        Du må trekke den andre søknaden du har sendt inn for å kunne søke kompensasjon for tapt inntekt som selvstendig
        næringsdrivende. Hvis du også er frilanser, kan du svare på spørsmålene under for å se om du kan søke
        kompensasjon som frilanser.
    </>
);
const vilIkkeTrekkeAnnenSøknadFrilanser = () => (
    <>Du må trekke den andre søknaden du har sendt inn for å kunne søke kompensasjon for tapt inntekt som frilanser.</>
);

const frilanserKanSøke = () => <>Du kan søke om kompensasjon for tapt inntekt som frilanser.</>;

const infoHarDuSøktTidligere = () => (
    <ExpandableInfo title="Hva betyr dette?">
        Du kan svare ja hvis du har søkt, og
        <ul className="infoList">
            <li>fått innvilget kompensasjon</li>
            <li>ikke fått svar enda</li>
            <li>fått avslag på søknaden </li>
        </ul>
    </ExpandableInfo>
);
const IntroFormInfo = {
    ikkeGyldigAlder,
    selvstendigIkkeTattUtInntekt,
    selvstendigIkkeTapPgaKorona,
    selvstendigForSentInntektstap,
    selvstendigHvaMenesMedInntekt,
    selvstendigFårDekketTapet,
    selvstendigKanSøke,
    frilanserIkkeTapPgaKorona,
    frilanserForSentInntektstap,
    frilanserFårDekketTapet,
    frilanserKanSøke,
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
    infoSelvstendigTrekkeAnnenSøknad: infoSelvstendigTrekkeAnnenSøknad,
    infoFrilanserTrekkeAnnenSøknad: infoFrilanserTrekkeAnnenSøknad,
    infoHarDuSøktTidligere,
};
export default IntroFormInfo;
