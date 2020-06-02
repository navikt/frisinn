import { erSøknadStartetTidspunktErGyldig } from '../startetSøknadTidspunktUtils';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

describe('erSøknadStartetTidspunktErGyldig', () => {
    const startedDay: Date = apiStringDateToDate('2020-02-04');
    const sameDay: Date = apiStringDateToDate('2020-02-04');
    const oneDayAfter: Date = apiStringDateToDate('2020-02-05');
    const twoDaysAfter: Date = apiStringDateToDate('2020-02-06');

    it('returns true when starteSøknadTidspunkt is same day', () => {
        expect(erSøknadStartetTidspunktErGyldig(startedDay, sameDay.toISOString())).toBeTruthy();
    });
    it('returns true when starteSøknadTidspunkt is yesterday', () => {
        expect(erSøknadStartetTidspunktErGyldig(startedDay, oneDayAfter.toISOString())).toBeTruthy();
    });
    it('returns false when starteSøknadTidspunkt is pre yesterday', () => {
        expect(erSøknadStartetTidspunktErGyldig(startedDay, twoDaysAfter.toISOString())).toBeFalsy();
    });
});
