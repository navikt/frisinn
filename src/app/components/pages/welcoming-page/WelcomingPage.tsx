import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Sidetittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import FrontPageBanner from 'common/components/front-page-banner/FrontPageBanner';
import Page from 'common/components/page/Page';
import bemHelper from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps } from '../../../application/stepConfig';
import BehandlingAvPersonopplysningerModal from '../../information/behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import DinePlikterModal from '../../information/dine-plikter-modal/DinePlikterModal';
import ForenkletSamtykkeForm from './ForenkletSamtykkeForm';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

type Props = Omit<StepConfigProps, 'formValues'>;

const WelcomingPage = ({ onValidSubmit }: Props) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const intl = useIntl();

    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;

    return (
        <>
            <Page
                title={intlHelper(intl, 'welcomingPage.sidetittel')}
                className={bem.block}
                topContentRenderer={() => (
                    <FrontPageBanner
                        bannerSize="large"
                        counsellorWithSpeechBubbleProps={{
                            strongText: intlHelper(intl, 'welcomingPage.banner.tittel'),
                            normalText: intlHelper(intl, 'welcomingPage.banner.tekst')
                        }}
                    />
                )}>
                <Box margin="xxl">
                    <Sidetittel className={bem.element('title')}>
                        <FormattedMessage id="welcomingPage.introtittel" />
                    </Sidetittel>
                </Box>
                <ForenkletSamtykkeForm
                    onOpenDinePlikterModal={() => setDialogState({ dinePlikterModalOpen: true })}
                    openBehandlingAvPersonopplysningerModal={() =>
                        setDialogState({ behandlingAvPersonopplysningerModalOpen: true })
                    }
                    onConfirm={onValidSubmit}
                />
            </Page>

            <DinePlikterModal
                isOpen={dinePlikterModalOpen === true}
                onRequestClose={() => setDialogState({ dinePlikterModalOpen: false })}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
            />
            <BehandlingAvPersonopplysningerModal
                isOpen={behandlingAvPersonopplysningerModalOpen === true}
                onRequestClose={() => setDialogState({ behandlingAvPersonopplysningerModalOpen: false })}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}
            />
        </>
    );
};

export default WelcomingPage;
