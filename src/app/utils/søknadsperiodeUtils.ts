import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { Søknadsperiodeinfo } from '../types/SoknadEssentials';
import { getSisteGyldigeDagForInntektstapIPeriode, getSøknadsfristForPeriode } from './dateUtils';

const getErÅpnetForAndregangssøknad = (søknadsperiode: DateRange): boolean => {
    return søknadsperiode.to.getMonth() >= 4 || søknadsperiode.to.getFullYear() >= 2021;
};

const getFørsteUgyldigeStartdatoForInntektstap = (søknadsperiode: DateRange): Date => {
    return moment(getSisteGyldigeDagForInntektstapIPeriode(søknadsperiode)).add(1, 'day').toDate();
};

export const getSøknadsperiodeinfo = (søknadsperiode: DateRange): Søknadsperiodeinfo => ({
    søknadsperiode,
    søknadsfrist: getSøknadsfristForPeriode(søknadsperiode),
    erÅpnetForAndregangssøknad: getErÅpnetForAndregangssøknad(søknadsperiode),
    arbeidstakerinntektErAktiv: true,
    sisteGyldigeDagForInntektstap: getSisteGyldigeDagForInntektstapIPeriode(søknadsperiode),
    førsteUgyldigeStartdatoForInntektstap: getFørsteUgyldigeStartdatoForInntektstap(søknadsperiode),
});
