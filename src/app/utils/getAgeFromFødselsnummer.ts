import moment from 'moment';

export function getAgeFromFødselsnummer(fnr: string) {
    const date = parseInt(fnr.substr(0, 2), 10);
    const month = parseInt(fnr.substr(2, 2), 10);
    const year = parseInt(fnr.substr(4, 2), 10);

    return moment().diff(new Date(year, month - 1, date), 'years');
}
