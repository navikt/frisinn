import GlobalRoutes from '../config/routeConfig';
import { stepConfig, StepID } from '../application/stepConfig';
import { summaryStepAvailable } from './stepUtils';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { getEnvironmentVariable } from './envUtils';

export const getRouteUrl = (route: GlobalRoutes): string => `${getEnvironmentVariable('PUBLIC_PATH')}${route}`;

export const getApplicationRoute = (stepId: StepID | undefined): string => {
    return `${GlobalRoutes.APPLICATION}/${stepId}`;
};

export const getNextStepRoute = (stepId: StepID): string | undefined => {
    return stepConfig[stepId] ? getApplicationRoute(stepConfig[stepId].nextStep) : undefined;
};

export const isAvailable = (path: StepID | GlobalRoutes, values: ApplicationFormData) => {
    switch (path) {
        case StepID.WELCOME:
            return true;
        case StepID.SUMMARY:
            return summaryStepAvailable(values);
    }

    return true;
};
