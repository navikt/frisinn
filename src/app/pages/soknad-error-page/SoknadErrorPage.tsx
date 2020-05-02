import React from 'react';
import { useIntl } from 'react-intl';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';

interface Props {
    children: React.ReactNode;
    pageTitle?: string;
}

const SoknadErrorPage = ({ children, pageTitle }: Props) => {
    const intl = useIntl();
    return (
        <Page
            title={pageTitle || 'Det oppstod en feil'}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'banner.title')} />}>
            <Box margin="xxxl">{children}</Box>
        </Page>
    );
};

export default SoknadErrorPage;
