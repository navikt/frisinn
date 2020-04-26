import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import { Systemtittel, Ingress } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import intlHelper from 'common/utils/intlUtils';
import Guide from '../../components/guide/Guide';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import './generalErrorPage.less';

const GeneralErrorPage: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <Page
            title={'Kan ikke bruke søknaden'}
            topContentRenderer={() => (
                <>
                    <StepBanner text={intlHelper(intl, 'banner.title')} />
                </>
            )}>
            <Box margin="xxxl">
                <Guide svg={<VeilederSVG mood="uncertain" />} kompakt={true} type="plakat">
                    <Systemtittel>
                        <FormattedMessage id="page.generalErrorPage.tittel" />
                    </Systemtittel>
                    <Box margin="m">
                        <Ingress>
                            <FormattedMessage id="page.generalErrorPage.tekst" />
                        </Ingress>
                    </Box>
                </Guide>
            </Box>
        </Page>
    );
};

export default GeneralErrorPage;
