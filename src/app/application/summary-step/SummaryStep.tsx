import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import Panel from 'nav-frontend-paneler';
import { sendApplication } from '../../api/soknad';
import { ApplicationApiData } from '../../types/ApplicationApiData';
import { ApplicationEssentials } from '../../types/ApplicationEssentials';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import * as apiUtils from '../../utils/apiUtils';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateToErrorPage, relocateToLoginPage } from '../../utils/navigationUtils';
import { validateBekrefterOpplysninger } from '../../validation/fieldValidations';
import ApplicationFormComponents from '../ApplicationFormComponents';
import ApplicationStep from '../ApplicationStep';
import { StepID } from '../stepConfig';
import SelvstendigNæringsdrivendeSummary from './SelvstendigNæringsdrivendeSummary';
import FrilanserSummary from './FrilanserSummary';

interface Props {
    applicationEssentials: ApplicationEssentials;
    resetApplication: () => void;
    onApplicationSent: () => void;
}

const OppsummeringStep: React.StatelessComponent<Props> = ({
    resetApplication,
    onApplicationSent,
    applicationEssentials,
}: Props) => {
    const intl = useIntl();
    const formik = useFormikContext<ApplicationFormData>();
    const history = useHistory();

    const [sendingInProgress, setSendingInProgress] = useState(false);

    async function send(data: ApplicationApiData) {
        setSendingInProgress(true);
        try {
            await sendApplication(data);
            onApplicationSent();
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                relocateToLoginPage();
            } else {
                navigateToErrorPage(history);
            }
        }
    }

    const apiValues = mapFormDataToApiData(applicationEssentials, formik.values, intl.locale as Locale);

    return (
        <ApplicationStep
            id={StepID.SUMMARY}
            resetApplication={resetApplication}
            onValidFormSubmit={() => {
                if (apiValues) {
                    setTimeout(() => {
                        send(apiValues);
                    });
                }
            }}
            useValidationErrorSummary={false}
            buttonDisabled={sendingInProgress || apiValues === undefined}
            showButtonSpinner={sendingInProgress}>
            {apiValues && (
                <>
                    <CounsellorPanel>Info</CounsellorPanel>
                    <Box margin="xl">
                        <Panel border={true}>
                            {apiValues.selvstendigNæringsdrivende && (
                                <SelvstendigNæringsdrivendeSummary apiData={apiValues.selvstendigNæringsdrivende} />
                            )}
                            {apiValues.frilanser && <FrilanserSummary apiData={apiValues.frilanser} />}
                        </Panel>
                    </Box>

                    <Box margin="l">
                        <ApplicationFormComponents.ConfirmationCheckbox
                            label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                            name={ApplicationFormField.harBekreftetOpplysninger}
                            validate={validateBekrefterOpplysninger}
                        />
                    </Box>
                </>
            )}
            {apiValues === undefined && (
                <>
                    <CounsellorPanel>Det oppstod en feil med informasjonen i søknaden din</CounsellorPanel>
                </>
            )}
        </ApplicationStep>
    );
};

export default OppsummeringStep;
