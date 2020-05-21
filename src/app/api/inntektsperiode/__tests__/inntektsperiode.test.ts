import { InntektsperiodeApiResponse } from '..';
import { parseInntektsperiodeApiResponse } from '../inntektsperiodeUtils';

const responseHele2019: InntektsperiodeApiResponse = {
    inntektsperiode: {
        fom: '2019-01-01',
        tom: '2019-12-31',
    },
};
const responseDelerAv2019: InntektsperiodeApiResponse = {
    inntektsperiode: {
        fom: '2019-05-01',
        tom: '2019-12-31',
    },
};
const response2020: InntektsperiodeApiResponse = {
    inntektsperiode: {
        fom: '2020-01-01',
        tom: '2020-02-01',
    },
};

describe('parseInntektsperiodeApiResponse', () => {
    it('parses correctly responseHele2019', () => {
        expect(parseInntektsperiodeApiResponse(responseHele2019)?.inntektsårstall).toEqual(2019);
    });
    it('parses correctly responseDelerAv2019', () => {
        expect(parseInntektsperiodeApiResponse(responseDelerAv2019)?.inntektsårstall).toEqual(2019);
    });
    it('parses correctly response2020', () => {
        expect(parseInntektsperiodeApiResponse(response2020)?.inntektsårstall).toEqual(2020);
    });
});
