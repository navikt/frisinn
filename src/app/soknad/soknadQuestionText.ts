import { SoknadFormField } from '../types/SoknadFormData';
import { DateRange } from '../utils/dateUtils';
import { formatDateRange } from '../components/date-range-view/DateRangeView';

export interface SoknadQuestionText {
    [SoknadFormField.selvstendigHarHattInntektFraForetak]: (årstall: number) => string;
    [SoknadFormField.selvstendigHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
    [SoknadFormField.selvstendigInntektstapStartetDato]: string;
    [SoknadFormField.selvstendigInntektIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet]: string;
    [SoknadFormField.selvstendigYtelseFraNavDekkerHeleTapet]: string;
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
    [SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet]: string;
    [SoknadFormField.frilanserInntektIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden]: string;
    [SoknadFormField.frilanserInntektSomSelvstendigIPerioden]: string;
}

export const soknadQuestionText: SoknadQuestionText = {
    selvstendigHarHattInntektFraForetak: (årstall: number) =>
        årstall === 2020
            ? `Har du hatt inntekt som selvstendig næringsdrivende før 1. mars ${årstall}?`
            : 'Har du hatt inntekt som selvstendig næringsdrivende i 2019',
    selvstendigHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt som selvstendig næringsdrivende i perioden ${formatDateRange(
            dateRange
        )}, som følge av koronautbruddet?`,
    selvstendigInntektstapStartetDato: 'Når startet inntektstapet ditt som selvstendig næringsdrivende?',
    selvstendigHarYtelseFraNavSomDekkerTapet:
        'Har du allerede en utbetaling fra NAV som dekker hele eller deler av inntektstapet ditt som selvstendig næringsdrivende?',
    selvstendigYtelseFraNavDekkerHeleTapet: 'Dekker utbetalingen du får fra NAV hele inntektstapet ditt?',
    selvstendigInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken inntekt har du tatt ut i perioden ${formatDateRange(dateRange)}?`,
    selvstendigInntekt2019: 'Hvilken inntekt har du tatt ut i 2019?',
    selvstendigInntekt2020: `Hvilken inntekt har du tatt ut før 1. mars 2020?`,
    selvstendigErFrilanser: 'Er du frilanser?',
    selvstendigHarHattInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Har du hatt inntekt som frilanser i perioden ${formatDateRange(dateRange)}`,
    selvstendigInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Hva hadde du i inntekt som frilanser i perioden ${formatDateRange(dateRange)}`,
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
        'Har du allerede en utbetaling fra NAV som dekker hele eller deler av inntektstapet ditt som frilanser?',
    frilanserYtelseFraNavDekkerHeleTapet: 'Dekker utbetalingen du får fra NAV hele inntektstapet ditt?',
    frilanserInntektIPerioden: (dateRange: DateRange) =>
        `Hvor mye hadde du i inntekt i perioden ${formatDateRange(dateRange)}?`,
    frilanserHarHattInntektSomSelvstendigIPerioden: `Har du tatt ut noe inntekt som selvstendig næringsdrivende i perioden du søker for?`,
    frilanserInntektSomSelvstendigIPerioden: 'Hvor mye hadde du i inntekt?',
};
