import { getHarSoktTidligerePeriode } from '..';
import { DateRange, apiStringDateToDate } from '../../../utils/dateUtils';
import { TidligerePerioder } from '../../../types/SoknadEssentials';

jest.mock('../../../utils/envUtils', () => ({
    isRunningInDevEnvironment: () => true,
    getEnvironmentVariable: () => 'env',
}));

jest.mock('../../../utils/søknadsperioden', () => () => ({
    erÅpnetForAndregangssøknad: false,
}));

describe('getHarSoktTidligerePeriode', () => {
    it('skips request and returns false if erÅpnetForAndregangssøknad returns false', () => {
        const søknadsperiode: DateRange = {
            from: apiStringDateToDate('2020-03-14'),
            to: apiStringDateToDate('2020-04-30'),
        };
        const expectedResult: TidligerePerioder = {
            harSøktSomFrilanser: false,
            harSøktSomSelvstendigNæringsdrivende: false,
        };
        expect.assertions(1);
        return getHarSoktTidligerePeriode(søknadsperiode).then((result) => expect(result).toEqual(expectedResult));
    });
});
