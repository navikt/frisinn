import { FrilanserFormData, SoknadFormField } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { mapFrilanserFormDataToApiData } from '../mapFormDataToApiData';
import { PersonligeForetak } from '../../types/SoknadEssentials';

jest.mock('../envUtils', () => ({
    isRunningInDevEnvironment: () => true,
}));

jest.mock('../featureToggleUtils', () => ({
    isFeatureEnabled: () => true,
}));

const registreringsdato2019 = apiStringDateToDate('2019-01-1');
const personligeForetak: PersonligeForetak = {
    foretak: [
        {
            navn: 'Foretak',
            organisasjonsnummer: '123',
            registreringsdato: registreringsdato2019,
        },
    ],
    tidligsteRegistreringsdato: registreringsdato2019,
};

describe('mapFrilanserFormDataToApiData', () => {
    const periode: DateRange = {
        from: apiStringDateToDate('2020-04-01'),
        to: apiStringDateToDate('2020-04-30'),
    };

    const formData: FrilanserFormData = {
        frilanserHarMottattUtbetalingTidligere: YesOrNo.NO,
        frilanserBeregnetTilgjengeligSøknadsperiode: periode,
        frilanserInntektIPerioden: 0,
        frilanserInntektstapStartetDato: apiStringDateToDate('2020-04-01'),
        søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
        søkerOmTaptInntektSomFrilanser: YesOrNo.YES,
        frilanserHarTaptInntektPgaKorona: YesOrNo.YES,
        frilanserHarYtelseFraNavSomDekkerTapet: YesOrNo.NO,
        frilanserHarHattInntektSomSelvstendigIPerioden: YesOrNo.UNANSWERED,
        frilanserInntektSomSelvstendigIPerioden: undefined,
    };
    describe('inntektstapStartetDato and harSøktSomFrilanser', () => {
        it(`includes ${SoknadFormField.frilanserInntektstapStartetDato} when harSøktSomFrilanser=false`, () => {
            const apiData = mapFrilanserFormDataToApiData(personligeForetak, false, {
                ...formData,
            });
            expect(apiData?.inntektstapStartet).toBeDefined();
        });
        it(`includes ${SoknadFormField.frilanserInntektstapStartetDato} when harSøktSomFrilanser=true but frilanserHarMottattUtbetalingTidligere===NO`, () => {
            const apiData = mapFrilanserFormDataToApiData(personligeForetak, true, {
                ...formData,
                frilanserHarMottattUtbetalingTidligere: YesOrNo.NO,
            });
            expect(apiData?.inntektstapStartet).toBeDefined();
        });
        it(`does not include ${SoknadFormField.frilanserInntektstapStartetDato} when harSøktSomFrilanser=true && `, () => {
            const apiData = mapFrilanserFormDataToApiData(personligeForetak, true, {
                ...formData,
                frilanserHarMottattUtbetalingTidligere: YesOrNo.YES,
            });
            expect(apiData?.inntektstapStartet).toBeUndefined();
        });
    });
    describe('invalid formData', () => {
        it('returns undefined if frilanserHarTaptInntektPgaKorona === NO', () => {
            const apiData = mapFrilanserFormDataToApiData(personligeForetak, false, {
                ...formData,
                frilanserHarTaptInntektPgaKorona: YesOrNo.NO,
            });
            expect(apiData).toBeUndefined();
        });
        it('returns undefined if frilanserBeregnetTilgjengeligSøknadsperiode is undefined', () => {
            const apiData = mapFrilanserFormDataToApiData(personligeForetak, false, {
                ...formData,
                frilanserBeregnetTilgjengeligSøknadsperiode: undefined,
            });
            expect(apiData).toBeUndefined();
        });
        it('returns undefined if frilanserHarYtelseFraNavSomDekkerTapet === YES', () => {
            const apiData = mapFrilanserFormDataToApiData(personligeForetak, false, {
                ...formData,
                frilanserHarYtelseFraNavSomDekkerTapet: YesOrNo.YES,
            });
            expect(apiData).toBeUndefined();
        });
    });
});
