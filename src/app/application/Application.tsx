import React from 'react';
import IkkeMyndigPage from '../components/pages/ikke-myndig-page/IkkeMyndigPage';
import { initialApplicationValues } from '../types/ApplicationFormData';
import ApplicationEssentialsLoader from './ApplicationEssentialsLoader';
import ApplicationFormComponents from './ApplicationFormComponents';
import ApplicationRoutes from './ApplicationRoutes';

const Application = () => (
    <ApplicationEssentialsLoader
        contentLoadedRenderer={(søkerdata) => {
            if (søkerdata) {
                const { person } = søkerdata;
                if (!person.myndig) {
                    return <IkkeMyndigPage />;
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
