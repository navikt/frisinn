import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import ApplicationFormComponents from '../../application/ApplicationFormComponents';
import { ApplicationFormField } from '../../types/ApplicationFormData';
import { validateSamtykke } from '../../validation/fieldValidations';
import BehandlingAvPersonopplysningerContent from './behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';
import DinePlikterContent from './dine-plikter-content/DinePlikterContent';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

interface Props {
    onStart: () => void;
}

const ConfirmationForm = ({ onStart }: Props) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const intl = useIntl();

    return (
        <ApplicationFormComponents.Form
            onValidSubmit={onStart}
            includeButtons={false}
            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
            <ApplicationFormComponents.ConfirmationCheckbox
                label={intlHelper(intl, 'samtykke.tekst')}
                name={ApplicationFormField.harForståttRettigheterOgPlikter}
                validate={validateSamtykke}>
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

            <InfoDialog
                contentLabel="Dine plikter"
                isOpen={dinePlikterModalOpen === true}
                onRequestClose={() => setDialogState({ dinePlikterModalOpen: false })}>
                <DinePlikterContent />
            </InfoDialog>

            <InfoDialog
                isOpen={behandlingAvPersonopplysningerModalOpen === true}
                onRequestClose={() => setDialogState({ behandlingAvPersonopplysningerModalOpen: false })}
                contentLabel={intlHelper(intl, 'modal.behandlingAvPersonalia.tittel')}>
                <BehandlingAvPersonopplysningerContent />
            </InfoDialog>
        </ApplicationFormComponents.Form>
    );
};

export default ConfirmationForm;
