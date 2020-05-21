import { Inntektsperiode, InntektsperiodeApiResponse } from '.';
import { isHistoriskInntektÅrstall } from '../../types/HistoriskInntektÅrstall';

export const parseInntektsperiodeApiResponse = (respons: InntektsperiodeApiResponse): Inntektsperiode | undefined => {
    const { fom } = respons.inntektsperiode;
    const splits = fom.split('-');
    if (splits.length === 3) {
        const inntektsårstall = parseInt(splits[0], 10);
        if (isHistoriskInntektÅrstall(inntektsårstall)) {
            const inntektsperiode: Inntektsperiode = {
                inntektsårstall,
            };
            return inntektsperiode;
        }
    }
    return undefined;
};
