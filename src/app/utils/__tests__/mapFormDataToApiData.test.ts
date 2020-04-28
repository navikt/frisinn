import { SelvstendigFormData } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { mapSelvstendigNæringsdrivendeFormDataToApiData } from '../mapFormDataToApiData';
import { PersonligeForetak } from '../../types/SoknadEssentials';

const registreringsdato = apiStringDateToDate('2019-01-1');
const personligeForetak: PersonligeForetak = {
    foretak: [
        {
            navn: 'Foretak',
            organisasjonsnummer: '123',
            registreringsdato,
        },
    ],
    tidligsteRegistreringsdato: registreringsdato,
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
        it('returns undefined if selvstendigHarHattInntektFraForetak === NO', () => {
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak, {
                ...formData,
                selvstendigHarHattInntektFraForetak: YesOrNo.NO,
            });
            expect(apiData).toEqual(undefined);
        });
        it('returns undefined if selvstendigHarTaptInntektPgaKorona === NO', () => {
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak, {
                ...formData,
                selvstendigHarTaptInntektPgaKorona: YesOrNo.NO,
            });
            expect(apiData).toEqual(undefined);
        });
        it('returns undefined if selvstendigBeregnetTilgjengeligSøknadsperiode === undefined', () => {
            const apiData = mapSelvstendigNæringsdrivendeFormDataToApiData(personligeForetak, {
                ...formData,
                selvstendigBeregnetTilgjengeligSøknadsperiode: undefined,
            });
            expect(apiData).toEqual(undefined);
        });

        expect(true).toBeTruthy();
    });
});
