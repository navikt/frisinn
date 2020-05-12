import { getHistoriskMaksOpprettetDato, getHistoriskAvsluttetDateRange } from '../historiskForetakUtils';
import { apiStringDateToDate, dateToISOFormattedDateString } from '../../../../utils/dateUtils';

describe('historiskeForetakUtils', () => {
    describe('getHistoriskMaksOpprettetDato', () => {
        it('returns 2020-03-12 if inntektstapStartDatedDate is after that date', () => {
            const inntektstapStartDate = apiStringDateToDate('2020-04-02');
            const date = getHistoriskMaksOpprettetDato(inntektstapStartDate);
            expect(dateToISOFormattedDateString(date)).toEqual('2020-03-12');
        });
        it('returns inntektstapStartDatedDate - 1 day if the date is before 2020-03-12', () => {
            const inntektstapStartDate = apiStringDateToDate('2020-02-02');
            const date = getHistoriskMaksOpprettetDato(inntektstapStartDate);
            expect(dateToISOFormattedDateString(date)).toEqual('2020-02-01');
        });
    });
    describe('getHistoriskAvsluttetDateRange', () => {
        it('returns 2019-01-01 as minDate if opprettetDate is undefined', () => {
            const inntektstapStartDate = apiStringDateToDate('2020-04-02');
            const range = getHistoriskAvsluttetDateRange(inntektstapStartDate, undefined);
            expect(dateToISOFormattedDateString(range.from)).toEqual('2019-01-01');
        });
        it('returns 2019-01-01 as minDate if opprettetDate is before 2019-01-01', () => {
            const inntektstapStartDate = apiStringDateToDate('2020-04-02');
            const opprettetDate = apiStringDateToDate('2005-04-02');
            const range = getHistoriskAvsluttetDateRange(inntektstapStartDate, opprettetDate);
            expect(dateToISOFormattedDateString(range.from)).toEqual('2019-01-01');
        });
        it('returns 2020-03-12 as maxDate if inntektstapStartDate is after 2020-03-12', () => {
            const inntektstapStartDate = apiStringDateToDate('2020-04-02');
            const range = getHistoriskAvsluttetDateRange(inntektstapStartDate, undefined);
            expect(dateToISOFormattedDateString(range.to)).toEqual('2020-03-12');
        });
        it('returns inntektstapStartDate -1 if inntektstapStartDate is before 2020-03-12', () => {
            const inntektstapStartDate = apiStringDateToDate('2020-01-02');
            const range = getHistoriskAvsluttetDateRange(inntektstapStartDate, undefined);
            expect(dateToISOFormattedDateString(range.to)).toEqual('2020-01-01');
        });
    });
});
