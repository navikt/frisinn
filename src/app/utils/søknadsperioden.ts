import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { getSisteGyldigeDagForInntektstapIPeriode } from './dateUtils';
import { Feature, isFeatureEnabled } from './featureToggleUtils';

const datoErEtterMai2020 = (dato: Date) => moment(dato).isAfter(apiStringDateToDate('2020-04-30'), 'day');

const getErÅpnetForAndregangssøknad = (søknadsperiode: DateRange): boolean => {
    return isFeatureEnabled(Feature.ANDREGANGSSOKNAD) && datoErEtterMai2020(søknadsperiode.from);
};

const getSkalSpørreOmArbeidstakerinntekt = (søknadsperiode: DateRange) => {
    return isFeatureEnabled(Feature.ARBEIDSTAKERINNTEKT) && datoErEtterMai2020(søknadsperiode.from);
};

const getFørsteUgyldigeStartdatoForInntektstap = (søknadsperiode: DateRange): Date => {
    return moment(getSisteGyldigeDagForInntektstapIPeriode(søknadsperiode)).add(1, 'day').toDate();
};

const Søknadsperioden = (søknadsperiode: DateRange) => ({
    erÅpnetForAndregangssøknad: getErÅpnetForAndregangssøknad(søknadsperiode),
    arbeidstakerinntektErAktiv: getSkalSpørreOmArbeidstakerinntekt(søknadsperiode),
    sisteGyldigeDagForInntektstap: getSisteGyldigeDagForInntektstapIPeriode(søknadsperiode),
    førsteUgyldigeStartdatoForInntektstap: getFørsteUgyldigeStartdatoForInntektstap(søknadsperiode),
});

export default Søknadsperioden;
