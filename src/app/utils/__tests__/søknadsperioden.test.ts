import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import Søknadsperioden from '../søknadsperioden';

jest.mock('../featureToggleUtils', () => ({
    isFeatureEnabled: () => true,
    Feature: {
        ANDREGANGSSOKNAD: 'ANDREGANGSSOKNAD',
    },
}));

describe('erÅpnetForAndregangssøknad', () => {
    it('returns false if søknadsperiode is before may 2020', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2020-04-01'),
            to: apiStringDateToDate('2020-04-30'),
        };
        expect(Søknadsperioden(periode).erÅpnetForAndregangssøknad).toBeFalsy();
    });
    it('returns true if søknadsperiode is from or after may 2020', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2020-05-01'),
            to: apiStringDateToDate('2020-05-31'),
        };
        expect(Søknadsperioden(periode).erÅpnetForAndregangssøknad).toBeTruthy();
    });
});
describe('førsteUgyldigeStartdatoForInntektstap', () => {
    it('returns correct date for mars/april søknadsperiode', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2020-03-13'),
            to: apiStringDateToDate('2020-04-30'),
        };
        const { førsteUgyldigeStartdatoForInntektstap } = Søknadsperioden(periode);
        expect(formatDateToApiFormat(førsteUgyldigeStartdatoForInntektstap)).toEqual('2020-04-15');
    });
    it('returns correct date for mai søknadsperiode', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2020-05-01'),
            to: apiStringDateToDate('2020-05-31'),
        };
        const { førsteUgyldigeStartdatoForInntektstap } = Søknadsperioden(periode);
        expect(formatDateToApiFormat(førsteUgyldigeStartdatoForInntektstap)).toEqual('2020-05-16');
    });
});
