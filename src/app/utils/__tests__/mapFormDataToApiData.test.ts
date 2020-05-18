import { FrilanserFormData } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { mapFrilanserFormDataToApiData } from '../mapFormDataToApiData';
import { PersonligeForetak } from '../../types/SoknadEssentials';

jest.mock('../envUtils', () => ({
    isRunningInDevEnvironment: () => true,
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
        frilanserBeregnetTilgjengeligSøknadsperiode: periode,
        frilanserInntektIPerioden: 0,
        frilanserInntektstapStartetDato: apiStringDateToDate('2020-04-01'),
        søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
        søkerOmTaptInntektSomFrilanser: YesOrNo.YES,
        frilanserErNyetablert: YesOrNo.NO,
        frilanserHarTaptInntektPgaKorona: YesOrNo.YES,
        frilanserHarYtelseFraNavSomDekkerTapet: YesOrNo.NO,
        frilanserHarHattInntektSomSelvstendigIPerioden: YesOrNo.UNANSWERED,
        frilanserInntektSomSelvstendigIPerioden: undefined,
    };
    describe('invalid formData', () => {
        it('returns undefined if frilanserHarTaptInntektPgaKorona === NO', () => {
            const apiData = mapFrilanserFormDataToApiData(personligeForetak, {
                ...formData,
                frilanserHarTaptInntektPgaKorona: YesOrNo.NO,
            });
            expect(apiData).toBeUndefined();
        });
        it('returns undefined if frilanserBeregnetTilgjengeligSøknadsperiode is undefined', () => {
            const apiData = mapFrilanserFormDataToApiData(personligeForetak, {
                ...formData,
                frilanserBeregnetTilgjengeligSøknadsperiode: undefined,
            });
            expect(apiData).toBeUndefined();
        });
        it('returns undefined if frilanserHarYtelseFraNavSomDekkerTapet === YES', () => {
            const apiData = mapFrilanserFormDataToApiData(personligeForetak, {
                ...formData,
                frilanserHarYtelseFraNavSomDekkerTapet: YesOrNo.YES,
            });
            expect(apiData).toBeUndefined();
        });
    });
});
