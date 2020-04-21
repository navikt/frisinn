import { formatDateRange } from '../../components/date-range-view/DateRangeView';
import { ApplicationFormField } from '../../types/ApplicationFormData';
import { DateRange } from '../../utils/dateUtils';

export interface FrilanserStepFormText {
    [ApplicationFormField.frilanserHarTaptInntektPgaKorona]: (søknadsperiode: DateRange) => string;
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
    frilanserInntektstapStartetDato: 'Når startet inntektstapet ditt som selvstendig næringsdrivende?',
    frilanserHarYtelseFraNavSomDekkerTapet: 'Har du ytelser fra NAV som dekker hele eller deler av inntektstapet?',
    frilanserYtelseFraNavDekkerHeleTapet: 'Dekker disse ytelsene hele inntektstapet?',
    frilanserInntektIPerioden: (dateRange: DateRange) =>
        `Hvilken inntekt hadde du i perioden ${formatDateRange(dateRange)}?`,
    frilanserHarHattInntektSomSelvstendigIPerioden: (dateRange: DateRange) =>
        `Har du hatt inntekt som selvstendig næringsdrivende i perioden ${formatDateRange(dateRange)}?`,
    frilanserInntektSomSelvstendigIPerioden: `Hva hadde du i inntekt som selvstendig næringsdrivende i denne perioden?`,
};
