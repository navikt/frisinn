import React from 'react';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import GlobalRoutes, { getRouteUrl } from '../../config/routeConfig';
import Lenke from 'nav-frontend-lenker';

const NoSoknadRouteError = () => (
    <ErrorGuide title="Det oppstod en feil under visning av siden">
        <p>
            Noe gikk feil under visningen av denne siden. Kanskje du har lastet siden på nytt underveis i søknaden?
            Dette er noe vi ikke støtter enda, så du må dessverre fylle ut søknaden på nytt.
        </p>
        <Lenke href={getRouteUrl(GlobalRoutes.SOKNAD)}>Gå tilbake til startsiden for søknaden</Lenke>
    </ErrorGuide>
);

export default NoSoknadRouteError;
