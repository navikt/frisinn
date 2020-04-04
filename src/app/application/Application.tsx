import React from 'react';
import { initialApplicationValues } from '../types/ApplicationFormData';
import ApplicationEssentialsLoader from './ApplicationEssentialsLoader';
import ApplicationFormComponents from './ApplicationFormComponents';
import ApplicationRoutes from './ApplicationRoutes';
import CannotUseApplicationPage from '../pages/ikke-tilgang-page/IkkeTilgangPage';
import { isApplicationAvailableForApplicant } from '../utils/accessUtils';

const Application = () => (
    <ApplicationEssentialsLoader
        contentLoadedRenderer={(applicantData) => {
            if (applicantData) {
                if (isApplicationAvailableForApplicant(applicantData) === false) {
                    return <CannotUseApplicationPage />;
                }
            }
            return (
                <ApplicationFormComponents.FormikWrapper
                    initialValues={initialApplicationValues}
                    onSubmit={() => null}
                    renderForm={() => <ApplicationRoutes />}
                />
            );
        }}
    />
);

export default Application;
