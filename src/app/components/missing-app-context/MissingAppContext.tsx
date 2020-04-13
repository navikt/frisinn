import React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import GeneralErrorPage from '../../pages/general-error-page/GeneralErrorPage';

const MissingAppContext = () => (
    <GeneralErrorPage>
        <AlertStripeAdvarsel>Du må starte søknaden på nytt</AlertStripeAdvarsel>
    </GeneralErrorPage>
);

export default MissingAppContext;
