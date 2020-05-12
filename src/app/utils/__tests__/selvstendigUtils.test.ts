import { PersonligeForetak } from '../../types/SoknadEssentials';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    selvstendigSkalOppgiInntekt2019,
    selvstendigSkalOppgiInntekt2020,
    hasValidHistoriskInntekt,
    getHistoriskInntektÅrstall,
    harSelskaperRegistrertFør2018,
} from '../selvstendigUtils';

const personligeFortak1998: PersonligeForetak = {
    foretak: [],
    tidligsteRegistreringsdato: apiStringDateToDate('1998-01-01'),
};

const personligeFortak2017: PersonligeForetak = {
    foretak: [],
    tidligsteRegistreringsdato: apiStringDateToDate('2017-12-31'),
};

const personligeFortak2018: PersonligeForetak = {
    foretak: [],
    tidligsteRegistreringsdato: apiStringDateToDate('2018-01-01'),
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
            expect(hasValidHistoriskInntekt({ selvstendigBeregnetInntektsårstall: 2019 })).toBeFalsy();
        });
        it('returns false if year is 2019 and selvstendigInntekt2019 is 0', () => {
            expect(
                hasValidHistoriskInntekt({ selvstendigInntekt2019: 0, selvstendigBeregnetInntektsårstall: 2019 })
            ).toBeFalsy();
        });
        it('returns false if year is 2020 and selvstendigInntekt2019 is 1', () => {
            expect(
                hasValidHistoriskInntekt({ selvstendigInntekt2019: 1, selvstendigBeregnetInntektsårstall: 2020 })
            ).toBeFalsy();
        });
        it('returns true if year is 2019 and selvstendigInntekt2019 is 1', () => {
            expect(
                hasValidHistoriskInntekt({ selvstendigInntekt2019: 1, selvstendigBeregnetInntektsårstall: 2019 })
            ).toBeTruthy();
        });
        it('returns false if year is 2020 and selvstendigInntekt2020 is undefined', () => {
            expect(hasValidHistoriskInntekt({ selvstendigBeregnetInntektsårstall: 2020 })).toBeFalsy();
        });
        it('returns false if year is 2020 and selvstendigInntekt2020 is 0', () => {
            expect(
                hasValidHistoriskInntekt({ selvstendigInntekt2020: 0, selvstendigBeregnetInntektsårstall: 2020 })
            ).toBeFalsy();
        });
        it('returns false if year is 2019 and selvstendigInntekt2020 is 1', () => {
            expect(
                hasValidHistoriskInntekt({ selvstendigInntekt2020: 1, selvstendigBeregnetInntektsårstall: 2019 })
            ).toBeFalsy();
        });
        it('returns true if year is 2020 and selvstendigInntekt2020 is 1', () => {
            expect(
                hasValidHistoriskInntekt({ selvstendigInntekt2020: 1, selvstendigBeregnetInntektsårstall: 2020 })
            ).toBeTruthy();
        });
    });

    describe('harSelskaperRegistrertFør2018', () => {
        it('returns false if personligeForetak is undefined', () => {
            expect(harSelskaperRegistrertFør2018(undefined)).toBeFalsy();
        });
        it('returns false if personligeForetak is 2018, 2019 or 2020', () => {
            expect(harSelskaperRegistrertFør2018(personligeFortak2018)).toBeFalsy();
            expect(harSelskaperRegistrertFør2018(personligeFortak2019)).toBeFalsy();
            expect(harSelskaperRegistrertFør2018(personligeFortak2020)).toBeFalsy();
        });
        it('returns true if personligeForetak is 2017 or earlier', () => {
            expect(harSelskaperRegistrertFør2018(personligeFortak2017)).toBeTruthy();
            expect(harSelskaperRegistrertFør2018(personligeFortak1998)).toBeTruthy();
        });
    });

    describe('finn årstall som skal brukes for historisk inntekt', () => {
        describe('når det er ingen historiske selskaper', () => {
            it('returneres 2019, dersom første registreringdato er før 2019', () => {
                expect(getHistoriskInntektÅrstall(personligeFortak1998)).toEqual(2019);
                expect(getHistoriskInntektÅrstall(personligeFortak2017)).toEqual(2019);
                expect(getHistoriskInntektÅrstall(personligeFortak2018)).toEqual(2019);
            });
        });
    });
});
