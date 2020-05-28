import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { PersonligeForetak, TidligerePerioder } from '../types/SoknadEssentials';
import { SelvstendigFormData } from '../types/SoknadFormData';

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

export const isSelvstendigNæringsdrivende = (
    personligeForetak: PersonligeForetak | undefined,
    tidligerePerioder: TidligerePerioder
): boolean => {
    return (
        (personligeForetak !== undefined && personligeForetak.foretak.length > 0) ||
        tidligerePerioder.harSøktSomSelvstendigNæringsdrivende
    );
};
