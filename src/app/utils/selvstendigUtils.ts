import { apiStringDateToDate, sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { HistoriskFortak } from '../soknad/selvstendig-step/historisk-foretak';
import { PersonligeForetak } from '../types/SoknadEssentials';
import { SelvstendigFormData } from '../types/SoknadFormData';

export const getFørsteHistoriskeRegistreringsdato = (
    foretak: HistoriskFortak[] | undefined,
    førsteRegistreringsdato: Date
): Date | undefined => {
    if (foretak === undefined || foretak.length === 0) {
        return undefined;
    }
    return foretak
        .filter((f) =>
            moment(f.avsluttetDato).isBetween(
                moment(apiStringDateToDate('2018-01-01')),
                moment(førsteRegistreringsdato),
                'day',
                '(]'
            )
        )
        .map((f) => ({ ...f, fom: f.opprettetDato }))
        .sort(sortItemsByFom)[0].opprettetDato;
};

export const selvstendigSkalOppgiInntekt2019 = (
    personligeForetak: PersonligeForetak | undefined,
    historiskeForetak?: HistoriskFortak[]
): boolean => {
    if (!personligeForetak) {
        return false;
    }
    const { tidligsteRegistreringsdato } = personligeForetak;
    return moment(tidligsteRegistreringsdato).isBefore(new Date(2020, 0, 1), 'day');
};

export const selvstendigSkalOppgiInntekt2020 = (
    personligeForetak: PersonligeForetak | undefined,
    historiskeForetak?: HistoriskFortak[]
): boolean => {
    if (!personligeForetak) {
        return false;
    }
    const { tidligsteRegistreringsdato } = personligeForetak;
    return moment(tidligsteRegistreringsdato).isSameOrAfter(new Date(2020, 0, 1), 'day');
};

export const getHistoriskInntektÅrstall = (
    personligeForetak: PersonligeForetak | undefined,
    historiskeForetak?: HistoriskFortak[]
): number => {
    return selvstendigSkalOppgiInntekt2019(personligeForetak, historiskeForetak) === true ? 2019 : 2020;
};

export const hasValidHistoriskInntekt = (
    { selvstendigInntekt2019, selvstendigInntekt2020 }: Partial<SelvstendigFormData>,
    inntektÅrstall: number
): boolean => {
    if (inntektÅrstall === 2020) {
        return selvstendigInntekt2020 !== undefined && selvstendigInntekt2020 > 0;
    }
    return selvstendigInntekt2019 !== undefined && selvstendigInntekt2019 > 0;
};

export const harSelskaperRegistrertFør2018 = (personligeForetak?: PersonligeForetak): boolean => {
    if (personligeForetak) {
        return moment(personligeForetak.tidligsteRegistreringsdato).isBefore(apiStringDateToDate('2018-01-01'), 'year');
    }
    return false;
};
