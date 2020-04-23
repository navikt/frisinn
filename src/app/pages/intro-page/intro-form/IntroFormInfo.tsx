import React from 'react';
import DateRangeView from '../../../components/date-range-view/DateRangeView';
import { DateRange } from '../../../utils/dateUtils';
import { Element } from 'nav-frontend-typografi';

const ikkeGyldigAlder = ({ periode }: { periode: DateRange }) => (
    <>
        Du må ha vært mellom fra 18 og 67 år i perioden <DateRangeView dateRange={periode} />
    </>
);

const selvstendigIkkeTapPgaKorona = () => (
    <>
        <Element>Du kan ikke søke som selvstendig næringsdrivende</Element>
        Du må ha hatt inntektstap som selvstendig næringsdrivende på grunn av koronasituasjonen for å kunne søke om
        kompensasjon som selvstendig næringsdrivende.
    </>
);

const selvstendigForSentInntektstap = () => (
    <>
        <Element>Du kan ikke søke som selvstendig næringsdrivende</Element>
        Inntektstapet ditt startet for sent i perioden du kan søke for nå. Det er mindre enn 16 dager igjen av perioden,
        og de 16 første dagene etter inntektstapet kan du ikke søke kompensasjon for.
    </>
);

const selvstendigFårDekketTapet = () => (
    <>
        <Element>Du kan ikke søke som selvstendig næringsdrivende</Element>
        Dersom du allerede får dekket tapet, kan du ikke søke om kompensasjon som selvstendig næringsdrivende.
    </>
);

const frilanserIkkeTapPgaKorona = () => (
    <>
        <Element>Du kan ikke søke som frilanser</Element>
        Du må ha hatt inntektstap som frilanser på grunn av koronasituasjonen for å kunne søke om kompensasjon som
        frilanser.
    </>
);

const frilanserForSentInntektstap = () => (
    <>
        <Element>Du kan ikke søke som frilanser</Element>
        Inntektstapet ditt startet for sent i perioden du kan søke for nå. Det er mindre enn 16 dager igjen av perioden,
        og de 16 første dagene etter inntektstapet kan du ikke søke kompensasjon for.
    </>
);

const frilanserFårDekketTapet = () => (
    <>
        <Element>Du kan ikke søke som frilanser</Element>
        Dersom du allerede får dekket tapet, kan du ikke søke om kompensasjon som frilanser.
    </>
);

const IntroFormInfo = {
    ikkeGyldigAlder,
    selvstendigIkkeTapPgaKorona,
    selvstendigForSentInntektstap,
    selvstendigFårDekketTapet,
    frilanserIkkeTapPgaKorona,
    frilanserForSentInntektstap,
    frilanserFårDekketTapet,
};
export default IntroFormInfo;
