import React, { useState, useContext, useEffect } from 'react';
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
import { validateSamtykke } from '../../validation/fieldValidations';
import AccessForm from './access-form/AccessForm';
import { ageRule } from '../../utils/access-rules/ageRule';
import { ApplicantDataContext } from '../../context/ApplicantDataContext';
import { ApplicantData } from '../../types/ApplicantData';
import { AccessRuleResult } from '../../types/AccessRule';
import { enkeltmannsforetakRule } from '../../utils/access-rules/enkeltmannsforetakRule';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

const WelcomeStep = ({ onValidSubmit }: StepConfigProps) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const [results, setResults] = useState<Array<AccessRuleResult>>([]);
    const intl = useIntl();
    const applicant = useContext(ApplicantDataContext);

    if (!applicant) {
        return null;
    }

    async function checkRules(applicant: ApplicantData) {
        const results = await Promise.all([ageRule(applicant).check(), enkeltmannsforetakRule().check()]);
        setResults(results);
    }

    useEffect(() => {
        checkRules(applicant);
    }, [applicant]);

    console.log('render');

    return (
        <ApplicationStep id={StepID.WELCOME} onValidFormSubmit={onValidSubmit} showSubmitButton={false}>
            <AccessForm accessRules={[ageRule(applicant), enkeltmannsforetakRule()]} results={results} />
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
