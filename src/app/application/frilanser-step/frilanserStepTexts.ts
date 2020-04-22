import { formatDateRange } from '../../components/date-range-view/DateRangeView';
import { ApplicationFormField } from '../../types/ApplicationFormData';
import { DateRange } from '../../utils/dateUtils';

export interface FrilanserStepFormText {
    [ApplicationFormField.frilanserHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
    [ApplicationFormField.frilanserErNyetablert]: string;
    [ApplicationFormField.frilanserInntektstapStartetDato]: string;
    [ApplicationFormField.frilanserHarYtelseFraNavSomDekkerTapet]: string;
    [ApplicationFormField.frilanserYtelseFraNavDekkerHeleTapet]: string;
    [ApplicationFormField.frilanserInntektIPerioden]: (periode: DateRange) => string;
    [ApplicationFormField.frilanserHarHattInntektSomSelvstendigIPerioden]: (periode: DateRange) => string;
    [ApplicationFormField.frilanserInntektSomSelvstendigIPerioden]: string;
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
