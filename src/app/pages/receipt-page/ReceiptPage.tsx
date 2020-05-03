import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import CheckmarkIcon from 'common/components/checkmark-icon/CheckmarkIcon';
import Page from 'common/components/page/Page';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import './receiptPage.less';

const bem = bemUtils('receiptPage');

const ReceiptPage: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <Page title={intlHelper(intl, 'page.receipt.sidetittel')} className={bem.block}>
            <div className={bem.element('centeredContent')}>
                <CheckmarkIcon />
                <Box margin="xl">
                    <Innholdstittel>Vi har mottatt søknad fra deg om inntektskompensasjon</Innholdstittel>
                </Box>
            </div>
            <Box margin="xl">
                <Ingress>Hva skjer videre nå?</Ingress>
                <ul className="checklist">
                    <li>Søknaden din vil bli behandlet så raskt som mulig</li>
                    <li>Du vil få et svar fra oss, når søknaden er ferdig behandlet</li>
                    <li>Hvis søknaden blir innvilget, får du utbetaling til kontoen din i løpet av 3 dager</li>
                </ul>
            </Box>
        </Page>
    );
};

export default ReceiptPage;
