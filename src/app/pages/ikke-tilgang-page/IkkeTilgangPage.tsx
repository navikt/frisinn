import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';

const CannotUseApplicationPage: React.FunctionComponent = () => {
    return (
        <Page title={'Kan ikke bruke søknaden'} topContentRenderer={() => <div>Du kan ikke bruke søknaden</div>}>
            <Box margin="xxxl">
                <Innholdstittel>Melding om hvorfor</Innholdstittel>
            </Box>
        </Page>
    );
};

export default CannotUseApplicationPage;
