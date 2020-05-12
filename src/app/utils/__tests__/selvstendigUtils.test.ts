import { PersonligeForetak } from '../../types/SoknadEssentials';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { hasValidHistoriskInntekt, harSelskaperRegistrertFør2019 } from '../selvstendigUtils';

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
            expect(harSelskaperRegistrertFør2019(undefined)).toBeFalsy();
        });
        it('returns false if personligeForetak is 2019 or 2020', () => {
            expect(harSelskaperRegistrertFør2019(personligeFortak2019)).toBeFalsy();
            expect(harSelskaperRegistrertFør2019(personligeFortak2020)).toBeFalsy();
        });
        it('returns true if personligeForetak is 2018 or earlier', () => {
            expect(harSelskaperRegistrertFør2019(personligeFortak2017)).toBeTruthy();
            expect(harSelskaperRegistrertFør2019(personligeFortak2018)).toBeTruthy();
            expect(harSelskaperRegistrertFør2019(personligeFortak1998)).toBeTruthy();
        });
    });
});
