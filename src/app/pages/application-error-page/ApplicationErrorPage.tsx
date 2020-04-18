import React from 'react';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import Veilederpanel from 'nav-frontend-veilederpanel';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import VeilederLokal from '../../components/veileder-local/VeilederLokal';
import './applicationErrorPage.less';

const ApplicationErrorPage: React.FunctionComponent = ({ children }: { children?: React.ReactNode }) => {
    return (
        <Page title="Det oppstod en feil under visning av siden">
            <div className={'applicationErrorPage'}>
                <Veilederpanel type="plakat" kompakt={true} fargetema="normal" svg={<VeilederLokal mood="uncertain" />}>
                    <p>ApplicationErrorPage</p>
                    <Systemtittel tag="h2">Nødvendig informasjon mangler</Systemtittel>
                    <Box margin="m" padBottom="l">
                        <Ingress>Vennligst gå tilbake</Ingress>
                    </Box>
                </Veilederpanel>
            </div>
            {children && <Box margin="xxl">{children}</Box>}
        </Page>
    );
};

export default ApplicationErrorPage;
