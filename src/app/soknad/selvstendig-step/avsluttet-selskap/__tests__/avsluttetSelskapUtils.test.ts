import { getPeriodeForAvsluttaSelskaper } from '../avsluttetSelskapUtils';
import { apiStringDateToDate } from '../../../../utils/dateUtils';

describe('avsluttetSelskapUtils', () => {
    describe('getPeriodeForAvsluttaSelskaper', () => {
        it('returns 2018-2020 if tidligsteRegistreringsdato = 2020', () => {
            const result = getPeriodeForAvsluttaSelskaper(apiStringDateToDate('2020-01-01'));
            expect(result?.to.getFullYear()).toEqual(2020);
        });
        it('returns 2018-2019 if tidligsteRegistreringsdato = 2019', () => {
            const result = getPeriodeForAvsluttaSelskaper(apiStringDateToDate('2019-01-01'));
            expect(result?.to.getFullYear()).toEqual(2019);
        });
        it('returns 2018 if tidligsteRegistreringsdato = 2018', () => {
            const result = getPeriodeForAvsluttaSelskaper(apiStringDateToDate('2018-01-01'));
            expect(result?.to.getFullYear()).toEqual(2018);
        });
        it('returns undefined if tidligsteRegistreringsdato = 2018', () => {
            const result = getPeriodeForAvsluttaSelskaper(apiStringDateToDate('2017-01-01'));
            expect(result?.to.getFullYear()).toBeUndefined();
        });
    });
});
