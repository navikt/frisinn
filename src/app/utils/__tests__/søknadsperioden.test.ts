import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import Søknadsperioden from '../søknadsperioden';

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
