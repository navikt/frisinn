import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Locale } from 'common/types/Locale';
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
import { SentryEventName, triggerSentryCustomError, triggerSentryError } from './sentryUtils';
import { isFeatureEnabled, Feature } from './featureToggleUtils';
import { getPeriodeForAvsluttaSelskaper } from '../soknad/selvstendig-step/avsluttet-selskap/avsluttetSelskapUtils';
import { formatDateRange } from './dateRangeUtils';

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
    formData: SelvstendigFormData,
    harSøktTidligere?: boolean
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
        selvstendigHarAvsluttetSelskaper,
        selvstendigAvsluttaSelskaper,
        selvstendigAlleAvsluttaSelskaperErRegistrert,
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
        (personligeForetak !== undefined || harSøktTidligere) &&
        selvstendigBeregnetTilgjengeligSøknadsperiode !== undefined &&
        søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
        selvstendigInntektstapStartetDato !== undefined &&
        (harSøktTidligere ||
            (selvstendigBeregnetInntektsårstall &&
                hasValidHistoriskInntekt({
                    selvstendigInntekt2019,
                    selvstendigInntekt2020,
                    selvstendigBeregnetInntektsårstall,
                })))
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
            if (personligeForetak && harSøktTidligere === false) {
                const avsluttetSelskapPeriode = getPeriodeForAvsluttaSelskaper(
                    personligeForetak.tidligsteRegistreringsdato
                );
                if (
                    selvstendigHarAvsluttetSelskaper === YesOrNo.YES &&
                    selvstendigAlleAvsluttaSelskaperErRegistrert &&
                    avsluttetSelskapPeriode
                ) {
                    spørsmålOgSvar.push({
                        field: SoknadFormField.selvstendigAlleAvsluttaSelskaperErRegistrert,
                        spørsmål: soknadQuestionText.selvstendigAlleAvsluttaSelskaperErRegistrert(
                            avsluttetSelskapPeriode
                        ),
                        svar: formatYesOrNoAnswer(selvstendigAlleAvsluttaSelskaperErRegistrert),
                    });
                }
            }
        }

        let apiData: SelvstendigNæringsdrivendeApiData = {
            inntektstapStartet: formatDateToApiFormat(selvstendigInntektstapStartetDato),
            inntektIPerioden: selvstendigInntektIPerioden,
            inntektIPeriodenSomFrilanser: harFrilanserInntekt ? selvstendigInntektSomFrilanserIPerioden : undefined,
            info: {
                periode: formatDateRange(selvstendigBeregnetTilgjengeligSøknadsperiode),
            },
            opphørtePersonligeForetak: [],
            spørsmålOgSvar: spørsmålOgSvar,
        };
        if (harSøktTidligere === false) {
            apiData = {
                ...apiData,
                inntekt2019: selvstendigBeregnetInntektsårstall === 2019 ? selvstendigInntekt2019 : undefined,
                inntekt2020: selvstendigBeregnetInntektsårstall === 2020 ? selvstendigInntekt2020 : undefined,
                opphørtePersonligeForetak:
                    selvstendigHarAvsluttetSelskaper === YesOrNo.YES &&
                    selvstendigAvsluttaSelskaper &&
                    isFeatureEnabled(Feature.AVSLUTTA_SELSKAPER)
                        ? selvstendigAvsluttaSelskaper.map((s) => ({
                              navn: s.navn,
                              registreringsdato: formatDateToApiFormat(s.opprettetDato),
                              opphørsdato: formatDateToApiFormat(s.avsluttetDato),
                          }))
                        : undefined,
                regnskapsfører:
                    selvstendigHarRegnskapsfører === YesOrNo.YES &&
                    selvstendigRegnskapsførerNavn &&
                    selvstendigRegnskapsførerTelefon
                        ? {
                              navn: selvstendigRegnskapsførerNavn,
                              telefon: selvstendigRegnskapsførerTelefon,
                          }
                        : undefined,
            };
        }
        return apiData;
    }
    // Debug
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
                  selvstendigBeregnetInntektsårstall,
                  selvstendigInntekt2019,
                  selvstendigInntekt2020,
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
            JSON.stringify(payload)
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
        frilanserInntektIPerioden,
        frilanserHarYtelseFraNavSomDekkerTapet,
        frilanserInntektstapStartetDato,
        frilanserHarHattInntektSomSelvstendigIPerioden,
        frilanserInntektSomSelvstendigIPerioden,
        frilanserBeregnetTilgjengeligSøknadsperiode,
        søkerOmTaptInntektSomFrilanser,
        frilanserSoknadIsOk,
    } = formData;
    if (
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserBeregnetTilgjengeligSøknadsperiode &&
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
            inntektIPerioden: frilanserInntektIPerioden,
            inntektIPeriodenSomSelvstendigNæringsdrivende:
                frilanserHarHattInntektSomSelvstendigIPerioden === YesOrNo.YES
                    ? frilanserInntektSomSelvstendigIPerioden
                    : undefined,
            info: {
                periode: formatDateRange(frilanserBeregnetTilgjengeligSøknadsperiode),
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
                  frilanserBeregnetTilgjengeligSøknadsperiode,
                  frilanserHarYtelseFraNavSomDekkerTapet,
              };
        triggerSentryCustomError(
            SentryEventName.mapSelvstendigNæringsdrivendeFormDataToApiDataReturnsUndefined,
            JSON.stringify(payload)
        );
    }
    return undefined;
};

export const mapArbeidstakerinntektIPerioden = (formData: SoknadFormData): number | undefined => {
    const { arbeidstakerInntektIPerioden, arbeidstakerHarHattInntektIPerioden } = formData;
    if (
        isFeatureEnabled(Feature.ARBEIDSTAKERINNTEKT) &&
        arbeidstakerHarHattInntektIPerioden === YesOrNo.YES &&
        arbeidstakerInntektIPerioden !== undefined &&
        arbeidstakerInntektIPerioden > 0
    ) {
        return arbeidstakerInntektIPerioden;
    }
    return undefined;
};

export const mapFormDataToApiData = (
    soknadEssentials: SoknadEssentials,
    formData: SoknadFormData,
    språk: Locale
): SoknadApiData | undefined => {
    const {
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        startetSøknadTidspunkt,
        selvstendigStopReason,
        frilanserStopReason,
    } = formData;
    let apiData: SoknadApiData | undefined;
    try {
        apiData = {
            språk: (språk as any) === 'en' ? 'nn' : språk,
            harBekreftetOpplysninger,
            harForståttRettigheterOgPlikter,
            startetSøknad: startetSøknadTidspunkt ? startetSøknadTidspunkt.toISOString() : 'undefined',
            selvstendigNæringsdrivende:
                selvstendigStopReason === undefined
                    ? mapSelvstendigNæringsdrivendeFormDataToApiData(
                          soknadEssentials.personligeForetak,
                          formData,
                          soknadEssentials.tidligerePerioder?.harSøktSomSelvstendigNæringsdrivende
                      )
                    : undefined,
            frilanser:
                frilanserStopReason === undefined
                    ? mapFrilanserFormDataToApiData(soknadEssentials.personligeForetak, formData)
                    : undefined,
            inntektIPeriodenSomArbeidstaker: mapArbeidstakerinntektIPerioden(formData),
        };
    } catch (e) {
        triggerSentryError(SentryEventName.mapSoknadFailed, e);
    } finally {
        return apiData;
    }
};
