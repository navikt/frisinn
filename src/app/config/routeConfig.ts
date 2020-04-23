import { getEnvironmentVariable } from 'app/utils/envUtils';

enum GlobalRoutes {
    SYSTEM_UNAVAILABLE = '/utilgjengelig',
    HOME = '/',
    SOKNAD = '/soknad',
    SOKNAD_ERROR = '/soknad/feil',
    SOKNAD_SENT = '/soknad/soknad-sendt',
    ERROR = '/feil',
}

export const getRouteUrl = (route: GlobalRoutes): string => `${getEnvironmentVariable('PUBLIC_PATH')}${route}`;

export default GlobalRoutes;
