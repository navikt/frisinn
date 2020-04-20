import { History } from 'history';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';

const loginUrl = getEnvironmentVariable('LOGIN_URL');

export const relocateToLoginPage = () => window.location.assign(loginUrl);
export const relocateToNavFrontpage = () => window.location.assign('https://www.nav.no/');
export const relocateToConfirmationPage = () => window.location.assign(getRouteUrl(routeConfig.APPLICATION_SENT));
export const relocateToApplication = () => window.location.assign(getRouteUrl(routeConfig.APPLICATION));

export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToApplicationFrontpage = (history: History) => history.push(GlobalRoutes.APPLICATION);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR);
