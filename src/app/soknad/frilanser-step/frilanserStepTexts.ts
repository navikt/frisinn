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
    [SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden]: string;
    [SoknadFormField.frilanserInntektSomSelvstendigIPerioden]: string;
}

export const frilanserStepTexts: FrilanserStepFormText = {
    frilanserHarTaptInntektPgaKorona: (dateRange: DateRange) =>
        `Har du tapt inntekt (ikke tapt oppdrag) som frilanser som følge av koronautbruddet i perioden ${formatDateRange(
            dateRange
        )}?`,
    frilanserErNyetablert: 'Startet du som frilanser etter 1. september 2019?',
    frilanserInntektstapStartetDato: 'Når startet inntektstapet ditt som frilanser?',
    frilanserHarYtelseFraNavSomDekkerTapet:
        'Har du allerede en utbetaling fra NAV som dekker hele eller deler av inntektstapet ditt som frilanser?',
    frilanserYtelseFraNavDekkerHeleTapet: 'Dekker utbetalingen du får fra NAV hele inntektstapet ditt?',
    frilanserInntektIPerioden: (dateRange: DateRange) =>
        `Hvor mye hadde du i inntekt i perioden ${formatDateRange(dateRange)}?`,
    frilanserHarHattInntektSomSelvstendigIPerioden: `Har du tatt ut noe inntekt som selvstendig næringsdrivende i perioden du søker for?`,
    frilanserInntektSomSelvstendigIPerioden: 'Hvor mye hadde du i inntekt?',
};
