import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Redirect, useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { Undertittel } from 'nav-frontend-typografi';
import { formatName } from 'common/utils/personUtils';
import { sendSoknad } from '../../api/soknad';
import Guide from '../../components/guide/Guide';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import GlobalRoutes from '../../config/routeConfig';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import * as apiUtils from '../../utils/apiUtils';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { navigateToErrorPage, relocateToLoginPage } from '../../utils/navigationUtils';
import { SentryEventName, triggerSentryError } from '../../utils/sentryUtils';
import { validateBekrefterOpplysninger } from '../../validation/fieldValidations';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadStep from '../SoknadStep';
import { StepID } from '../stepConfig';
import FrilanserSummary from './FrilanserSummary';
import JaNeiSvar from './JaNeiSvar';
import SelvstendigNæringsdrivendeSummary from './SelvstendigNæringsdrivendeSummary';
import SpacedCharString from './SpacedCharString';
import useTemporaryStorage from '../../hooks/useTempStorage';

interface Props {
    soknadEssentials: SoknadEssentials;
    resetSoknad: () => void;
    onSoknadSent: () => void;
}

const OppsummeringStep: React.StatelessComponent<Props> = ({ resetSoknad, onSoknadSent, soknadEssentials }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const history = useHistory();
    const tempStorage = useTemporaryStorage();

    const [sendingInProgress, setSendingInProgress] = useState(false);

    async function send(data: SoknadApiData) {
        try {
            await sendSoknad(data);
            await tempStorage.purge();
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

    const apiValues = mapFormDataToApiData(soknadEssentials, values, intl.locale as Locale);
    const hasValidApiData = apiValues?.selvstendigNæringsdrivende !== undefined || apiValues?.frilanser !== undefined;
    const { person } = soknadEssentials;

    if (apiValues && apiValues.harForståttRettigheterOgPlikter === undefined) {
        return <Redirect to={GlobalRoutes.SOKNAD} />;
    }

    return (
        <SoknadStep
            id={StepID.SUMMARY}
            resetSoknad={resetSoknad}
            onValidFormSubmit={() => {
                if (apiValues) {
                    setTimeout(() => {
                        setSendingInProgress(true);
                        setTimeout(() => {
                            // Prevent double click send
                            send(apiValues);
                        });
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
                        </Guide>
                        <Box margin="xxl">
                            <ResponsivePanel border={true}>
                                <Undertittel className="sectionTitle">Søker</Undertittel>
                                <Box margin="l">
                                    <strong>{formatName(person.fornavn, person.etternavn, person.mellomnavn)}</strong>
                                    <div>
                                        Fødselsnummer: <SpacedCharString str={person.fødselsnummer} />
                                    </div>
                                    <div>
                                        Kontonummer: <SpacedCharString str={person.kontonummer} />
                                    </div>
                                </Box>
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
                                        <SelvstendigNæringsdrivendeSummary
                                            apiData={apiValues.selvstendigNæringsdrivende}
                                        />
                                    </Box>
                                )}
                                {apiValues.frilanser && (
                                    <Box margin={'xxl'}>
                                        <FrilanserSummary apiData={apiValues.frilanser} />
                                    </Box>
                                )}
                            </ResponsivePanel>
                        </Box>
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
            {apiValues === undefined && (
                <>
                    <CounsellorPanel>Det oppstod en feil med informasjonen i søknaden din</CounsellorPanel>
                </>
            )}
        </SoknadStep>
    );
};

export default OppsummeringStep;
