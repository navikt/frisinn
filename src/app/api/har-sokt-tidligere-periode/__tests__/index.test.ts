import { getHarSoktTidligerePeriode } from '..';
import { DateRange, apiStringDateToDate } from '../../../utils/dateUtils';
import { TidligerePerioder } from '../../../types/SoknadEssentials';
import { isFeatureEnabled, Feature } from '../../../utils/featureToggleUtils';
import { erÅpnetForAndregangssøknad } from '../../../utils/soknadsperiodeUtils';

jest.mock('../../../utils/envUtils', () => ({
    isRunningInDevEnvironment: () => true,
    getEnvironmentVariable: () => 'env',
}));

jest.mock('../../../utils/featureToggleUtils', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {
        ANDREGANGSSOKNAD: 'off',
    },
}));

jest.mock('../../../utils/soknadsperiodeUtils', () => ({
    erÅpnetForAndregangssøknad: jest.fn(),
}));

describe('getHarSoktTidligerePeriode', () => {
    beforeAll(() => {
        (isFeatureEnabled as any).mockImplementation(() => true);
        (erÅpnetForAndregangssøknad as any).mockImplementation(() => true);
    });
    it(`skips request and returns false on both checks if feature toggle ${Feature.ANDREGANGSSOKNAD} is off`, () => {
        (isFeatureEnabled as any).mockImplementation(() => false);
        const søknadsperiode: DateRange = {
            from: apiStringDateToDate('2020-05-01'),
            to: apiStringDateToDate('2020-05-31'),
        };
        const expectedResult: TidligerePerioder = {
            harSøktSomFrilanser: false,
            harSøktSomSelvstendigNæringsdrivende: false,
        };
        expect.assertions(1);
        return getHarSoktTidligerePeriode(søknadsperiode).then((result) => expect(result).toEqual(expectedResult));
    });
    it('skips request and returns false on both checks if erÅpnetForAndregangssøknad returns false', () => {
        (isFeatureEnabled as any).mockImplementation(() => true);
        (erÅpnetForAndregangssøknad as any).mockImplementation(() => false);
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
