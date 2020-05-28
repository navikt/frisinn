import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { erÅpnetForAndregangssøknad } from '../soknadsperiodeUtils';

describe('erÅpnetForAndregangssøknad', () => {
    it('returns false if søknadsperiode is before may 2020', () => {
        expect(
            erÅpnetForAndregangssøknad({
                from: apiStringDateToDate('2020-04-01'),
                to: apiStringDateToDate('2020-04-30'),
            })
        ).toBeFalsy();
        expect(
            erÅpnetForAndregangssøknad({
                from: apiStringDateToDate('2019-04-01'),
                to: apiStringDateToDate('2019-04-30'),
            })
        ).toBeFalsy();
    });
    it('returns true if søknadsperiode is from or after may 2020', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2020-05-01'),
            to: apiStringDateToDate('2020-05-31'),
        };
        expect(erÅpnetForAndregangssøknad(periode)).toBeTruthy();
    });
});
