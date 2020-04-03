import React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';

const SystemUnavailablePage: React.StatelessComponent<{}> = () => {
    const title = 'Tjenesten ikke tilgjengelig';
    return (
        <Page title={title} topContentRenderer={() => <StepBanner text={title} />}>
            <Box margin="xxxl">
                <AlertStripeAdvarsel>
                    <p>
                        Den tjenesten er dessverre ikke tilgjengelig på grunn av teknisk feil. Vi jobber med å løse
                        feilen.
                    </p>
                    <p>Vi beklager.</p>
                </AlertStripeAdvarsel>
            </Box>
        </Page>
    );
};

export default SystemUnavailablePage;
