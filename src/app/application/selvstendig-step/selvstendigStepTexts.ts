import { formatDateRange } from '../../components/date-range-view/DateRangeView';
import { ApplicationFormField } from '../../types/ApplicationFormData';
import { DateRange, prettifyDateExtended } from '../../utils/dateUtils';

export interface SelvstendigStepFormText {
    [ApplicationFormField.selvstendigHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
    [ApplicationFormField.selvstendigInntektstapStartetDato]: string;
    [ApplicationFormField.selvstendigInntektIPerioden]: (periode: DateRange) => string;
    [ApplicationFormField.selvstendigInntekt2019]: string;
    [ApplicationFormField.selvstendigInntekt2020]: (sisteDageMedInntekt: Date) => string;
    [ApplicationFormField.selvstendigErFrilanser]: string;
    [ApplicationFormField.selvstendigHarHattInntektSomFrilanserIPerioden]: (periode: DateRange) => string;
    [ApplicationFormField.selvstendigInntektSomFrilanserIPerioden]: (periode: DateRange) => string;
}

export const selvstendigStepTexts: SelvstendigStepFormText = {
    selvstendigHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt som selvstendig næringsdrivende på grunn av koronatiltak i perioden ${formatDateRange(
            dateRange
        )}?`,
    selvstendigInntektstapStartetDato: 'Når startet inntektstapet ditt som selvstendig næringsdrivende?',
    selvstendigInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken inntekt hadde du i perioden  ${formatDateRange(dateRange)}?`,
    selvstendigInntekt2019: 'Hvilken inntekt haddde du fra dine foretak i 2019?',
    selvstendigInntekt2020: (date: Date) =>
        `Hvilken inntekt hadde du fra dine foretak i 2020 til og med ${prettifyDateExtended(date)}?`,
    selvstendigErFrilanser: 'Er du frilanser?',
    selvstendigHarHattInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Har du hatt inntekt som frilanser i perioden ${formatDateRange(dateRange)}`,
    selvstendigInntektSomFrilanserIPerioden: (dateRange: DateRange) =>
        `Hva hadde du i inntekt som frilanser i perioden ${formatDateRange(dateRange)}`,
};
