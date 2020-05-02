import { History } from 'history';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';
import GlobalRoutes from '../config/routeConfig';

const loginUrl = getEnvironmentVariable('LOGIN_URL');

export const relocateToLoginPage = () => window.location.assign(loginUrl);
export const relocateToNavFrontpage = () => window.location.assign('https://www.nav.no/');
export const relocateToReceiptPage = () => window.location.assign(getRouteUrl(routeConfig.SOKNAD_SENT));
export const relocateToSoknad = () => window.location.assign(getRouteUrl(routeConfig.SOKNAD));
export const relocateToNoOpenPage = () => window.location.assign(getRouteUrl(routeConfig.NOT_OPEN));
export const relocateToErrorPage = () => window.location.assign(getRouteUrl(routeConfig.ERROR));

export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToSoknadFrontpage = (history: History) => history.push(GlobalRoutes.SOKNAD);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR);
