import React from 'react';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import GlobalRoutes, { getRouteUrl } from '../../config/routeConfig';
import Lenke from 'nav-frontend-lenker';

const NoMatchingRoute = () => (
    <ErrorGuide title="Noe gikk galt...">
        <p>
            Noe gikk feil under visningen av denne siden. Kanskje du har lastet siden på nytt underveis i søknaden?
            Dette er noe vi ikke støtter enda, så du må dessverre fylle ut søknaden på nytt.
        </p>
        <Lenke href={getRouteUrl(GlobalRoutes.SOKNAD)}>Gå tilbake til startsiden for søknaden</Lenke>
    </ErrorGuide>
);

const GeneralError = () => (
    <ErrorGuide title="Noe gikk galt...">
        <p>
            Beklager, her har det dessverre skjedd en feil. Vennligst gå tilbake og prøv igjen. Dersom feilen
            fortsetter, prøv igjen litt senere.
        </p>
        <Lenke href={getRouteUrl(GlobalRoutes.SOKNAD)}>Gå tilbake til startsiden for søknaden</Lenke>
    </ErrorGuide>
);

const SoknadErrors = {
    NoMatchingRoute,
    GeneralError,
};
export default SoknadErrors;
