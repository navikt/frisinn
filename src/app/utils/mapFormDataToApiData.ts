import { formatDateToApiFormat, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import { Locale } from 'common/types/Locale';
import { formatDateRange } from '../components/date-range-view/DateRangeView';
import {
    SoknadApiData,
    FrilanserApiData,
    SelvstendigNæringsdrivendeApiData,
    ApiQuestion,
} from '../types/SoknadApiData';
import { SoknadEssentials, PersonligeForetak } from '../types/SoknadEssentials';
import { SoknadFormData, SelvstendigFormData } from '../types/SoknadFormData';
import {
    selvstendigSkalOppgiInntekt2019,
    selvstendigSkalOppgiInntekt2020,
    hasValidHistoriskInntekt,
} from './selvstendigUtils';
import { selvstendigStepTexts } from '../soknad/selvstendig-step/selvstendigStepTexts';
import { frilanserStepTexts } from '../soknad/frilanser-step/frilanserStepTexts';

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

export const mapSelvstendigNæringsdrivendeFormDataToApiData = (
    personligeForetak: PersonligeForetak | undefined,
    {
        søkerOmTaptInntektSomSelvstendigNæringsdrivende,
        selvstendigHarHattInntektFraForetak,
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
        selvstendigBeregnetTilgjengeligSøknadsperiode,
        selvstendigHarRegnskapsfører,
        selvstendigRegnskapsførerNavn,
        selvstendigRegnskapsførerTelefon,
        selvstendigHarRevisor,
        selvstendigRevisorNavn,
        selvstendigRevisorTelefon,
        selvstendigRevisorNAVKanTaKontakt,
    }: SelvstendigFormData
): SelvstendigNæringsdrivendeApiData | undefined => {
    if (
        personligeForetak !== undefined &&
        selvstendigBeregnetTilgjengeligSøknadsperiode !== undefined &&
        søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
        selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
        selvstendigInntektstapStartetDato !== undefined &&
        hasValidHistoriskInntekt(
            { selvstendigInntekt2019, selvstendigInntekt2020 },
            personligeForetak.tidligsteRegistreringsdato.getFullYear()
        )
    ) {
        const harFrilanserInntekt =
            selvstendigErFrilanser === YesOrNo.YES && selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES;

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
                period: formatDateRange(selvstendigBeregnetTilgjengeligSøknadsperiode),
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
    { personligeForetak }: SoknadEssentials,
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
    }: SoknadFormData
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
    soknadEssentials: SoknadEssentials,
    formData: SoknadFormData,
    språk: Locale
): SoknadApiData | undefined => {
    const { harBekreftetOpplysninger, harForståttRettigheterOgPlikter } = formData;

    const apiData: SoknadApiData = {
        språk: (språk as any) === 'en' ? 'nn' : språk,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        selvstendigNæringsdrivende: mapSelvstendigNæringsdrivendeFormDataToApiData(
            soknadEssentials.personligeForetak,
            formData
        ),
        frilanser: mapFrilanserFormDataToApiData(soknadEssentials, formData),
    };

    return apiData;
};
