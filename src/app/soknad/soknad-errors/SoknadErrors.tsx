import React from 'react';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import GlobalRoutes, { getRouteUrl } from '../../config/routeConfig';
import Lenke from 'nav-frontend-lenker';
import NoSoknadRouteError from './NoRouteError';

const NoMatchingRoute = () => <NoSoknadRouteError />;

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
