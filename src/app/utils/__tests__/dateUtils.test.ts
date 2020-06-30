import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getSisteGyldigeDagForInntektstapIPeriode, getSøknadsfristForPeriode } from '../dateUtils';

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
            expect(sisteGyldigeDato).toEqual('2020-04-14');
        });
        it('returns date correctly for may 2020', () => {
            const sisteGyldigeDato = formatDateToApiFormat(getSisteGyldigeDagForInntektstapIPeriode(mayDateRange));
            expect(sisteGyldigeDato).toEqual('2020-05-15');
        });
    });

    describe('getSøknadsfristForPeriode', () => {
        it('returns june 3. for march/april period', () => {
            const periode: DateRange = {
                from: apiStringDateToDate('2020-03-14'),
                to: apiStringDateToDate('2020-04-30'),
            };
            const frist = getSøknadsfristForPeriode(periode);
            expect(formatDateToApiFormat(frist)).toEqual('2020-06-03');
        });
        it('returns june 30. for may period', () => {
            const periode: DateRange = {
                from: apiStringDateToDate('2020-05-1'),
                to: apiStringDateToDate('2020-05-31'),
            };
            const frist = getSøknadsfristForPeriode(periode);
            expect(formatDateToApiFormat(frist)).toEqual('2020-06-30');
        });
        it('returns august 7. for june period', () => {
            const periode: DateRange = {
                from: apiStringDateToDate('2020-06-1'),
                to: apiStringDateToDate('2020-06-30'),
            };
            const frist = getSøknadsfristForPeriode(periode);
            expect(formatDateToApiFormat(frist)).toEqual('2020-08-06');
        });
    });
});
