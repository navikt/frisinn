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
import Guide from '../../components/guide/Guide';
import StopMessage from '../../components/stop-message/StopMessage';
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
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import FormSection from '../../pages/intro-page/FormSection';
import { triggerSentryError, SentryEventName, triggerSentryMessage } from '../../utils/sentryUtils';
import { isRunningInDevEnvironment } from '../../utils/envUtils';

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
            if (isRunningInDevEnvironment()) {
                triggerSentryMessage(SentryEventName.soknadSentSuccessfully, {
                    values: formik.values,
                    apiData: { ...data },
                });
            }
            onSoknadSent();
        } catch (error) {
            triggerSentryError(SentryEventName.sendSoknadFailed, error);
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
                        <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                            Du har godkjent at tallene du har lagt inn i søknaden er korrekte. I denne oppsummeringen
                            kan du se om de andre opplysningene du har gitt er korrekte. Hvis du oppdager at noe feil,
                            må du gå tilbake og korrigere det du har lagt inn feil.
                            <p>
                                Denne oppsummeringssiden vil først bli synlig for deg på Ditt NAV om en uke. Vi
                                anbefaler derfor at du tar et bilde, eller en skjermdump av siden.
                            </p>
                        </Guide>
                        <FormSection title="Søker">
                            <SummaryBlock header="Søker">
                                <Box>{formatName(person.fornavn, person.etternavn, person.mellomnavn)}</Box>
                                {person.fødselsnummer}
                            </SummaryBlock>
                        </FormSection>
                        <Box>
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
                        TODO: utviklermelding: apiValues === undefined
                        <p>Ja, det skal fikses :)</p>
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
