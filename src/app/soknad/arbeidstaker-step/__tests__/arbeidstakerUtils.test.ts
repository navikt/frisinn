import { getInntektsperiodeForArbeidsinntekt, GetInntektsperiodeForArbeidsinntektPayload } from '../arbeidstakerUtils';
import { DateRange, apiStringDateToDate } from '../../../utils/dateUtils';
import { SoknadFormField } from '../../../types/SoknadFormData';

const selvstendigDateRange: DateRange = {
    from: apiStringDateToDate('2020-04-04'),
    to: apiStringDateToDate('2020-04-05'),
};
const frilansDateRange: DateRange = {
    from: apiStringDateToDate('2020-03-04'),
    to: apiStringDateToDate('2020-04-12'),
};
describe('arbeidstakerUtils', () => {
    const validPayload: GetInntektsperiodeForArbeidsinntektPayload = {
        selvstendigSoknadIsOk: true,
        frilanserSoknadIsOk: true,
        selvstendigBeregnetTilgjengeligSøknadsperiode: selvstendigDateRange,
        frilanserBeregnetTilgjengeligSøknadsperiode: frilansDateRange,
    };

    it('returns undefined if not enough values are provided', () => {
        const emptyPayload: GetInntektsperiodeForArbeidsinntektPayload = {
            selvstendigSoknadIsOk: false,
            frilanserSoknadIsOk: false,
            selvstendigBeregnetTilgjengeligSøknadsperiode: undefined,
            frilanserBeregnetTilgjengeligSøknadsperiode: undefined,
        };
        expect(getInntektsperiodeForArbeidsinntekt(emptyPayload)).toBeUndefined();
        expect(
            getInntektsperiodeForArbeidsinntekt({
                ...validPayload,
                selvstendigSoknadIsOk: false,
                frilanserSoknadIsOk: false,
            })
        ).toBeUndefined();

        expect(
            getInntektsperiodeForArbeidsinntekt({
                ...validPayload,
                selvstendigBeregnetTilgjengeligSøknadsperiode: undefined,
                frilanserBeregnetTilgjengeligSøknadsperiode: undefined,
            })
        ).toBeUndefined();
    });

    it(`returns ${SoknadFormField.selvstendigBeregnetInntektsårstall} if frilansinfo is not ok`, () => {
        const result = getInntektsperiodeForArbeidsinntekt({ ...validPayload, frilanserSoknadIsOk: false });
        expect(JSON.stringify(result)).toEqual(JSON.stringify(selvstendigDateRange));
    });
    it(`returns ${SoknadFormField.frilanserBeregnetTilgjengeligSøknadsperiode} if selvstendig info is not ok`, () => {
        const result = getInntektsperiodeForArbeidsinntekt({ ...validPayload, selvstendigSoknadIsOk: false });
        expect(JSON.stringify(result)).toEqual(JSON.stringify(frilansDateRange));
    });
    it(`returns min and max from selvstendig and frilans if both are ok - frilans has both min and max`, () => {
        const result = getInntektsperiodeForArbeidsinntekt({ ...validPayload });
        const expectedResult: DateRange = {
            from: frilansDateRange.from,
            to: frilansDateRange.to,
        };
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
    it(`returns min and max from selvstendig and frilans if both are ok - frilans has both min and max`, () => {
        const newMinDate = apiStringDateToDate('2020-03-01');
        const result = getInntektsperiodeForArbeidsinntekt({
            ...validPayload,
            selvstendigBeregnetTilgjengeligSøknadsperiode: {
                ...selvstendigDateRange,
                from: newMinDate,
            },
        });
        const expectedResult: DateRange = {
            from: newMinDate,
            to: frilansDateRange.to,
        };
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
});
