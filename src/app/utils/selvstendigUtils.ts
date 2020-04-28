import moment from 'moment';
import { PersonligeForetak } from '../types/SoknadEssentials';
import { SelvstendigFormData } from '../types/SoknadFormData';

export const selvstendigSkalOppgiInntekt2019 = (personligeForetak: PersonligeForetak | undefined): boolean => {
    if (!personligeForetak) {
        return false;
    }
    const { tidligsteRegistreringsdato } = personligeForetak;
    return moment(tidligsteRegistreringsdato).isBefore(new Date(2020, 0, 1), 'day');
};

export const selvstendigSkalOppgiInntekt2020 = (personligeForetak: PersonligeForetak | undefined): boolean => {
    if (!personligeForetak) {
        return false;
    }
    const { tidligsteRegistreringsdato } = personligeForetak;
    return moment(tidligsteRegistreringsdato).isSameOrAfter(new Date(2020, 0, 1), 'day');
};

export const hasValidHistoriskInntekt = (
    { selvstendigInntekt2019, selvstendigInntekt2020 }: Partial<SelvstendigFormData>,
    inntektÅrstall: number
): boolean => {
    if (inntektÅrstall === 2019) {
        return selvstendigInntekt2019 !== undefined && selvstendigInntekt2019 > 0;
    }
    if (inntektÅrstall === 2020) {
        return selvstendigInntekt2020 !== undefined && selvstendigInntekt2020 > 0;
    }
    return false;
};
