import React from 'react';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import Veilederpanel from 'nav-frontend-veilederpanel';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import './notFoundPage.less';

const NotFoundPage: React.FunctionComponent = ({ children }: { children?: React.ReactNode }) => {
    return (
        <Page title="Side ikke funnet">
            <div className={'generalErrorPage'}>
                <Veilederpanel type="plakat" kompakt={true} fargetema="normal" svg={<VeilederSVG mood="uncertain" />}>
                    <Systemtittel tag="h2">Du har kommet til en side som ikke finnes</Systemtittel>
                    <Box margin="m" padBottom="l">
                        <Ingress>Vennligst gå tilbake</Ingress>
                    </Box>
                </Veilederpanel>
            </div>
            {children && <Box margin="xxl">{children}</Box>}
        </Page>
    );
};

export default NotFoundPage;
