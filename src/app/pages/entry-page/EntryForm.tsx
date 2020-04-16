import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import FC from '../../application/ApplicationFormComponents';
import { ApplicationFormField, ApplicationFormData } from '../../types/ApplicationFormData';
import { validateSamtykke } from '../../validation/fieldValidations';
import BehandlingAvPersonopplysningerContent from './behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';
import DinePlikterContent from './dine-plikter-content/DinePlikterContent';
import { EntryFormQuestions } from './entryFormConfig';
import { useFormikContext } from 'formik';
import { ApplicationEssentials } from '../../types/ApplicationEssentials';
import { shouldLoggedInUserBeStoppedFormUsingApplication, RejectReason } from '../../utils/accessUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { pluralize } from '../../utils/pluralize';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import ForetakList from '../../components/foretak-list/ForetakList';
import EndreKontonummer from '../../information/EndreKontonummer';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

interface Props {
    appEssentials: ApplicationEssentials;
    onStart: () => void;
}

const EntryForm = ({ onStart, appEssentials: { person, registrerteForetakInfo } }: Props) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const { values } = useFormikContext<ApplicationFormData>();
    const intl = useIntl();

    const isSelvstendig = registrerteForetakInfo !== undefined;

    const rejectionReason = shouldLoggedInUserBeStoppedFormUsingApplication(values);
    const { isVisible, areAllQuestionsAnswered } = EntryFormQuestions.getVisbility({
        ...values,
        isSelvstendig,
        rejectionReason,
    });

    const canUseApplication = areAllQuestionsAnswered() && rejectionReason === undefined;
    const foretak = registrerteForetakInfo?.foretak || [];
    const antallForetak = foretak.length || 0;

    return (
        <FC.Form
            onValidSubmit={onStart}
            includeButtons={false}
            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
            <FormBlock>
                <FC.YesOrNoQuestion
                    legend={`Er kontonummeret ${person.kontonummer} ditt riktig?`}
                    name={ApplicationFormField.kontonummerErRiktig}
                />
            </FormBlock>
            {rejectionReason === RejectReason.kontonummerStemmerIkke && (
                <FormBlock>
                    <AlertStripeAdvarsel>
                        <EndreKontonummer />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
            {isVisible(ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende) && (
                <FormBlock>
                    <FC.YesOrNoQuestion
                        legend={`Vi har funnet ${antallForetak} foretak registrert på deg. Ønsker du å søke kompensasjon for tapt inntekt for ${pluralize(
                            antallForetak,
                            'dette foretaket',
                            'disse foretakene'
                        )}?`}
                        description={
                            <Box margin={'m'}>
                                <ExpandableInfo
                                    title="Vis registrerte foretak"
                                    closeTitle={'Skjul registrerte foretak'}>
                                    <ForetakList foretak={foretak} />
                                </ExpandableInfo>
                            </Box>
                        }
                        name={ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende}
                    />
                </FormBlock>
            )}
            {isVisible(ApplicationFormField.erFrilanser) && (
                <FormBlock>
                    <FC.YesOrNoQuestion legend="Er du frilanser?" name={ApplicationFormField.erFrilanser} />
                </FormBlock>
            )}
            {isVisible(ApplicationFormField.søkerOmTaptInntektSomFrilanser) && (
                <FormBlock>
                    <FC.YesOrNoQuestion
                        legend="Ønsker du å søke kompensasjon for tapt inntekt som frilanser?"
                        name={ApplicationFormField.søkerOmTaptInntektSomFrilanser}
                    />
                </FormBlock>
            )}
            {rejectionReason === RejectReason.søkerHverkenSomSelvstendigEllerFrilanser && (
                <FormBlock>
                    <AlertStripeAdvarsel>Du må velge hva du ønsker å søke om</AlertStripeAdvarsel>
                </FormBlock>
            )}

            {canUseApplication && (
                <FormBlock>
                    <FC.ConfirmationCheckbox
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
                    </FC.ConfirmationCheckbox>

                    <Box textAlignCenter={true} margin="xl">
                        <Hovedknapp>{intlHelper(intl, 'start')}</Hovedknapp>
                        <FormBlock>
                            <Lenke
                                href="#"
                                onClick={() => setDialogState({ behandlingAvPersonopplysningerModalOpen: true })}>
                                <FormattedMessage id="personopplysninger.lenketekst" />
                            </Lenke>
                        </FormBlock>
                    </Box>
                </FormBlock>
            )}

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
        </FC.Form>
    );
};

export default EntryForm;
