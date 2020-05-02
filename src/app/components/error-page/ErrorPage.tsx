import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import { Ingress } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import intlHelper from 'common/utils/intlUtils';
import './errorPage.less';
import ErrorGuide from '../error-guide/ErrorGuide';

interface Props {
    pageTitle?: string;
    bannerTitle?: string;
    children?: React.ReactNode;
}

const ErrorPage = ({ pageTitle, bannerTitle, children }: Props) => {
    const intl = useIntl();
    return (
        <Page
            title={pageTitle || 'Kan ikke bruke søknaden'}
            topContentRenderer={() => (
                <>
                    <StepBanner text={bannerTitle || intlHelper(intl, 'banner.title')} />
                </>
            )}>
            <Box margin="xxxl">
                {children || (
                    <ErrorGuide title={intlHelper(intl, 'page.generalErrorPage.tittel')}>
                        <Ingress>
                            <FormattedMessage id="page.generalErrorPage.tekst" />
                        </Ingress>
                    </ErrorGuide>
                )}
            </Box>
        </Page>
    );
};

export default ErrorPage;
