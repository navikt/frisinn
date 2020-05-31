import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { getSisteGyldigeDagForInntektstapIPeriode } from './dateUtils';

export const DATO_SØKNADSFRIST_FØRSTE_PERIODE = apiStringDateToDate('2020-05-03');

const datoErEtterSøknadfristFørstePeriode = (dato: Date) =>
    moment(dato).isAfter(DATO_SØKNADSFRIST_FØRSTE_PERIODE, 'day');

const getErÅpnetForAndregangssøknad = (søknadsperiode: DateRange): boolean => {
    return datoErEtterSøknadfristFørstePeriode(søknadsperiode.from);
};

const getSkalSpørreOmArbeidstakerinntekt = (søknadsperiode: DateRange) => {
    return datoErEtterSøknadfristFørstePeriode(søknadsperiode.from);
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
