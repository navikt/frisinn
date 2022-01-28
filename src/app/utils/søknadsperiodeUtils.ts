import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { Søknadsperiodeinfo } from '../types/SoknadEssentials';
import { getSisteGyldigeDagForInntektstapIPeriode, getSøknadsfristForPeriode } from './dateUtils';

export const ytelseErForlengetUt2022 = true;

const SISTE_SØKNADSPERIODE: DateRange = ytelseErForlengetUt2022
    ? {
          from: new Date(2022, 2, 1),
          to: new Date(2022, 2, 31),
      }
    : {
          from: new Date(2021, 8, 1),
          to: new Date(2021, 8, 30),
      };

const getErÅpnetForAndregangssøknad = (søknadsperiode: DateRange): boolean => {
    return søknadsperiode.to.getMonth() >= 4 || søknadsperiode.to.getFullYear() >= 2021;
};

const getFørsteUgyldigeStartdatoForInntektstap = (søknadsperiode: DateRange): Date => {
    return moment(getSisteGyldigeDagForInntektstapIPeriode(søknadsperiode)).add(1, 'day').toDate();
};

export const getSøknadsperiodeinfo = (søknadsperiode: DateRange): Søknadsperiodeinfo => {
    const erISisteSøknadsperiode =
        moment(søknadsperiode.from).isSameOrAfter(SISTE_SØKNADSPERIODE.from, 'day') &&
        moment(søknadsperiode.to).isSameOrBefore(SISTE_SØKNADSPERIODE.to, 'day');
    return {
        søknadsperiode,
        søknadsfrist: getSøknadsfristForPeriode(søknadsperiode),
        erÅpnetForAndregangssøknad: getErÅpnetForAndregangssøknad(søknadsperiode),
        arbeidstakerinntektErAktiv: true,
        sisteGyldigeDagForInntektstap: getSisteGyldigeDagForInntektstapIPeriode(søknadsperiode),
        førsteUgyldigeStartdatoForInntektstap: getFørsteUgyldigeStartdatoForInntektstap(søknadsperiode),
        erISisteSøknadsperiode,
    };
};
