import React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from '@navikt/sif-common-core/lib/utils/localeUtils';
import moment from 'moment';
import Modal from 'nav-frontend-modal';
import { Locale } from 'common/types/Locale';
import Soknad from './soknad/Soknad';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import GlobalRoutes from './config/routeConfig';
import GeneralErrorPage from './pages/general-error-page/GeneralErrorPage';
import IntroPage from './pages/intro-page/IntroPage';
import NotFoundPage from './pages/not-found-page/NotFoundPage';
import SystemUnavailablePage from './pages/system-unavailable-page/SystemUnavailablePage';
import 'common/styles/globalStyles.less';
import './styles/app.less';
import ReceiptPage from './pages/receipt-page/ReceiptPage';

require('../../node_modules/moment/locale/nb.js');
require('../../node_modules/moment/locale/nn.js');

const localeFromSessionStorage = getLocaleFromSessionStorage();
moment.locale(localeFromSessionStorage);

const App: React.FunctionComponent = () => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);
    return (
        <ApplicationWrapper
            locale={locale}
            onChangeLocale={(activeLocale: Locale) => {
                setLocaleInSessionStorage(activeLocale);
                setLocale(activeLocale);
            }}>
            <>
                <Switch>
                    <Route path={GlobalRoutes.SYSTEM_UNAVAILABLE} component={SystemUnavailablePage} />
                    <Route path={GlobalRoutes.SOKNAD_SENT} component={ReceiptPage} />
                    <Route path={GlobalRoutes.SOKNAD} component={Soknad} />
                    <Route path={GlobalRoutes.ERROR} component={GeneralErrorPage} />
                    <Route path="/" component={IntroPage} exact={true} />
                    <Route component={NotFoundPage} />
                </Switch>
            </>
        </ApplicationWrapper>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
