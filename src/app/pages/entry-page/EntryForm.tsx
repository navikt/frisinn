import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import FormComponents from '../../application/ApplicationFormComponents';
import { ApplicationFormField, ApplicationFormData } from '../../types/ApplicationFormData';
import { validateSamtykke } from '../../validation/fieldValidations';
import BehandlingAvPersonopplysningerContent from './behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';
import DinePlikterContent from './dine-plikter-content/DinePlikterContent';
import { EntryFormQuestions } from './entryFormConfig';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import EndreKontonummer from '../../information/EndreKontonummer';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

interface Props {
    kontonummer: string;
    isSelvstendig: boolean;
    onStart: () => void;
}

const EntryForm = ({ onStart, isSelvstendig, kontonummer }: Props) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const { values } = useFormikContext<ApplicationFormData>();
    const intl = useIntl();

    const {
        kontonummerErRiktig,
        søkerOmTaptInntektSomFrilanser,
        søkerOmTaptInntektSomSelvstendigNæringsdrivende,
    } = values;

    const { isVisible, areAllQuestionsAnswered } = EntryFormQuestions.getVisbility({ ...values, isSelvstendig });

    const hasChosenApplication =
        søkerOmTaptInntektSomFrilanser === YesOrNo.YES ||
        søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES;

    const canContinue = areAllQuestionsAnswered() && kontonummerErRiktig === YesOrNo.YES && hasChosenApplication;

    return (
        <FormComponents.Form
            onValidSubmit={onStart}
            includeButtons={false}
            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
            <FormBlock>
                <FormComponents.YesOrNoQuestion
                    legend={`Vi har registrert kontonummeret ${kontonummer} på deg. Er dette riktig kontonummer?`}
                    name={ApplicationFormField.kontonummerErRiktig}
                />
            </FormBlock>

            {kontonummerErRiktig === YesOrNo.NO && (
                <FormBlock>
                    <AlertStripeAdvarsel>
                        <EndreKontonummer />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
            {isVisible(ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende) && (
                <FormBlock>
                    <FormComponents.YesOrNoQuestion
                        legend={`Ønsker du å søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende?`}
                        name={ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende}
                    />
                </FormBlock>
            )}
            {isVisible(ApplicationFormField.søkerOmTaptInntektSomFrilanser) && (
                <FormBlock>
                    <FormComponents.YesOrNoQuestion
                        legend="Ønsker du å søke kompensasjon for tapt inntekt som frilanser?"
                        name={ApplicationFormField.søkerOmTaptInntektSomFrilanser}
                    />
                </FormBlock>
            )}

            {hasChosenApplication === false && areAllQuestionsAnswered() && kontonummerErRiktig === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <AlertStripeAdvarsel>Du må velge hva du ønsker å søke om</AlertStripeAdvarsel>
                    </FormBlock>
                </>
            )}

            {canContinue && (
                <FormBlock>
                    <FormComponents.ConfirmationCheckbox
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
                    </FormComponents.ConfirmationCheckbox>
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
        </FormComponents.Form>
    );
};

export default EntryForm;
