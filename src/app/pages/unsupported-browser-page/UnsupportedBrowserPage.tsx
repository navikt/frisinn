import React from 'react';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import { Ingress } from 'nav-frontend-typografi';

const GeneralErrorPage = () => {
    return (
        <Page
            title={'Vi støtter ikke nettleseren du bruker'}
            topContentRenderer={() => (
                <StepBanner text="Midlertidig kompensasjon for selvstendig næringsdrivende og frilansere" />
            )}>
            <Box margin="xxxl">
                <ErrorGuide title="Vi støtter ikke nettleseren din">
                    <Ingress>
                        Beklager, men vi støtter dessverre ikke nettleseren du bruker. Vennligst oppdater til en nyere
                        versjon.
                    </Ingress>
                </ErrorGuide>
            </Box>
        </Page>
    );
};

export default GeneralErrorPage;
