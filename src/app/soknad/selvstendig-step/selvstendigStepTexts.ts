import { formatDateRange } from '../../components/date-range-view/DateRangeView';
import { SoknadFormField } from '../../types/SoknadFormData';
import { DateRange } from '../../utils/dateUtils';

export interface SelvstendigStepFormText {
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
}

export const selvstendigStepTexts: SelvstendigStepFormText = {
    selvstendigHarHattInntektFraForetak: (årstall: number) =>
        `Har du hatt inntekt som selvstendig næringsdrivende i ${årstall}?`,
    selvstendigHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt (ikke tapt oppdrag) som selvstendig næringsdrivende som følge av koronautbruddet i perioden ${formatDateRange(
            dateRange
        )}?`,
    selvstendigInntektstapStartetDato: 'Når startet inntektstapet ditt som selvstendig næringsdrivende?',
    selvstendigHarYtelseFraNavSomDekkerTapet:
        'Har du allerede en utbetaling fra NAV som dekker hele eller deler av inntektstapet ditt som frilanser?',
    selvstendigYtelseFraNavDekkerHeleTapet: 'Dekker utbetalingen du får fra NAV hele inntektstapet ditt?',
    selvstendigInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken inntekt har du tatt ut i perioden ${formatDateRange(dateRange)}?`,
    selvstendigInntekt2019: 'Hvilken inntekt har du tatt ut i 2019?',
    selvstendigInntekt2020: `Hvilken inntekt har du tatt ut i 2020?`,
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
};
