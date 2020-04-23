import moment from 'moment';
import { PersonligeForetak } from '../types/SoknadEssentials';

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
