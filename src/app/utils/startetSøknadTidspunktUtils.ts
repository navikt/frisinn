import moment from 'moment';

export const erSøknadStartetTidspunktErGyldig = (startetSøknad: Date, nowUtcString: string): boolean => {
    const date = moment.utc(nowUtcString).toDate();
    if (moment(startetSøknad).isSameOrAfter(moment(date).subtract(1, 'day').startOf('day'), 'day')) {
        return true;
    }
    return false;
};
