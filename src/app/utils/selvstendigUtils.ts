import { apiStringDateToDate, sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { HistoriskFortak } from '../soknad/selvstendig-step/historisk-foretak';
import { PersonligeForetak } from '../types/SoknadEssentials';
import { SelvstendigFormData } from '../types/SoknadFormData';
import { HistoriskInntektÅrstall } from '../types/inntektÅrstall';

export const getStartetSomSelvstendigNæringsdrivendeDato = (
    foretak: HistoriskFortak[] | undefined,
    førsteRegistreringsdato: Date
): Date => {
    const førsteHistoriskeDato =
        foretak && foretak.length > 0
            ? foretak.map((f) => ({ ...f, fom: f.opprettetDato })).sort(sortItemsByFom)[0].opprettetDato
            : undefined;

    if (førsteHistoriskeDato) return moment.min(moment(førsteHistoriskeDato), moment(førsteRegistreringsdato)).toDate();
    return førsteRegistreringsdato;
};

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

export const getHistoriskInntektÅrstall = (
    personligeForetak: PersonligeForetak | undefined
): HistoriskInntektÅrstall => {
    return selvstendigSkalOppgiInntekt2019(personligeForetak) === true ? 2019 : 2020;
};

export const hasValidHistoriskInntekt = ({
    selvstendigBeregnetInntektsårstall,
    selvstendigInntekt2019,
    selvstendigInntekt2020,
}: Partial<SelvstendigFormData>): boolean => {
    if (selvstendigBeregnetInntektsårstall === 2020) {
        return selvstendigInntekt2020 !== undefined && selvstendigInntekt2020 > 0;
    }
    return selvstendigInntekt2019 !== undefined && selvstendigInntekt2019 > 0;
};

export const harSelskaperRegistrertFør2019 = (personligeForetak?: PersonligeForetak): boolean => {
    if (personligeForetak) {
        return moment(personligeForetak.tidligsteRegistreringsdato).isBefore(apiStringDateToDate('2019-01-01'), 'year');
    }
    return false;
};
