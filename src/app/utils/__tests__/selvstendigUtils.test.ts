import { PersonligeForetak } from '../../types/SoknadEssentials';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    selvstendigSkalOppgiInntekt2019,
    selvstendigSkalOppgiInntekt2020,
    hasValidHistoriskInntekt,
} from '../selvstendigUtils';

const personligeFortak1998: PersonligeForetak = {
    foretak: [],
    tidligsteRegistreringsdato: apiStringDateToDate('1998-01-01'),
};

const personligeFortak2019: PersonligeForetak = {
    foretak: [],
    tidligsteRegistreringsdato: apiStringDateToDate('2019-01-01'),
};

const personligeFortak2020: PersonligeForetak = {
    foretak: [],
    tidligsteRegistreringsdato: apiStringDateToDate('2020-01-01'),
};

describe('selvstendigUtils', () => {
    describe('selvstendigSkalOppgiInntekt2019', () => {
        it('returns false if object is empty', () => {
            expect(selvstendigSkalOppgiInntekt2019(undefined)).toBeFalsy();
        });
        it('returns false if foretak is registered in 2020', () => {
            expect(selvstendigSkalOppgiInntekt2019(personligeFortak2020)).toBeFalsy();
        });
        it('returns true if foretak is registered in 2019', () => {
            expect(selvstendigSkalOppgiInntekt2019(personligeFortak2019)).toBeTruthy();
        });
        it('returns true if foretak is registered before 2019', () => {
            expect(selvstendigSkalOppgiInntekt2019(personligeFortak1998)).toBeTruthy();
        });
    });
    describe('selvstendigSkalOppgiInntekt2020', () => {
        it('returns false if object is empty', () => {
            expect(selvstendigSkalOppgiInntekt2020(undefined)).toBeFalsy();
        });
        it('returns true if foretak is registered in 2020', () => {
            expect(selvstendigSkalOppgiInntekt2020(personligeFortak2020)).toBeTruthy();
        });
        it('returns false if foretak is registered in 2019', () => {
            expect(selvstendigSkalOppgiInntekt2020(personligeFortak2019)).toBeFalsy();
        });
        it('returns false if foretak is registered before 2019', () => {
            expect(selvstendigSkalOppgiInntekt2020(personligeFortak1998)).toBeFalsy();
        });
    });
    describe('hasValidHistoriskInntekt', () => {
        it('returns false if year is 2019 and selvstendigInntekt2019 is undefined', () => {
            expect(hasValidHistoriskInntekt({}, 2019)).toBeFalsy();
        });
        it('returns false if year is 2019 and selvstendigInntekt2019 is 0', () => {
            expect(hasValidHistoriskInntekt({ selvstendigInntekt2019: 0 }, 2019)).toBeFalsy();
        });
        it('returns false if year is 2020 and selvstendigInntekt2019 is 1', () => {
            expect(hasValidHistoriskInntekt({ selvstendigInntekt2019: 1 }, 2020)).toBeFalsy();
        });
        it('returns true if year is 2019 and selvstendigInntekt2019 is 1', () => {
            expect(hasValidHistoriskInntekt({ selvstendigInntekt2019: 1 }, 2019)).toBeTruthy();
        });
        it('returns false if year is 2020 and selvstendigInntekt2020 is undefined', () => {
            expect(hasValidHistoriskInntekt({}, 2020)).toBeFalsy();
        });
        it('returns false if year is 2020 and selvstendigInntekt2020 is 0', () => {
            expect(hasValidHistoriskInntekt({ selvstendigInntekt2020: 0 }, 2020)).toBeFalsy();
        });
        it('returns false if year is 2019 and selvstendigInntekt2020 is 1', () => {
            expect(hasValidHistoriskInntekt({ selvstendigInntekt2020: 1 }, 2019)).toBeFalsy();
        });
        it('returns true if year is 2020 and selvstendigInntekt2020 is 1', () => {
            expect(hasValidHistoriskInntekt({ selvstendigInntekt2020: 1 }, 2020)).toBeTruthy();
        });
    });
});
