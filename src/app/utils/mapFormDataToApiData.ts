import { formatDateToApiFormat, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import { Locale } from 'common/types/Locale';
import { formatDateRange } from '../components/date-range-view/DateRangeView';
import {
    ApplicationApiData,
    FrilanserApiData,
    SelvstendigNæringsdrivendeApiData,
    ApiQuestion,
} from '../types/ApplicationApiData';
import { ApplicationEssentials } from '../types/ApplicationEssentials';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { selvstendigSkalOppgiInntekt2019, selvstendigSkalOppgiInntekt2020 } from './selvstendigUtils';
import { selvstendigStepTexts } from '../application/selvstendig-step/selvstendigStepTexts';
import { frilanserStepTexts } from '../application/frilanser-step/frilanserStepTexts';

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

const mapSelvstendigNæringsdrivendeFormDataToApiData = (
    { personligeForetak }: ApplicationEssentials,
    {
        søkerOmTaptInntektSomSelvstendigNæringsdrivende,
        selvstendigHarTaptInntektPgaKorona,
        selvstendigInntektstapStartetDato,
        selvstendigHarYtelseFraNavSomDekkerTapet,
        selvstendigYtelseFraNavDekkerHeleTapet,
        selvstendigInntektIPerioden,
        selvstendigInntekt2019,
        selvstendigInntekt2020,
        selvstendigErFrilanser,
        selvstendigHarHattInntektSomFrilanserIPerioden,
        selvstendigInntektSomFrilanserIPerioden,
        selvstendigCalculatedDateRange,
        selvstendigHarRegnskapsfører,
        selvstendigRegnskapsførerNavn,
        selvstendigRegnskapsførerTelefon,
        selvstendigHarRevisor,
        selvstendigRevisorNavn,
        selvstendigRevisorTelefon,
        selvstendigRevisorNAVKanTaKontakt,
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

        // const lastDayWithNormalIncome = moment(selvstendigInntektstapStartetDato).subtract(1, 'day').toDate();

        const questions: ApiQuestion[] = [
            {
                question: selvstendigStepTexts.selvstendigHarYtelseFraNavSomDekkerTapet,
                answer: formatYesOrNoAnswer(selvstendigHarYtelseFraNavSomDekkerTapet),
            },
        ];
        if (selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES) {
            questions.push({
                question: selvstendigStepTexts.selvstendigYtelseFraNavDekkerHeleTapet,
                answer: formatYesOrNoAnswer(selvstendigYtelseFraNavDekkerHeleTapet),
            });
        }
        if (selvstendigHarRegnskapsfører === YesOrNo.NO && selvstendigHarRevisor === YesOrNo.YES) {
            questions.push({
                question: selvstendigStepTexts.selvstendigHarRevisor,
                answer: formatYesOrNoAnswer(selvstendigHarRevisor),
            });
            if (selvstendigRevisorNavn) {
                questions.push({
                    question: selvstendigStepTexts.selvstendigRevisorNavn,
                    answer: selvstendigRevisorNavn,
                });
            }
            if (selvstendigRevisorTelefon) {
                questions.push({
                    question: selvstendigStepTexts.selvstendigRevisorTelefon,
                    answer: selvstendigRevisorTelefon,
                });
            }
            if (selvstendigRevisorNAVKanTaKontakt) {
                questions.push({
                    question: selvstendigStepTexts.selvstendigRevisorNAVKanTaKontakt,
                    answer: formatYesOrNoAnswer(selvstendigRevisorNAVKanTaKontakt),
                });
            }
        }

        const apiData: SelvstendigNæringsdrivendeApiData = {
            inntektstapStartet: formatDateToApiFormat(selvstendigInntektstapStartetDato),
            inntektIPerioden: selvstendigInntektIPerioden,
            inntekt2019: selvstendigSkalOppgiInntekt2019(personligeForetak) ? selvstendigInntekt2019 : undefined,
            inntekt2020: selvstendigSkalOppgiInntekt2020(personligeForetak) ? selvstendigInntekt2020 : undefined,
            inntektIPeriodenSomFrilanser: harFrilanserInntekt ? selvstendigInntektSomFrilanserIPerioden : undefined,
            info: {
                period: formatDateRange(selvstendigCalculatedDateRange),
                lastDayWithNormalIncome: '1. mars 2020',
            },
            regnskapsfører:
                selvstendigHarRegnskapsfører === YesOrNo.YES &&
                selvstendigRegnskapsførerNavn &&
                selvstendigRegnskapsførerTelefon
                    ? {
                          navn: selvstendigRegnskapsførerNavn,
                          telefon: selvstendigRegnskapsførerTelefon,
                      }
                    : undefined,
            questions,
        };

        return apiData;
    }
    return undefined;
};

export const mapFrilanserFormDataToApiData = (
    { personligeForetak }: ApplicationEssentials,
    {
        frilanserHarTaptInntektPgaKorona,
        frilanserErNyetablert,
        frilanserInntektIPerioden,
        frilanserHarYtelseFraNavSomDekkerTapet,
        frilanserYtelseFraNavDekkerHeleTapet,
        frilanserInntektstapStartetDato,
        frilanserHarHattInntektSomSelvstendigIPerioden,
        frilanserInntektSomSelvstendigIPerioden,
        frilanserCalculatedDateRange,
    }: ApplicationFormData
): FrilanserApiData | undefined => {
    if (frilanserHarTaptInntektPgaKorona === YesOrNo.YES && frilanserCalculatedDateRange) {
        const lastDayWithNormalIncome = moment(frilanserInntektstapStartetDato).subtract(1, 'day').toDate();

        const questions: ApiQuestion[] = [];
        if (personligeForetak && frilanserHarYtelseFraNavSomDekkerTapet) {
            questions.push({
                question: frilanserStepTexts.frilanserHarYtelseFraNavSomDekkerTapet,
                answer: formatYesOrNoAnswer(frilanserHarYtelseFraNavSomDekkerTapet),
            });
            if (frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES) {
                questions.push({
                    question: frilanserStepTexts.frilanserYtelseFraNavDekkerHeleTapet,
                    answer: formatYesOrNoAnswer(frilanserYtelseFraNavDekkerHeleTapet),
                });
            }
        }
        return {
            inntektstapStartet: formatDateToApiFormat(frilanserInntektstapStartetDato),
            erNyetablert: frilanserErNyetablert === YesOrNo.YES,
            inntektIPerioden: frilanserInntektIPerioden,
            inntektIPeriodenSomSelvstendigNæringsdrivende:
                frilanserHarHattInntektSomSelvstendigIPerioden === YesOrNo.YES
                    ? frilanserInntektSomSelvstendigIPerioden
                    : undefined,
            info: {
                period: formatDateRange(frilanserCalculatedDateRange),
                lastDayWithNormalIncome: prettifyDateExtended(lastDayWithNormalIncome),
            },
            questions,
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
        frilanser: mapFrilanserFormDataToApiData(appEssentials, formData),
    };

    return apiData;
};
