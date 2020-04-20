import { Locale } from 'common/types/Locale';
import { ApplicationApiData, SelvstendigNæringsdrivendeApiData, FrilanserApiData } from '../types/ApplicationApiData';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { formatDateToApiFormat, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { selvstendigSkalOppgiInntekt2019, selvstendigSkalOppgiInntekt2020 } from './selvstendigUtils';
import { ApplicationEssentials } from '../types/ApplicationEssentials';
import { formatDateRange } from '../components/date-range-view/DateRangeView';
import moment from 'moment';

const mapSelvstendigNæringsdrivendeFormDataToApiData = (
    { personligeForetak }: ApplicationEssentials,
    {
        søkerOmTaptInntektSomSelvstendigNæringsdrivende,
        selvstendigHarTaptInntektPgaKorona,
        selvstendigInntektstapStartetDato,
        selvstendigInntektIPerioden,
        selvstendigInntekt2019,
        selvstendigInntekt2020,
        selvstendigErFrilanser,
        selvstendigHarHattInntektSomFrilanserIPerioden,
        selvstendigInntektSomFrilanserIPerioden,
        selvstendigCalculatedDateRange,
    }: ApplicationFormData
): SelvstendigNæringsdrivendeApiData | undefined => {
    if (
        selvstendigCalculatedDateRange &&
        (søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES &&
            selvstendigHarTaptInntektPgaKorona === YesOrNo.YES,
        selvstendigInntektstapStartetDato && selvstendigInntektIPerioden !== undefined)
    ) {
        const harFrilanserInntekt =
            selvstendigErFrilanser === YesOrNo.YES && selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES;

        const lastDayWithNormalIncome = moment(selvstendigInntektstapStartetDato).subtract(1, 'day').toDate();

        return {
            inntektstapStartet: formatDateToApiFormat(selvstendigInntektstapStartetDato),
            inntektIPerioden: selvstendigInntektIPerioden,
            inntekt2019: selvstendigSkalOppgiInntekt2019(personligeForetak) ? selvstendigInntekt2019 : undefined,
            inntekt2020: selvstendigSkalOppgiInntekt2020(personligeForetak) ? selvstendigInntekt2020 : undefined,
            inntektIPeriodenSomFrilanser: harFrilanserInntekt ? selvstendigInntektSomFrilanserIPerioden : undefined,
            info: {
                period: formatDateRange(selvstendigCalculatedDateRange),
                lastDayWithNormalIncome: prettifyDateExtended(lastDayWithNormalIncome),
            },
        };
    }
    return undefined;
};

const formatYesOrNoAnswer = (answer: YesOrNo): string => {
    switch (answer) {
        case YesOrNo.YES:
            return 'Ja';
        case YesOrNo.NO:
            return 'Nei';
        case YesOrNo.DO_NOT_KNOW:
            return 'Vet ikke';
        default:
            return 'Ubesvart';
    }
};

export const mapFrilanserFormDataToApiData = ({
    frilanserHarTaptInntektPgaKorona,
    frilanserInntektIPerioden,
    frilanserInntektstapStartetDato,
    frilanserHarHattInntektSomSelvstendigIPerioden,
    frilanserInntektSomSelvstendigIPerioden,
    frilanserCalculatedDateRange,
}: ApplicationFormData): FrilanserApiData | undefined => {
    if (frilanserHarTaptInntektPgaKorona === YesOrNo.YES && frilanserCalculatedDateRange) {
        const lastDayWithNormalIncome = moment(frilanserInntektstapStartetDato).subtract(1, 'day').toDate();

        return {
            inntektstapStartet: formatDateToApiFormat(frilanserInntektstapStartetDato),
            inntektIPerioden: frilanserInntektIPerioden,
            inntektIPeriodenSomSelvstendigNæringsdrivende:
                frilanserHarHattInntektSomSelvstendigIPerioden === YesOrNo.YES
                    ? frilanserInntektSomSelvstendigIPerioden
                    : undefined,
            info: {
                period: formatDateRange(frilanserCalculatedDateRange),
                lastDayWithNormalIncome: prettifyDateExtended(lastDayWithNormalIncome),
            },
            questions: [
                {
                    question: 'Har du tapt inntekt som frilanser på grunn av koronatiltak i perioden?',
                    answer: formatYesOrNoAnswer(frilanserHarTaptInntektPgaKorona),
                },
            ],
        };
    }
    return undefined;
};

export const mapFormDataToApiData = (
    appEssentials: ApplicationEssentials,
    formData: ApplicationFormData,
    språk: Locale
): ApplicationApiData | undefined => {
    const { harBekreftetOpplysninger, harForståttRettigheterOgPlikter } = formData;

    const apiData: ApplicationApiData = {
        språk: (språk as any) === 'en' ? 'nn' : språk,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        selvstendigNæringsdrivende: mapSelvstendigNæringsdrivendeFormDataToApiData(appEssentials, formData),
        frilanser: mapFrilanserFormDataToApiData(formData),
    };

    return apiData;
};
