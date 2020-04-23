import { StepConfigInterface, StepID } from '../soknad/stepConfig';
import GlobalRoutes from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';

export const getRouteUrl = (route: GlobalRoutes): string => `${getEnvironmentVariable('PUBLIC_PATH')}${route}`;

export const getSoknadRoute = (stepId: StepID | undefined): string => {
    return `${GlobalRoutes.SOKNAD}/${stepId}`;
};

export const getNextStepRoute = (stepId: StepID, stepConfig: StepConfigInterface): string | undefined => {
    return stepConfig[stepId] ? getSoknadRoute(stepConfig[stepId].nextStep) : undefined;
};
