import { History } from 'history';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';

const loginUrl = getEnvironmentVariable('LOGIN_URL');

export const navigateToLoginPage = () => window.location.assign(loginUrl);
export const navigateToNavFrontpage = () => window.location.assign('https://www.nav.no/');
export const navigateToConfirmationPage = () => window.location.assign(getRouteUrl(routeConfig.APPLICATION_SENT));
export const redirectTo = (route: string) => window.location.assign(route);
export const navigateToApplication = () => window.location.assign(getRouteUrl(routeConfig.APPLICATION));

export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR);
