import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { formatName } from 'common/utils/personUtils';
import { sendSoknad } from '../../api/soknad';
import ChecklistCircleIcon from '../../assets/ChecklistCircleIcon';
import Guide from '../../components/guide/Guide';
import StopMessage from '../../components/StopMessage';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateToErrorPage, relocateToLoginPage } from '../../utils/navigationUtils';
import { validateBekrefterOpplysninger } from '../../validation/fieldValidations';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadStep from '../SoknadStep';
import { StepID } from '../stepConfig';
import FrilanserSummary from './FrilanserSummary';
import JaNeiSvar from './JaNeiSvar';
import SelvstendigNæringsdrivendeSummary from './SelvstendigNæringsdrivendeSummary';

interface Props {
    soknadEssentials: SoknadEssentials;
    resetSoknad: () => void;
    onSoknadSent: () => void;
}

const OppsummeringStep: React.StatelessComponent<Props> = ({ resetSoknad, onSoknadSent, soknadEssentials }: Props) => {
    const intl = useIntl();
    const formik = useFormikContext<SoknadFormData>();
    const history = useHistory();

    const [sendingInProgress, setSendingInProgress] = useState(false);

    async function send(data: SoknadApiData) {
        setSendingInProgress(true);
        try {
            await sendSoknad(data);
            onSoknadSent();
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                relocateToLoginPage();
            } else {
                navigateToErrorPage(history);
            }
        }
    }

    const apiValues = mapFormDataToApiData(soknadEssentials, formik.values, intl.locale as Locale);
    const hasValidApiData = apiValues?.selvstendigNæringsdrivende !== undefined || apiValues?.frilanser !== undefined;
    const { person } = soknadEssentials;

    return (
        <SoknadStep
            id={StepID.SUMMARY}
            resetSoknad={resetSoknad}
            onValidFormSubmit={() => {
                if (apiValues) {
                    setTimeout(() => {
                        send(apiValues);
                    });
                }
            }}
            showSubmitButton={hasValidApiData}
            useValidationErrorSummary={false}
            buttonDisabled={sendingInProgress || apiValues === undefined}
            showButtonSpinner={sendingInProgress}>
            {apiValues && hasValidApiData && (
                <>
                    <Box margin="xxxl">
                        <Guide
                            svg={<ChecklistCircleIcon />}
                            type={'plakat'}
                            kompakt={true}
                            fargetema={'info'}
                            fullHeight={true}>
                            <Box margin="xl">
                                <SummaryBlock header="Søker">
                                    <Box>{formatName(person.fornavn, person.etternavn, person.mellomnavn)}</Box>
                                    {person.fødselsnummer}
                                </SummaryBlock>
                                <SummaryBlock header="Søker som selvstendig næringsdrivende">
                                    <JaNeiSvar harSvartJa={apiValues.selvstendigNæringsdrivende !== undefined} />
                                </SummaryBlock>
                                <SummaryBlock header="Søker som frilanser">
                                    <JaNeiSvar harSvartJa={apiValues.frilanser !== undefined} />
                                </SummaryBlock>
                            </Box>
                            {apiValues.selvstendigNæringsdrivende && (
                                <Box margin="xl">
                                    <SelvstendigNæringsdrivendeSummary apiData={apiValues.selvstendigNæringsdrivende} />
                                </Box>
                            )}
                            {apiValues.frilanser && (
                                <Box margin={'xxl'}>
                                    <FrilanserSummary apiData={apiValues.frilanser} />
                                </Box>
                            )}
                        </Guide>
                    </Box>
                    <Box margin="l">
                        <SoknadFormComponents.ConfirmationCheckbox
                            label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                            name={SoknadFormField.harBekreftetOpplysninger}
                            validate={validateBekrefterOpplysninger}
                        />
                    </Box>
                </>
            )}
            {apiValues && hasValidApiData === false && (
                <>
                    <StopMessage>
                        Basert på hva du har svart i søknaden, har du ikke grunnlag til å søke på denne ytelsen. Gå
                        tilbake til de tidligere stegene og se over informasjonen du har fått der.
                    </StopMessage>
                </>
            )}
            {apiValues === undefined && (
                <>
                    <CounsellorPanel>Det oppstod en feil med informasjonen i søknaden din</CounsellorPanel>
                </>
            )}
        </SoknadStep>
    );
};

export default OppsummeringStep;
