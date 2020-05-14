import { formatDateToApiFormat, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Locale } from 'common/types/Locale';
import { formatDateRange } from '../components/date-range-view/DateRangeView';
import { soknadQuestionText } from '../soknad/soknadQuestionText';
import {
    ApiSpørsmålOgSvar,
    FrilanserApiData,
    SelvstendigNæringsdrivendeApiData,
    SoknadApiData,
} from '../types/SoknadApiData';
import { PersonligeForetak, SoknadEssentials } from '../types/SoknadEssentials';
import { FrilanserFormData, SelvstendigFormData, SoknadFormData, SoknadFormField } from '../types/SoknadFormData';
import { isRunningInDevEnvironment } from './envUtils';
import { hasValidHistoriskInntekt } from './selvstendigUtils';
import { SentryEventName, triggerSentryCustomError } from './sentryUtils';

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
        selvstendigHarTaptInntektPgaKorona,
        selvstendigInntektstapStartetDato,
        selvstendigHarYtelseFraNavSomDekkerTapet,
        selvstendigInntektIPerioden,
        selvstendigInntekt2019,
        selvstendigInntekt2020,
        selvstendigErFrilanser,
        selvstendigHarAvvikletSelskaper,
        selvstendigAvvikledeSelskaper,
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
        selvstendigBeregnetInntektsårstall,
    } = formData;
    if (
        personligeForetak !== undefined &&
        selvstendigBeregnetTilgjengeligSøknadsperiode !== undefined &&
        søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
        selvstendigInntektstapStartetDato !== undefined &&
        selvstendigBeregnetInntektsårstall &&
        hasValidHistoriskInntekt({ selvstendigInntekt2019, selvstendigInntekt2020, selvstendigBeregnetInntektsårstall })
    ) {
        const harFrilanserInntekt =
            selvstendigErFrilanser === YesOrNo.YES && selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES;

        const spørsmålOgSvar: ApiSpørsmålOgSvar[] = [
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
        if (selvstendigHarAvvikletSelskaper === YesOrNo.YES && selvstendigAvvikledeSelskaper) {
            const selskaper = selvstendigAvvikledeSelskaper?.map(
                ({ opprettetDato, avsluttetDato, navn }) =>
                    `${prettifyDate(opprettetDato)} - ${prettifyDate(avsluttetDato)}: ${navn}`
            );
            spørsmålOgSvar.push({
                field: SoknadFormField.selvstendigAvvikledeSelskaper,
                spørsmål: soknadQuestionText.selvstendigAvvikledeSelskaper,
                svar: selskaper,
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
            inntekt2019: selvstendigBeregnetInntektsårstall === 2019 ? selvstendigInntekt2019 : undefined,
            inntekt2020: selvstendigBeregnetInntektsårstall === 2020 ? selvstendigInntekt2020 : undefined,
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
                  selvstendigHarTaptInntektPgaKorona,
                  selvstendigInntektstapStartetDato,
                  selvstendigErFrilanser,
                  selvstendigHarHattInntektSomFrilanserIPerioden,
                  hasValidHistoriskInntekt: personligeForetak
                      ? hasValidHistoriskInntekt({
                            selvstendigInntekt2019,
                            selvstendigInntekt2020,
                            selvstendigBeregnetInntektsårstall,
                        })
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
        frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.NO
    ) {
        const questions: ApiSpørsmålOgSvar[] = [];
        if (personligeForetak && frilanserHarYtelseFraNavSomDekkerTapet) {
            questions.push({
                field: SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet,
                spørsmål: soknadQuestionText.frilanserHarYtelseFraNavSomDekkerTapet,
                svar: formatYesOrNoAnswer(frilanserHarYtelseFraNavSomDekkerTapet),
            });
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
