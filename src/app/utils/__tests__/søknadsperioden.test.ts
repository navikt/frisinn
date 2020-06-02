import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getSøknadsperiodeinfo } from '../søknadsperiodeUtils';

describe('erÅpnetForAndregangssøknad', () => {
    it('returns false if søknadsperiode is march/april', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2020-04-01'),
            to: apiStringDateToDate('2020-04-30'),
        };
        const { erÅpnetForAndregangssøknad } = getSøknadsperiodeinfo(periode);
        expect(erÅpnetForAndregangssøknad).toBeFalsy();
    });
    it('returns true if søknadsperiode is may or later', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2020-05-01'),
            to: apiStringDateToDate('2020-05-31'),
        };
        const { erÅpnetForAndregangssøknad } = getSøknadsperiodeinfo(periode);
        expect(erÅpnetForAndregangssøknad).toBeTruthy();
    });
});
describe('førsteUgyldigeStartdatoForInntektstap', () => {
    it('returns correct date for mars/april søknadsperiode', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2020-03-13'),
            to: apiStringDateToDate('2020-04-30'),
        };
        const { førsteUgyldigeStartdatoForInntektstap } = getSøknadsperiodeinfo(periode);
        expect(formatDateToApiFormat(førsteUgyldigeStartdatoForInntektstap)).toEqual('2020-04-15');
    });
    it('returns correct date for mai søknadsperiode', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2020-05-01'),
            to: apiStringDateToDate('2020-05-31'),
        };
        const { førsteUgyldigeStartdatoForInntektstap } = getSøknadsperiodeinfo(periode);
        expect(formatDateToApiFormat(førsteUgyldigeStartdatoForInntektstap)).toEqual('2020-05-16');
    });
});
