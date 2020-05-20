import { formatDateRange } from '../dateRangeUtils';
import { DateRange, apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';

moment.locale('nb');

describe('dateRangeView', () => {
    describe('default formatting', () => {
        it('returns two years when the years are different', () => {
            const dr: DateRange = {
                from: apiStringDateToDate('2010-01-02'),
                to: apiStringDateToDate('2020-01-02'),
            };
            expect(formatDateRange(dr)).toEqual('02. januar 2010 - 02. januar 2020');
        });
    });
    describe('expendedFormat === false', () => {
        it('returns two years when the years are different', () => {
            const dr: DateRange = {
                from: apiStringDateToDate('2010-01-02'),
                to: apiStringDateToDate('2020-01-02'),
            };
            expect(formatDateRange(dr, false)).toEqual('02.01.2010 - 02.01.2020');
        });
    });
    describe('when onlyYears === true', () => {
        it('returns two years when the years are different', () => {
            const dr: DateRange = {
                from: apiStringDateToDate('2010-01-02'),
                to: apiStringDateToDate('2020-01-02'),
            };
            expect(formatDateRange(dr, undefined, true)).toEqual('2010 - 2020');
        });
        it('returns one year when the years are equal', () => {
            const dr: DateRange = {
                from: apiStringDateToDate('2020-01-02'),
                to: apiStringDateToDate('2020-01-02'),
            };
            expect(formatDateRange(dr, undefined, true)).toEqual('2020');
        });
    });
});
