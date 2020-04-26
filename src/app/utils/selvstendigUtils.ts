import moment from 'moment';
import { PersonligeForetak } from '../types/SoknadEssentials';
import { SelvstendigFormData } from '../types/SoknadFormData';

export const selvstendigSkalOppgiInntekt2019 = (registrerteForetakInfo: PersonligeForetak | undefined): boolean => {
    if (!registrerteForetakInfo) {
        return false;
    }
    const { tidligsteRegistreringsdato } = registrerteForetakInfo;
    return moment(tidligsteRegistreringsdato).isBefore(new Date(2020, 0, 1), 'day');
};

export const selvstendigSkalOppgiInntekt2020 = (registrerteForetakInfo: PersonligeForetak | undefined): boolean => {
    if (!registrerteForetakInfo) {
        return false;
    }
    const { tidligsteRegistreringsdato } = registrerteForetakInfo;
    return moment(tidligsteRegistreringsdato).isSameOrAfter(new Date(2020, 0, 1), 'day');
};

export const hasValidHistoriskInntekt = (
    { selvstendigInntekt2019, selvstendigInntekt2020 }: Partial<SelvstendigFormData>,
    inntektÅrstall: number
): boolean => {
    if (inntektÅrstall === 2019) {
        return selvstendigInntekt2019 !== undefined && selvstendigInntekt2019 > 0;
    }
    return selvstendigInntekt2020 !== undefined && selvstendigInntekt2020 > 0;
};
