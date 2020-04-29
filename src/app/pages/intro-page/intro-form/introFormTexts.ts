import { IntroFormField } from './introFormConfig';
import { formatDate } from '../../../components/date-view/DateView';

export interface IntroFormTexts {
    [IntroFormField.fødselsdato]: string;
    [IntroFormField.erSelvstendigNæringsdrivende]: string;
    [IntroFormField.selvstendigHarTattUtInntektFraSelskap]: string;
    [IntroFormField.selvstendigHarTaptInntektPgaKorona]: string;
    [IntroFormField.selvstendigInntektstapStartetFørFrist]: (sisteGyldigeDagForInntektstap: Date) => string;
    [IntroFormField.selvstendigFårDekketTapet]: string;
    [IntroFormField.selvstendigHarAlleredeSøkt]: string;
    [IntroFormField.selvstendigVilFortsetteTilSøknad]: string;
    [IntroFormField.erFrilanser]: string;
    [IntroFormField.frilanserHarTaptInntektPgaKorona]: string;
    [IntroFormField.frilanserInntektstapStartetFørFrist]: (sisteGyldigeDagForInntektstap: Date) => string;
    [IntroFormField.frilanserFårDekketTapet]: string;
    [IntroFormField.frilansHarAlleredeSøkt]: string;
    [IntroFormField.frilansVilFortsetteTilSøknad]: string;
}

export const introFormText: IntroFormTexts = {
    fødselsdato: 'Når er du født?',
    erSelvstendigNæringsdrivende: 'Er du registrert som selvstendig næringsdrivende før 1. mars 2020?',
    selvstendigHarTattUtInntektFraSelskap: `Har du tatt ut inntekt fra selskapet/selskapene i 2019 og 2020?`,
    selvstendigHarTaptInntektPgaKorona:
        'Har du tapt inntekt som selvstendig næringsdrivende som følge av koronautbruddet? ',
    selvstendigInntektstapStartetFørFrist: (sisteGyldigeDagForInntektstap: Date) =>
        `Startet inntektstapet ditt som selvstendig næringsdrivende før ${formatDate(sisteGyldigeDagForInntektstap)}?`,
    selvstendigFårDekketTapet:
        'Har du allerede en utbetaling fra NAV som dekker hele inntektstapet ditt som selvstendig næringsdrivende?',
    selvstendigHarAlleredeSøkt:
        'Har du søkt om andre utbetalinger fra NAV som skal dekke det samme inntektstapet du ønsker å søke kompensasjon for som selvstendig næringsdrivende i denne søknaden?',
    selvstendigVilFortsetteTilSøknad:
        'Vil du trekke den andre søknaden du har hos NAV og gå videre med denne søknaden?',
    erFrilanser: 'Er du frilanser?',
    frilanserHarTaptInntektPgaKorona: 'Har du tapt inntekt som frilanser som følge av koronautbruddet?',
    frilanserInntektstapStartetFørFrist: (sisteGyldigeDagForInntektstap: Date) =>
        `Startet inntektstapet ditt som frilanser før ${formatDate(sisteGyldigeDagForInntektstap)}?`,
    frilanserFårDekketTapet: 'Har du allerede en utbetaling fra NAV som dekker inntektstapet ditt som frilanser?',
    frilansHarAlleredeSøkt:
        'Har du søkt om andre utbetalinger fra NAV som skal dekke det samme inntektstapet du ønsker å søke kompensasjon som frilanser for i denne søknaden?',
    frilansVilFortsetteTilSøknad: 'Vil du trekke den andre søknaden du har hos NAV og gå videre med denne søknaden?',
};
