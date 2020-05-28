import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { isFeatureEnabled, Feature } from './featureToggleUtils';

const datoErEtterMai2020 = (dato: Date) => moment(dato).isAfter(apiStringDateToDate('2020-04-30'), 'day');

const erÅpnetForAndregangssøknad = (søknadsperiode: DateRange): boolean => {
    return isFeatureEnabled(Feature.ANDREGANGSSOKNAD) && datoErEtterMai2020(søknadsperiode.from);
};

const skalSpørreOmArbeidstakerinntekt = (søknadsperiode: DateRange) => {
    return isFeatureEnabled(Feature.ARBEIDSTAKERINNTEKT) && datoErEtterMai2020(søknadsperiode.from);
};

const Søknadsperioden = (søknadsperiode: DateRange) => ({
    erÅpnetForAndregangssøknad: erÅpnetForAndregangssøknad(søknadsperiode),
    arbeidstakerinntektErAktiv: skalSpørreOmArbeidstakerinntekt(søknadsperiode),
});

export default Søknadsperioden;
