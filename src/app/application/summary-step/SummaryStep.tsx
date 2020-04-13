import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import Panel from 'nav-frontend-paneler';
import MissingAppContext from '../../components/missing-app-context/MissingAppContext';
import { ApplicationContext } from '../../context/ApplicationContext';
import { ApplicationApiData } from '../../types/ApplicationApiData';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import * as apiUtils from '../../utils/apiUtils';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateToErrorPage, navigateToLoginPage } from '../../utils/navigationUtils';
import { validateBekrefterOpplysninger } from '../../validation/fieldValidations';
import ApplicationFormComponents from '../ApplicationFormComponents';
import ApplicationStep from '../ApplicationStep';
import { StepID } from '../stepConfig';
import SelvstendigNæringsdrivendeSummary from './SelvstendigNæringsdrivendeSummary';
import { sendApplication } from '../../api/soknad';

interface Props {
    onApplicationSent: () => void;
}

const OppsummeringStep: React.StatelessComponent<Props> = ({ onApplicationSent }: Props) => {
    const intl = useIntl();
    const formik = useFormikContext<ApplicationFormData>();
    const appContext = React.useContext(ApplicationContext);
    const history = useHistory();

    const [sendingInProgress, setSendingInProgress] = useState(false);

    async function send(data: ApplicationApiData) {
        setSendingInProgress(true);
        try {
            await sendApplication(data);
            onApplicationSent();
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                navigateToLoginPage();
            } else {
                navigateToErrorPage(history);
            }
        }
    }

    const applicantProfile = appContext?.applicantProfile || { isSelvstendig: true, isFrilanser: false };

    if (!applicantProfile) {
        return <MissingAppContext />;
    }

    const apiValues = mapFormDataToApiData(formik.values, applicantProfile, intl.locale as Locale);

    return (
        <ApplicationStep
            id={StepID.SUMMARY}
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
                                <SelvstendigNæringsdrivendeSummary data={apiValues.selvstendigNæringsdrivende} />
                            )}
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
