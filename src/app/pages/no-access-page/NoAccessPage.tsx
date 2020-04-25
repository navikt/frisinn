import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';
import Guide from '../../components/guide/Guide';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';

interface Props {
    title: string;
    children: React.ReactNode;
}

const NoAccessPage = ({ title, children }: Props) => {
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
                    <Systemtittel>{title}</Systemtittel>
                    <Box margin="m">{children}</Box>
                </Guide>
            </Box>
        </Page>
    );
};

export default NoAccessPage;
