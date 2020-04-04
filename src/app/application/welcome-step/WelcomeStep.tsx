import React, { useState } from 'react';
import { StepConfigProps, StepID } from '../stepConfig';
import ApplicationStep from '../ApplicationStep';
import DinePlikterModal from '../../components/information/dine-plikter-modal/DinePlikterModal';
import BehandlingAvPersonopplysningerModal from '../../components/information/behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl, FormattedMessage } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { ApplicationFormField } from '../../types/ApplicationFormData';
import ApplicationFormComponents from '../ApplicationFormComponents';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Hovedknapp } from 'nav-frontend-knapper';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

const WelcomeStep = ({ onValidSubmit }: StepConfigProps) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const intl = useIntl();

    return (
        <ApplicationStep id={StepID.WELCOME} onValidFormSubmit={onValidSubmit} showSubmitButton={false}>
            <ApplicationFormComponents.ConfirmationCheckbox
                label={intlHelper(intl, 'samtykke.tekst')}
                name={ApplicationFormField.harForståttRettigheterOgPlikter}
                validate={(value) => {
                    return value !== true ? intlHelper(intl, 'samtykke.harIkkeGodkjentVilkår') : undefined;
                }}>
                <FormattedMessage
                    id="samtykke.harForståttLabel"
                    values={{
                        plikterLink: (
                            <Lenke href="#" onClick={() => setDialogState({ dinePlikterModalOpen: true })}>
                                {intlHelper(intl, 'samtykke.harForståttLabel.lenketekst')}
                            </Lenke>
                        ),
                    }}
                />
            </ApplicationFormComponents.ConfirmationCheckbox>
            <Box textAlignCenter={true} margin="xl">
                <Hovedknapp>{intlHelper(intl, 'start')}</Hovedknapp>
                <FormBlock>
                    <Lenke href="#" onClick={() => setDialogState({ behandlingAvPersonopplysningerModalOpen: true })}>
                        <FormattedMessage id="personopplysninger.lenketekst" />
                    </Lenke>
                </FormBlock>
            </Box>
            <DinePlikterModal
                isOpen={dinePlikterModalOpen === true}
                onRequestClose={() => setDialogState({ dinePlikterModalOpen: false })}
                contentLabel={intlHelper(intl, 'modal.omDinePlikter.tittel')}
            />
            <BehandlingAvPersonopplysningerModal
                isOpen={behandlingAvPersonopplysningerModalOpen === true}
                onRequestClose={() => setDialogState({ behandlingAvPersonopplysningerModalOpen: false })}
                contentLabel={intlHelper(intl, 'modal.behandlingAvPersonalia.tittel')}
            />
        </ApplicationStep>
    );
};

export default WelcomeStep;
