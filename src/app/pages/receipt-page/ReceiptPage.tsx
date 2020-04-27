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
                    <Innholdstittel>
                        <FormattedMessage id="page.receipt.tittel" />
                    </Innholdstittel>
                </Box>
            </div>
            <Box margin="xl">
                <Ingress>
                    <FormattedMessage id="page.receipt.undertittel" />
                </Ingress>
                <ul className="checklist">
                    <li>
                        <FormattedHTMLMessage id="page.receipt.hvaSkjer1" />
                    </li>
                    <li>
                        <FormattedHTMLMessage id="page.receipt.hvaSkjer2" />
                    </li>
                    <li>
                        <FormattedHTMLMessage id="page.receipt.hvaSkjer3" />
                    </li>
                </ul>
            </Box>
        </Page>
    );
};

export default ReceiptPage;
