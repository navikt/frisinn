import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    getSisteGyldigeDagForInntektstapIPeriode,
    getSøknadsfristForPeriode,
    erÅpnetForAndregangssøknad,
} from '../dateUtils';

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

    describe('getSøknadsfristForPeriode', () => {
        it('returns may 31. for march/april period', () => {
            const periode: DateRange = {
                from: apiStringDateToDate('2020-03-14'),
                to: apiStringDateToDate('2020-04-30'),
            };
            const frist = getSøknadsfristForPeriode(periode);
            expect(formatDateToApiFormat(frist)).toEqual('2020-05-31');
        });
        it('returns june 30. for may period', () => {
            const periode: DateRange = {
                from: apiStringDateToDate('2020-05-1'),
                to: apiStringDateToDate('2020-05-31'),
            };
            const frist = getSøknadsfristForPeriode(periode);
            expect(formatDateToApiFormat(frist)).toEqual('2020-06-30');
        });
    });

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
});
