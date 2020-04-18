import { StepConfigInterface, StepID } from '../application/stepConfig';
import GlobalRoutes from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';

export const getRouteUrl = (route: GlobalRoutes): string => `${getEnvironmentVariable('PUBLIC_PATH')}${route}`;

export const getApplicationRoute = (stepId: StepID | undefined): string => {
    return `${GlobalRoutes.APPLICATION}/${stepId}`;
};

export const getNextStepRoute = (stepId: StepID, stepConfig: StepConfigInterface): string | undefined => {
    return stepConfig[stepId] ? getApplicationRoute(stepConfig[stepId].nextStep) : undefined;
};
