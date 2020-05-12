import { SoknadFormField } from '../types/SoknadFormData';
import { DateRange } from '../utils/dateUtils';
import { formatDateRange } from '../components/date-range-view/DateRangeView';

export interface SoknadQuestionText {
    [SoknadFormField.selvstendigHarHattInntektFraForetak]: (årstall: number) => string;
    [SoknadFormField.selvstendigHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
    [SoknadFormField.selvstendigInntektstapStartetDato]: string;
    [SoknadFormField.selvstendigInntektIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet]: string;
    [SoknadFormField.selvstendigHarAvvikletSelskaper]: string;
    [SoknadFormField.selvstendigAlleAvvikledeSelskaperErRegistrert]: string;
    [SoknadFormField.selvstendigAvvikledeSelskaper]: string;
    [SoknadFormField.selvstendigInntekt2019]: string;
    [SoknadFormField.selvstendigInntekt2020]: string;
    [SoknadFormField.selvstendigErFrilanser]: string;
    [SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.selvstendigInntektSomFrilanserIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.selvstendigHarRegnskapsfører]: string;
    [SoknadFormField.selvstendigRegnskapsførerNavn]: string;
    [SoknadFormField.selvstendigRegnskapsførerTelefon]: string;
    [SoknadFormField.selvstendigHarRevisor]: string;
    [SoknadFormField.selvstendigRevisorNavn]: string;
    [SoknadFormField.selvstendigRevisorTelefon]: string;
    [SoknadFormField.selvstendigRevisorNAVKanTaKontakt]: string;
    [SoknadFormField.frilanserHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
    [SoknadFormField.frilanserErNyetablert]: string;
    [SoknadFormField.frilanserInntektstapStartetDato]: string;
    [SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet]: string;
    [SoknadFormField.frilanserInntektIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.frilanserInntektSomSelvstendigIPerioden]: (periode: DateRange) => string;
}

export const soknadQuestionText: SoknadQuestionText = {
    selvstendigHarHattInntektFraForetak: (årstall: number) =>
        årstall === 2020
            ? `Har du hatt inntekt som selvstendig næringsdrivende før 1. mars ${årstall}?`
            : 'Har du hatt inntekt som selvstendig næringsdrivende i 2019?',
    selvstendigHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt som selvstendig næringsdrivende i perioden ${formatDateRange(
            dateRange
        )}, som følge av koronautbruddet?`,
    selvstendigInntektstapStartetDato: 'Når startet inntektstapet ditt som selvstendig næringsdrivende?',
    selvstendigHarYtelseFraNavSomDekkerTapet:
        'Har du allerede en utbetaling fra NAV som kompenserer det samme inntektstapet som selvstendig næringsdrivende?',
    selvstendigInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken personinntekt har du hatt fra næring, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som selvstendig næringsdrivende i perioden ${formatDateRange(
            dateRange
        )}?`,
    selvstendigHarAvvikletSelskaper: 'Har du hatt selskaper (ENK, DA/ANS), som ble avviklet i perioden 2019-2020?',
    selvstendigAvvikledeSelskaper: 'Legg til de selskapene som var aktive i perioden 2019-2020',
    selvstendigAlleAvvikledeSelskaperErRegistrert: 'Er alle avviklede selskaper i perioden 2019-2020 lagt til?',
    selvstendigInntekt2019: 'Hvilken personinntekt fra næring har du totalt tatt ut i 2019?',
    selvstendigInntekt2020: `Hvilken personinntekt fra næring har du totalt tatt ut i januar og februar 2020?`,
    selvstendigErFrilanser: 'Er du frilanser?',
    selvstendigHarHattInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Har du hatt inntekt som frilanser i perioden ${formatDateRange(dateRange)}`,
    selvstendigInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Hvilken personinntekt har du hatt fra oppdrag som frilanser, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som frilanser i perioden ${formatDateRange(
            dateRange
        )}?`,
    selvstendigHarRegnskapsfører: 'Har du regnskapsfører?',
    selvstendigRegnskapsførerNavn: 'Navn på regnskapsfører',
    selvstendigRegnskapsførerTelefon: 'Telefonnummer til regnskapsfører',
    selvstendigHarRevisor: 'Har du revisor?',
    selvstendigRevisorNavn: 'Navn på revisor',
    selvstendigRevisorTelefon: 'Telefonnummer til revisor',
    selvstendigRevisorNAVKanTaKontakt: 'Gir du NAV fullmakt til å innhente opplysninger fra revisor?',
    frilanserHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt som frilanser i perioden ${formatDateRange(dateRange)}, som følge av koronautbruddet?`,
    frilanserErNyetablert: 'Startet du å jobbe som frilanser etter 1. mars 2019?',
    frilanserInntektstapStartetDato: 'Når startet inntektstapet ditt som frilanser?',
    frilanserHarYtelseFraNavSomDekkerTapet:
        'Har du allerede en utbetaling fra NAV som kompenserer det samme inntektstapet som frilanser?',
    frilanserInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken personinntekt har du hatt fra oppdrag som frilanser, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som frilanser i perioden ${formatDateRange(
            dateRange
        )}?`,
    frilanserHarHattInntektSomSelvstendigIPerioden: (dateRange: DateRange) =>
        `Har du hatt noen personinntekt fra næring, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som selvstendig næringsdrivende i perioden ${formatDateRange(
            dateRange
        )}?`,
    frilanserInntektSomSelvstendigIPerioden: (dateRange: DateRange) =>
        `Hvilken personinntekt har du hatt fra næring, eller utbetaling fra NAV (for eksempel sykepenger, omsorgspenger) som selvstendig næringsdrivende i perioden ${formatDateRange(
            dateRange
        )}`,
};
