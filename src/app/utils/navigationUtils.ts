import { History } from 'history';
import routeConfig from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';

const loginUrl = getEnvironmentVariable('LOGIN_URL');

export const redirectTo = (route: string) => window.location.assign(route);
export const navigateTo = (route: string, history: History) => history.push(route);
// export const navigateToWelcomePage = () => window.location.assign(getRouteUrl(routeConfig.WELCOMING_PAGE_ROUTE));
export const navigateToApplication = () => window.location.assign(routeConfig.APPLICATION);
export const navigateToLoginPage = () => window.location.assign(loginUrl);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR);
export const navigateToApplicationErrorPage = (history: History) => history.push(routeConfig.APPLICATION_ERROR);
// export const userIsCurrentlyOnErrorPage = () => window.location.pathname === getRouteUrl(routeConfig.ERROR_PAGE_ROUTE);
