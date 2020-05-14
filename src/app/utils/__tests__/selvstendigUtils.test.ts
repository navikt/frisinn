import { hasValidHistoriskInntekt, harSelskaperRegistrertFør2018 } from '../selvstendigUtils';
import { PersonligeForetakMock as pf } from '../../__mock__/personligeForetakMock';

describe('selvstendigUtils', () => {
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
        it('returns false if personligeForetak is 2019 or 2020', () => {
            expect(harSelskaperRegistrertFør2018(pf.personligeFortak2018)).toBeFalsy();
            expect(harSelskaperRegistrertFør2018(pf.personligeFortak2019)).toBeFalsy();
            expect(harSelskaperRegistrertFør2018(pf.personligeFortak2020)).toBeFalsy();
        });
        it('returns true if personligeForetak is 2017 or earlier', () => {
            expect(harSelskaperRegistrertFør2018(pf.personligeFortak2017)).toBeTruthy();
            expect(harSelskaperRegistrertFør2018(pf.personligeFortak1998)).toBeTruthy();
        });
    });
});
