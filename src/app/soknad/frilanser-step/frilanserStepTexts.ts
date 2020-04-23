import { formatDateRange } from '../../components/date-range-view/DateRangeView';
import { SoknadFormField } from '../../types/SoknadFormData';
import { DateRange } from '../../utils/dateUtils';

export interface FrilanserStepFormText {
    [SoknadFormField.frilanserHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
    [SoknadFormField.frilanserErNyetablert]: string;
    [SoknadFormField.frilanserInntektstapStartetDato]: string;
    [SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet]: string;
    [SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet]: string;
    [SoknadFormField.frilanserInntektIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden]: (periode: DateRange) => string;
    [SoknadFormField.frilanserInntektSomSelvstendigIPerioden]: string;
}

export const frilanserStepTexts: FrilanserStepFormText = {
    frilanserHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt som frilanser på grunn av koronatiltak i perioden ${formatDateRange(dateRange)}?`,
    frilanserErNyetablert: 'Startet du som frilanser, og hadde inntekt første gang, etter 1. september 2019?',
    frilanserInntektstapStartetDato: 'Når startet inntektstapet ditt som frilanser?',
    frilanserHarYtelseFraNavSomDekkerTapet: 'Har du ytelser fra NAV som dekker hele eller deler av inntektstapet?',
    frilanserYtelseFraNavDekkerHeleTapet: 'Dekker disse ytelsene hele inntektstapet?',
    frilanserInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken inntekt hadde du i perioden ${formatDateRange(dateRange)}?`,
    frilanserHarHattInntektSomSelvstendigIPerioden: (dateRange: DateRange) =>
        `Har du hatt inntekt som selvstendig næringsdrivende i perioden ${formatDateRange(dateRange)}?`,
    frilanserInntektSomSelvstendigIPerioden: `Hva hadde du i inntekt som selvstendig næringsdrivende i denne perioden?`,
};
