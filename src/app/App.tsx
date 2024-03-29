import React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import AppStatusWrapper from '@navikt/sif-common-core/lib/components/app-status-wrapper/AppStatusWrapper';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from '@navikt/sif-common-core/lib/utils/localeUtils';
import * as Sentry from '@sentry/browser';
import { detect } from 'detect-browser';
import moment from 'moment-timezone';
import Modal from 'nav-frontend-modal';
import { Locale } from 'common/types/Locale';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import TilgjengeligCheck from './components/tilgjengelig-check/TilgjengeligCheck';
import GlobalRoutes from './config/routeConfig';
import GeneralErrorPage from './pages/general-error-page/GeneralErrorPage';
import IntroPage from './pages/intro-page/IntroPage';
import NotFoundPage from './pages/not-found-page/NotFoundPage';
import NotOpenPage from './pages/not-open-page/NotOpenPage';
import ReceiptPage from './pages/receipt-page/ReceiptPage';
import UnsupportedBrowserPage from './pages/unsupported-browser-page/UnsupportedBrowserPage';
import Soknad from './soknad/Soknad';
import { getEnvironmentVariable } from './utils/envUtils';
import 'common/styles/globalStyles.less';
import './styles/app.less';

require('../../node_modules/moment/locale/nb.js');
require('../../node_modules/moment/locale/nn.js');

// Trigger

const localeFromSessionStorage = getLocaleFromSessionStorage();

moment.locale(localeFromSessionStorage);
moment.tz.setDefault('Europe/Oslo');

Sentry.init({
    dsn: 'https://64c0ee4a1a8b4212b685764604cce997@sentry.gc.nav.no/29',
    release: getEnvironmentVariable('APP_VERSION'),
    environment: window.location.hostname,
    allowUrls: ['inntektskompensasjon'],
});

const isBrowserSupported = (): boolean => {
    const browser = detect();
    if (browser) {
        const { name, version = '', os } = browser;
        if (os === 'Windows 10' && name === 'edge') {
            if (version?.match(/(^14.|^15.)\w+/)) {
                return false;
            }
        }
    }
    return true;
};

const getAppStatusSanityConfig = () => {
    const projectId = getEnvironmentVariable('APPSTATUS_PROJECT_ID');
    const dataset = getEnvironmentVariable('APPSTATUS_DATASET');
    return !projectId || !dataset ? undefined : { projectId, dataset };
};

const APPLICATION_KEY = 'frisinn';

const App: React.FunctionComponent = () => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);
    const isSupportedBrowser = isBrowserSupported();

    const appStatusSanityConfig = getAppStatusSanityConfig();

    const renderContent = () => (
        <TilgjengeligCheck
            tilgjengenligRender={() => (
                <Switch>
                    <Route path={GlobalRoutes.NOT_OPEN} component={NotOpenPage} />
                    <Route path={GlobalRoutes.SOKNAD_SENT} component={ReceiptPage} />
                    <Route path={GlobalRoutes.SOKNAD} component={Soknad} />
                    <Route path={GlobalRoutes.ERROR} component={GeneralErrorPage} />
                    <Route path="/" component={IntroPage} exact={true} />
                    <Route component={NotFoundPage} />
                </Switch>
            )}
        />
    );

    return (
        <ApplicationWrapper
            locale={locale}
            onChangeLocale={(activeLocale: Locale) => {
                setLocaleInSessionStorage(activeLocale);
                setLocale(activeLocale);
            }}>
            {isSupportedBrowser && (
                <>
                    {appStatusSanityConfig ? (
                        <AppStatusWrapper
                            applicationKey={APPLICATION_KEY}
                            sanityConfig={appStatusSanityConfig}
                            contentRenderer={renderContent}
                            unavailableContentRenderer={() => <NotOpenPage />}
                        />
                    ) : (
                        renderContent()
                    )}
                </>
            )}
            {isSupportedBrowser === false && <UnsupportedBrowserPage />}
        </ApplicationWrapper>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
