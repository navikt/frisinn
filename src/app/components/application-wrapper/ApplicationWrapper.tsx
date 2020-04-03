import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import { Locale } from 'common/types/Locale';
import { ApplicantData } from '../../types/ApplicantData';
import { getEnvironmentVariable } from '../../utils/envUtils';
import IntlProvider from '../intl-provider/IntlProvider';

interface ApplicationWrapperProps {
    søkerdata?: ApplicantData;
    locale: Locale;
    onChangeLocale: (locale: Locale) => void;
}

const ApplicationWrapper: React.FunctionComponent<ApplicationWrapperProps> = ({ locale, onChangeLocale, children }) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                <Router basename={getEnvironmentVariable('PUBLIC_PATH')}>{children}</Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
