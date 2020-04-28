import { SelvstendigFormData } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { mapSelvstendigNæringsdrivendeFormDataToApiData } from '../mapFormDataToApiData';
import { PersonligeForetak } from '../../types/SoknadEssentials';

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

describe('mapFormDataToApiData', () => {
    const periode: DateRange = {
        from: apiStringDateToDate('2020-04-01'),
        to: apiStringDateToDate('2020-04-30'),
    };
    describe('mapSelvstendigNæringsdrivendeFormDataToApiData', () => {
        const formData: SelvstendigFormData = {
            søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
            selvstendigBeregnetTilgjengeligSøknadsperiode: periode,
            selvstendigHarHattInntektFraForetak: YesOrNo.YES,
            selvstendigHarTaptInntektPgaKorona: YesOrNo.YES,
            selvstendigInntektstapStartetDato: apiStringDateToDate('2020-04-01'),
            selvstendigInntektIPerioden: 0,
            selvstendigInntekt2019: 2000,
            selvstendigErFrilanser: YesOrNo.NO,
            selvstendigHarRevisor: YesOrNo.NO,
            selvstendigHarRegnskapsfører: YesOrNo.NO,
            selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.NO,
            selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.NO,
            selvstendigYtelseFraNavDekkerHeleTapet: YesOrNo.UNANSWERED,
            selvstendigInntekt2020: undefined,
            søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
        };
        describe('invalid data and answers which leads to søkerIkkeSomSelvstendig', () => {
            it('returns undefined if selvstendigHarHattInntektFraForetak === NO', () => {
                const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                    ...formData,
                    selvstendigHarHattInntektFraForetak: YesOrNo.NO,
                });
                expect(apiData).toEqual(undefined);
            });
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
                });
                expect(apiData).toEqual(undefined);
        });
        describe('Valid selvstendig næringsdrivende mapping', () => {
            it('includes inntekt income year', () => {
                const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak2019, {
                    ...formData,
                    selvstendigInntekt2019: 20000,
                });
                expect(apiData?.inntekt2019).toBeDefined();
            });
        });
    });
});
