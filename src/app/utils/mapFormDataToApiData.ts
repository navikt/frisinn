import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Locale } from 'common/types/Locale';
import { formatDateRange } from '../components/date-range-view/DateRangeView';
import {
    ApiSpørsmålOgSvar,
    FrilanserApiData,
    SelvstendigNæringsdrivendeApiData,
    SoknadApiData,
} from '../types/SoknadApiData';
import { PersonligeForetak, SoknadEssentials } from '../types/SoknadEssentials';
import { FrilanserFormData, SelvstendigFormData, SoknadFormData, SoknadFormField } from '../types/SoknadFormData';
import {
    hasValidHistoriskInntekt,
    selvstendigSkalOppgiInntekt2019,
    selvstendigSkalOppgiInntekt2020,
    getHistoriskInntektÅrstall,
} from './selvstendigUtils';
import { SentryEventName, triggerSentryCustomError } from './sentryUtils';
import { isRunningInDevEnvironment } from './envUtils';
import { soknadQuestionText } from '../soknad/soknadQuestionText';

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
        selvstendigSoknadIsOk,
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

        const årstallHistoriskInntekt = getHistoriskInntektÅrstall(personligeForetak);

        const spørsmålOgSvar: ApiSpørsmålOgSvar[] = [
            {
                field: SoknadFormField.selvstendigHarHattInntektFraForetak,
                spørsmål: soknadQuestionText.selvstendigHarHattInntektFraForetak(årstallHistoriskInntekt),
                svar: formatYesOrNoAnswer(selvstendigHarHattInntektFraForetak),
            },
            {
                field: SoknadFormField.selvstendigHarTaptInntektPgaKorona,
                spørsmål: soknadQuestionText.selvstendigHarTaptInntektPgaKorona(
                    selvstendigBeregnetTilgjengeligSøknadsperiode
                ),
                svar: formatYesOrNoAnswer(selvstendigHarTaptInntektPgaKorona),
            },
            {
                field: SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet,
                spørsmål: soknadQuestionText.selvstendigHarYtelseFraNavSomDekkerTapet,
                svar: formatYesOrNoAnswer(selvstendigHarYtelseFraNavSomDekkerTapet),
            },
        ];
        if (selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES) {
            spørsmålOgSvar.push({
                field: SoknadFormField.selvstendigYtelseFraNavDekkerHeleTapet,
                spørsmål: soknadQuestionText.selvstendigYtelseFraNavDekkerHeleTapet,
                svar: formatYesOrNoAnswer(selvstendigYtelseFraNavDekkerHeleTapet),
            });
        }
        if (selvstendigHarRegnskapsfører === YesOrNo.NO && selvstendigHarRevisor === YesOrNo.YES) {
            spørsmålOgSvar.push({
                field: SoknadFormField.selvstendigHarRevisor,
                spørsmål: soknadQuestionText.selvstendigHarRevisor,
                svar: formatYesOrNoAnswer(selvstendigHarRevisor),
            });
            if (selvstendigRevisorNavn) {
                spørsmålOgSvar.push({
                    field: SoknadFormField.selvstendigRevisorNavn,
                    spørsmål: soknadQuestionText.selvstendigRevisorNavn,
                    svar: selvstendigRevisorNavn,
                });
            }
            if (selvstendigRevisorTelefon) {
                spørsmålOgSvar.push({
                    field: SoknadFormField.selvstendigRevisorTelefon,
                    spørsmål: soknadQuestionText.selvstendigRevisorTelefon,
                    svar: selvstendigRevisorTelefon,
                });
            }
            if (selvstendigRevisorNAVKanTaKontakt) {
                spørsmålOgSvar.push({
                    field: SoknadFormField.selvstendigRevisorNAVKanTaKontakt,
                    spørsmål: soknadQuestionText.selvstendigRevisorNAVKanTaKontakt,
                    svar: formatYesOrNoAnswer(selvstendigRevisorNAVKanTaKontakt),
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
            spørsmålOgSvar: spørsmålOgSvar,
        };
        return apiData;
    }

    if (søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES && selvstendigSoknadIsOk) {
        const payload = isRunningInDevEnvironment()
            ? {
                  formData,
                  personligeForetak,
              }
            : {
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
              };

        /** Something is amiss - logg */
        triggerSentryCustomError(
            SentryEventName.mapSelvstendigNæringsdrivendeFormDataToApiDataReturnsUndefined,
            payload
        );
    }
    return undefined;
};

export const mapFrilanserFormDataToApiData = (
    personligeForetak: PersonligeForetak | undefined,
    formData: FrilanserFormData
): FrilanserApiData | undefined => {
    const {
        frilanserHarTaptInntektPgaKorona,
        frilanserErNyetablert,
        frilanserInntektIPerioden,
        frilanserHarYtelseFraNavSomDekkerTapet,
        frilanserYtelseFraNavDekkerHeleTapet,
        frilanserInntektstapStartetDato,
        frilanserHarHattInntektSomSelvstendigIPerioden,
        frilanserInntektSomSelvstendigIPerioden,
        frilanserBeregnetTilgjengeligSønadsperiode,
        søkerOmTaptInntektSomFrilanser,
        frilanserSoknadIsOk,
    } = formData;
    if (
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserBeregnetTilgjengeligSønadsperiode &&
        !(
            frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES &&
            frilanserYtelseFraNavDekkerHeleTapet === YesOrNo.YES
        )
    ) {
        const questions: ApiSpørsmålOgSvar[] = [];
        if (personligeForetak && frilanserHarYtelseFraNavSomDekkerTapet) {
            questions.push({
                field: SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet,
                spørsmål: soknadQuestionText.frilanserHarYtelseFraNavSomDekkerTapet,
                svar: formatYesOrNoAnswer(frilanserHarYtelseFraNavSomDekkerTapet),
            });
            if (frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES) {
                questions.push({
                    field: SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet,
                    spørsmål: soknadQuestionText.frilanserYtelseFraNavDekkerHeleTapet,
                    svar: formatYesOrNoAnswer(frilanserYtelseFraNavDekkerHeleTapet),
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
                period: formatDateRange(frilanserBeregnetTilgjengeligSønadsperiode),
            },
            spørsmålOgSvar: questions,
        };
    }
    if (søkerOmTaptInntektSomFrilanser === YesOrNo.NO && frilanserSoknadIsOk) {
        /** Something is amiss - log */
        const payload = isRunningInDevEnvironment()
            ? {
                  formData,
                  personligeForetak,
              }
            : {
                  frilanserHarTaptInntektPgaKorona,
                  frilanserBeregnetTilgjengeligSønadsperiode,
                  frilanserHarYtelseFraNavSomDekkerTapet,
                  frilanserYtelseFraNavDekkerHeleTapet,
              };
        triggerSentryCustomError(
            SentryEventName.mapSelvstendigNæringsdrivendeFormDataToApiDataReturnsUndefined,
            payload
        );
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
