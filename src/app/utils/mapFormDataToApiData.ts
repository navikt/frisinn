import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Locale } from 'common/types/Locale';
import { formatDateRange } from '../components/date-range-view/DateRangeView';
import {
    SoknadApiData,
    FrilanserApiData,
    SelvstendigNæringsdrivendeApiData,
    ApiQuestion,
} from '../types/SoknadApiData';
import { SoknadEssentials, PersonligeForetak } from '../types/SoknadEssentials';
import { SoknadFormData, SelvstendigFormData, SoknadFormField, FrilanserFormData } from '../types/SoknadFormData';
import {
    selvstendigSkalOppgiInntekt2019,
    selvstendigSkalOppgiInntekt2020,
    hasValidHistoriskInntekt,
} from './selvstendigUtils';
import { selvstendigStepTexts } from '../soknad/selvstendig-step/selvstendigStepTexts';
import { frilanserStepTexts } from '../soknad/frilanser-step/frilanserStepTexts';
import { SentryEventName, triggerSentryCustomError } from './sentryUtils';
import { Severity } from '@sentry/browser';

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
    formData: SelvstendigFormData
): SelvstendigNæringsdrivendeApiData | undefined => {
    const {
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
    } = formData;
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
                field: SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet,
                question: selvstendigStepTexts.selvstendigHarYtelseFraNavSomDekkerTapet,
                answer: formatYesOrNoAnswer(selvstendigHarYtelseFraNavSomDekkerTapet),
            },
        ];
        if (selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES) {
            questions.push({
                field: SoknadFormField.selvstendigYtelseFraNavDekkerHeleTapet,
                question: selvstendigStepTexts.selvstendigYtelseFraNavDekkerHeleTapet,
                answer: formatYesOrNoAnswer(selvstendigYtelseFraNavDekkerHeleTapet),
            });
        }
        if (selvstendigHarRegnskapsfører === YesOrNo.NO && selvstendigHarRevisor === YesOrNo.YES) {
            questions.push({
                field: SoknadFormField.selvstendigHarRevisor,
                question: selvstendigStepTexts.selvstendigHarRevisor,
                answer: formatYesOrNoAnswer(selvstendigHarRevisor),
            });
            if (selvstendigRevisorNavn) {
                questions.push({
                    field: SoknadFormField.selvstendigRevisorNavn,
                    question: selvstendigStepTexts.selvstendigRevisorNavn,
                    answer: selvstendigRevisorNavn,
                });
            }
            if (selvstendigRevisorTelefon) {
                questions.push({
                    field: SoknadFormField.selvstendigRevisorTelefon,
                    question: selvstendigStepTexts.selvstendigRevisorTelefon,
                    answer: selvstendigRevisorTelefon,
                });
            }
            if (selvstendigRevisorNAVKanTaKontakt) {
                questions.push({
                    field: SoknadFormField.selvstendigRevisorNAVKanTaKontakt,
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
    triggerSentryCustomError(
        SentryEventName.mapSelvstendigNæringsdrivendeFormDataToApiData,
        'mapSelvstendigNæringsdrivendeFormDataToApiData returns undefined',
        {
            harPersonligeForetak: personligeForetak !== undefined,
            selvstendigBeregnetTilgjengeligSøknadsperiode,
            søkerOmTaptInntektSomSelvstendigNæringsdrivende,
            selvstendigHarHattInntektFraForetak,
            selvstendigHarTaptInntektPgaKorona,
            selvstendigInntektstapStartetDato,
            selvstendigErFrilanser,
            selvstendigHarHattInntektSomFrilanserIPerioden,
            hasValidHistoriskInntekt: personligeForetak
                ? hasValidHistoriskInntekt(
                      { selvstendigInntekt2019, selvstendigInntekt2020 },
                      personligeForetak.tidligsteRegistreringsdato.getFullYear()
                  )
                : 'ingen foretak info',
        }
    );
    return undefined;
};

export const mapFrilanserFormDataToApiData = (
    personligeForetak: PersonligeForetak | undefined,
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
    }: FrilanserFormData
): FrilanserApiData | undefined => {
    if (
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserCalculatedDateRange &&
        !(
            frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES &&
            frilanserYtelseFraNavDekkerHeleTapet === YesOrNo.YES
        )
    ) {
        const questions: ApiQuestion[] = [];
        if (personligeForetak && frilanserHarYtelseFraNavSomDekkerTapet) {
            questions.push({
                field: SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet,
                question: frilanserStepTexts.frilanserHarYtelseFraNavSomDekkerTapet,
                answer: formatYesOrNoAnswer(frilanserHarYtelseFraNavSomDekkerTapet),
            });
            if (frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES) {
                questions.push({
                    field: SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet,
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
        frilanser: mapFrilanserFormDataToApiData(soknadEssentials.personligeForetak, formData),
    };

    return apiData;
};
