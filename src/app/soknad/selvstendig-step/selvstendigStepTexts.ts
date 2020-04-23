import { formatDateRange } from '../../components/date-range-view/DateRangeView';
import { SoknadFormField } from '../../types/SoknadFormData';
import { DateRange } from '../../utils/dateUtils';

export interface SelvstendigStepFormText {
    [SoknadFormField.selvstendigHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
    [SoknadFormField.selvstendigInntektstapStartetDato]: string;
    [SoknadFormField.selvstendigInntektIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet]: string;
    [SoknadFormField.selvstendigYtelseFraNavDekkerHeleTapet]: string;
    [SoknadFormField.selvstendigInntekt2019]: string;
    [SoknadFormField.selvstendigInntekt2020]: (sisteDageMedInntekt: Date) => string;
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
    selvstendigHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt som selvstendig næringsdrivende på grunn av koronatiltak i perioden ${formatDateRange(
            dateRange
        )}?`,
    selvstendigInntektstapStartetDato: 'Når startet inntektstapet ditt som selvstendig næringsdrivende?',
    selvstendigHarYtelseFraNavSomDekkerTapet: 'Har du ytelser fra NAV som dekker hele eller deler av inntektstapet?',
    selvstendigYtelseFraNavDekkerHeleTapet: 'Dekker disse ytelsene hele inntektstapet?',
    selvstendigInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken inntekt hadde du i perioden  ${formatDateRange(dateRange)}?`,
    selvstendigInntekt2019: 'Hvilken inntekt haddde du fra dine foretak i 2019?',
    selvstendigInntekt2020: () => `Hvilken inntekt hadde du fra dine foretak i 2020 frem til 1. mars 2020?`,
    selvstendigErFrilanser: 'Er du frilanser?',
    selvstendigHarHattInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Har du hatt inntekt som frilanser i perioden ${formatDateRange(dateRange)}`,
    selvstendigInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Hva hadde du i inntekt som frilanser i perioden ${formatDateRange(dateRange)}`,
    selvstendigHarRegnskapsfører: 'Har du regnskapsfører?',
    selvstendigRegnskapsførerNavn: 'Oppgi navn på regnskapsfører',
    selvstendigRegnskapsførerTelefon: 'Oppgi telefonnummeret til regnskapsfører',
    selvstendigHarRevisor: 'Har du revisor?',
    selvstendigRevisorNavn: 'Oppgi navn på revisor',
    selvstendigRevisorTelefon: 'Oppgi telefonnummeret til revisor',
    selvstendigRevisorNAVKanTaKontakt: 'Gir du NAV fullmakt til å innhente opplysninger direkte fra revisor?',
};
