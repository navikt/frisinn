import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getSisteGyldigeDagForInntektstapIPeriode } from '../dateUtils';

describe('dateUtils', () => {
    describe('getSisteGyldigeDagForInntektstapIPeriode', () => {
        const aprilDateRange: DateRange = {
            from: apiStringDateToDate('2020-03-14'),
            to: apiStringDateToDate('2020-04-30'),
        };
        const mayDateRange: DateRange = {
            from: apiStringDateToDate('2020-05-01'),
            to: apiStringDateToDate('2020-05-31'),
        };
        it('returns date correctly for april 2020', () => {
            const sisteGyldigeDato = formatDateToApiFormat(getSisteGyldigeDagForInntektstapIPeriode(aprilDateRange));
            expect(sisteGyldigeDato).toEqual('2020-04-15');
        });
        it('returns date correctly for may 2020', () => {
            const sisteGyldigeDato = formatDateToApiFormat(getSisteGyldigeDagForInntektstapIPeriode(mayDateRange));
            expect(sisteGyldigeDato).toEqual('2020-05-16');
        });
    });
});
