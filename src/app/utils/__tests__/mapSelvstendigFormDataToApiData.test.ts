import { SelvstendigFormData, SoknadFormField } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { mapSelvstendigNæringsdrivendeFormDataToApiData } from '../mapFormDataToApiData';
import { PersonligeForetak } from '../../types/SoknadEssentials';
import { getQuestionAnswer } from '../testUtils';

jest.mock('../envUtils', () => ({
    isRunningInDevEnvironment: () => true,
}));

jest.mock('../featureToggleUtils', () => ({
    isFeatureEnabled: () => true,
}));

const registreringsdato2019 = apiStringDateToDate('2019-01-1');
const personligeForetak2019: PersonligeForetak = {
    foretak: [
        {
            navn: 'Foretak',
            organisasjonsnummer: '123',
            registreringsdato: registreringsdato2019,
        },
    ],
    tidligsteRegistreringsdato: registreringsdato2019,
};

const registreringsdato2020 = apiStringDateToDate('2020-01-1');
const personligeForetak2020: PersonligeForetak = {
    foretak: [
        {
            navn: 'Foretak',
            organisasjonsnummer: '123',
            registreringsdato: registreringsdato2020,
        },
    ],
    tidligsteRegistreringsdato: registreringsdato2020,
};

const periode: DateRange = {
    from: apiStringDateToDate('2020-04-01'),
    to: apiStringDateToDate('2020-04-30'),
};
describe('mapSelvstendigNæringsdrivendeFormDataToApiData', () => {
    const formData: SelvstendigFormData = {
        søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
        selvstendigHarAvsluttetSelskaper: YesOrNo.NO,
        selvstendigAvsluttaSelskaper: [],
        selvstendigBeregnetTilgjengeligSøknadsperiode: periode,
        selvstendigBeregnetInntektsårstall: 2019,
        selvstendigHarTaptInntektPgaKorona: YesOrNo.YES,
        selvstendigInntektstapStartetDato: apiStringDateToDate('2020-04-01'),
        selvstendigInntektIPerioden: 0,
        selvstendigInntekt2019: 2000,
        selvstendigErFrilanser: YesOrNo.NO,
        selvstendigHarRevisor: YesOrNo.NO,
        selvstendigHarRegnskapsfører: YesOrNo.NO,
        selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.NO,
        selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.NO,
        selvstendigInntekt2020: undefined,
        søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
    };
    describe('invalid data and answers which leads to søkerIkkeSomSelvstendig', () => {
        it('returns undefined if selvstendigHarTaptInntektPgaKorona === NO', () => {
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                ...formData,
                selvstendigHarTaptInntektPgaKorona: YesOrNo.NO,
            });
            expect(apiData).toEqual(undefined);
        });
        it('returns undefined if selvstendigBeregnetTilgjengeligSøknadsperiode === undefined', () => {
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                ...formData,
                selvstendigBeregnetTilgjengeligSøknadsperiode: undefined,
            });
            expect(apiData).toEqual(undefined);
        });
        it('returns undefined if has no income for 2019 and has started in 2019 or earlier', () => {
            const selvstendigInntekt2019 = undefined as any;
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                ...formData,
                selvstendigInntekt2019,
            });
            expect(apiData).toEqual(undefined);
        });
        it('returns undefined if has no income for 2019 and has started in 2019 or earlier', () => {
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                ...formData,
                selvstendigInntekt2019: 0,
            });
            expect(apiData).toEqual(undefined);
        });
        it('returns undefined if has no income for 2020 and has started in 2020', () => {
            const selvstendigInntekt2020 = undefined as any;
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2020, {
                ...formData,
                selvstendigInntekt2020,
                selvstendigBeregnetInntektsårstall: 2020,
            });
            expect(apiData).toEqual(undefined);
        });
    });
    describe('Valid selvstendig næringsdrivende mapping', () => {
        it('includes all basic data', () => {
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                ...formData,
                selvstendigInntektIPerioden: 10,
                selvstendigInntekt2019: 20000,
            });
            expect(apiData?.inntektstapStartet).toEqual('2020-04-01');
            expect(apiData?.inntekt2019).toBe(20000);
            expect(apiData?.inntektIPerioden).toBe(10);
            expect(apiData?.inntektIPeriodenSomFrilanser).toBeUndefined();
            expect(apiData?.regnskapsfører).toBeUndefined();
        });
        it('includes selvstendigInntekt2019 when it is defined', () => {
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                ...formData,
                selvstendigInntekt2019: 20000,
                selvstendigBeregnetInntektsårstall: 2019,
            });
            expect(apiData?.inntekt2019).toBeDefined();
        });
        it('includes selvstendigInntekt2020 when it is defined', () => {
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2020, {
                ...formData,
                selvstendigInntekt2020: 20000,
                selvstendigBeregnetInntektsårstall: 2020,
            });
            expect(apiData?.inntekt2020).toBeDefined();
        });
        describe('Utbetalinger fra NAV', () => {
            it('does not include utebetalinger fra NAV info when selvstendigHarYtelseFraNavSomDekkerTapet === NO', () => {
                const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                    ...formData,
                    selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.NO,
                });
                expect(
                    getQuestionAnswer(apiData?.spørsmålOgSvar, SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet)
                ).toBe('Nei');
            });
        });
        describe('Regnskapsfører', () => {
            it('Contains no info about regnskapsfører if selvstendigHarRegnskapsfører === NO', () => {
                const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                    ...formData,
                    selvstendigHarRegnskapsfører: YesOrNo.NO,
                });
                expect(apiData?.regnskapsfører).toBeUndefined();
            });
            it('Contains all info about regnskapsfører if selvstendigHarRegnskapsfører ===  YES', () => {
                const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                    ...formData,
                    selvstendigHarRegnskapsfører: YesOrNo.YES,
                    selvstendigRegnskapsførerNavn: 'Regnskapsfører',
                    selvstendigRegnskapsførerTelefon: '123456789',
                });
                expect(apiData?.regnskapsfører?.navn).toBe('Regnskapsfører');
                expect(apiData?.regnskapsfører?.telefon).toBe('123456789');
            });
            it('Contains no info about revisor if selvstendigHarRegnskapsfører ===  YES', () => {
                const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                    ...formData,
                    selvstendigHarRegnskapsfører: YesOrNo.YES,
                    selvstendigRegnskapsførerNavn: 'Regnskapsfører',
                    selvstendigRegnskapsførerTelefon: '123456789',
                });
                expect(
                    getQuestionAnswer(apiData?.spørsmålOgSvar, SoknadFormField.selvstendigRevisorNavn)
                ).toBeUndefined();
                expect(
                    getQuestionAnswer(apiData?.spørsmålOgSvar, SoknadFormField.selvstendigRevisorTelefon)
                ).toBeUndefined();
                expect(
                    getQuestionAnswer(apiData?.spørsmålOgSvar, SoknadFormField.selvstendigRevisorNAVKanTaKontakt)
                ).toBeUndefined();
            });
            it('Contains all info about revisor if selvstendigHarRegnskapsfører === NO and selvstendigHarRevisor === YEs', () => {
                const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                    ...formData,
                    selvstendigHarRegnskapsfører: YesOrNo.NO,
                    selvstendigHarRevisor: YesOrNo.YES,
                    selvstendigRevisorNavn: 'Revisor',
                    selvstendigRevisorTelefon: '123456789',
                    selvstendigRevisorNAVKanTaKontakt: YesOrNo.YES,
                });
                expect(getQuestionAnswer(apiData?.spørsmålOgSvar, SoknadFormField.selvstendigRevisorNavn)).toEqual(
                    'Revisor'
                );
                expect(getQuestionAnswer(apiData?.spørsmålOgSvar, SoknadFormField.selvstendigRevisorTelefon)).toEqual(
                    '123456789'
                );
                expect(
                    getQuestionAnswer(apiData?.spørsmålOgSvar, SoknadFormField.selvstendigRevisorNAVKanTaKontakt)
                ).toEqual('Ja');
            });
        });
        describe('Selvstendig som ikke søker frilanser', () => {
            it('includes frilanserInfo when selvstendigErFrilanser === true', () => {
                const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                    ...formData,
                    selvstendigErFrilanser: YesOrNo.YES,
                    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.YES,
                    selvstendigInntektSomFrilanserIPerioden: 10,
                });
                expect(apiData?.inntektIPeriodenSomFrilanser).toEqual(10);
            });
            it('does not include inntektIPeriodenSomFrilanser when selvstendigErFrilanser === false', () => {
                const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                    ...formData,
                    selvstendigErFrilanser: YesOrNo.NO,
                    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.YES,
                    selvstendigInntektSomFrilanserIPerioden: 10,
                });
                expect(apiData?.inntektIPeriodenSomFrilanser).toBeUndefined();
            });
        });
    });
});
