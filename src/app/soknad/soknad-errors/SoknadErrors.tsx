import React from 'react';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import GlobalRoutes, { getRouteUrl } from '../../config/routeConfig';
import Lenke from 'nav-frontend-lenker';

const GeneralSoknadFrontpageError = () => (
    <ErrorGuide title="Noe gikk galt...">
        <p>Beklager, her har det dessverre skjedd en feil. Dersom feilen fortsetter, prøv igjen litt senere.</p>
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

const NoMatchingRoute = () => (
    <ErrorGuide title="Det oppstod en feil under visning av siden">
        <p>
            Noe gikk feil under visning av denne siden. Du må dessverre fylle ut søknaden på nytt. Vi beklager ulempen
            det medfører for deg.
        </p>
        <Lenke href={getRouteUrl(GlobalRoutes.SOKNAD)}>Gå tilbake til startsiden for søknaden</Lenke>
    </ErrorGuide>
);

const MissingApiDataError = () => (
    <ErrorGuide title="Det oppstod en feil under visning av siden">
        <p>
            Noe gikk feil under visning av denne siden. Du må dessverre fylle ut søknaden på nytt. Vi beklager ulempen
            det medfører for deg. Dersom feilen fortsetter, prøv igjen litt senere.
        </p>
        <Lenke href={getRouteUrl(GlobalRoutes.SOKNAD)}>Gå tilbake til startsiden for søknaden</Lenke>
    </ErrorGuide>
);

const SoknadErrors = {
    NoMatchingRoute,
    GeneralError,
    MissingApiDataError,
    GeneralSoknadFrontpageError,
};
export default SoknadErrors;
