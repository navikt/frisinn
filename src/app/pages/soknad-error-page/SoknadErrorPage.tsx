import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import './soknadErrorPage.less';
import Guide from '../../components/guide/Guide';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';

interface Props {
    title?: string;
    children?: React.ReactNode;
}

const SoknadErrorPage: React.FunctionComponent = ({ children, title }: Props) => {
    const intl = useIntl();
    return (
        <Page
            title="Noe gikk galt med visningen av siden"
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'banner.title')} />}>
            <Box margin="xxxl">
                <Guide type="plakat" kompakt={true} fargetema="normal" svg={<VeilederSVG mood="uncertain" />}>
                    <Undertittel tag="h2">{title || 'Nødvendig informasjon mangler'}</Undertittel>
                    <Box margin="m" padBottom="l">
                        {children || <p>Vennligst gå tilbake</p>}
                    </Box>
                </Guide>
            </Box>
        </Page>
    );
};

export default SoknadErrorPage;
