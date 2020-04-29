import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import FormComponents from '../../soknad/SoknadFormComponents';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import Guide from '../../components/guide/Guide';
import EndreKontonummer from '../../information/EndreKontonummer';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { validateSamtykke } from '../../validation/fieldValidations';
import BehandlingAvPersonopplysningerContent from './behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';
import DinePlikterContent from './dine-plikter-content/DinePlikterContent';
import { SoknadEntryFormQuestions } from './soknadEntryFormConfig';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import EntryQuestion from './EntryFormQuestion';
import StopMessage from '../../components/stop-message/StopMessage';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

interface Props {
    kontonummer: string;
    isSelvstendig: boolean;
    onStart: () => void;
}

const SoknadEntryForm = ({ onStart, isSelvstendig, kontonummer }: Props) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const { values } = useFormikContext<SoknadFormData>();
    const intl = useIntl();

    const {
        kontonummerErRiktig,
        søkerOmTaptInntektSomFrilanser,
        søkerOmTaptInntektSomSelvstendigNæringsdrivende,
    } = values;

    const { areAllQuestionsAnswered } = SoknadEntryFormQuestions.getVisbility({ ...values, isSelvstendig });

    const hasChosenSoknad =
        søkerOmTaptInntektSomFrilanser === YesOrNo.YES ||
        søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES;

    const infoStates = {
        isSelvstendigButNoForetakFound: values.erSelvstendigNæringsdrivende === YesOrNo.YES && !isSelvstendig,
        hasNotChosenSoknad:
            hasChosenSoknad === false && areAllQuestionsAnswered() && kontonummerErRiktig === YesOrNo.YES,
    };

    const canContinue = areAllQuestionsAnswered() && kontonummerErRiktig === YesOrNo.YES && hasChosenSoknad;

    const visibility = SoknadEntryFormQuestions.getVisbility({
        ...values,
        isSelvstendig,
    });

    return (
        <FormComponents.Form
            onValidSubmit={onStart}
            includeButtons={false}
            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <EntryQuestion question={SoknadFormField.kontonummerErRiktig}>
                    <FormComponents.YesOrNoQuestion
                        name={SoknadFormField.kontonummerErRiktig}
                        legend={`Vi har registrert kontonummeret ${kontonummer} på deg. Er dette riktig kontonummer?`}
                    />
                </EntryQuestion>
                {kontonummerErRiktig === YesOrNo.NO && (
                    <StopMessage>
                        <EndreKontonummer />
                    </StopMessage>
                )}
                <EntryQuestion question={SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende}>
                    <FormComponents.YesOrNoQuestion
                        legend={`Skal du søke om kompensasjon for tapt inntekt som selvstendig næringsdrivende?`}
                        name={SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende}
                    />
                </EntryQuestion>
                <EntryQuestion question={SoknadFormField.søkerOmTaptInntektSomFrilanser}>
                    <FormComponents.YesOrNoQuestion
                        legend="Skal du søke om kompensasjon for tapt inntekt som frilanser?"
                        name={SoknadFormField.søkerOmTaptInntektSomFrilanser}
                    />
                </EntryQuestion>
                <EntryQuestion question={SoknadFormField.erSelvstendigNæringsdrivende}>
                    <SoknadFormComponents.YesOrNoQuestion
                        legend="Er du selvstendig næringsdrivende?"
                        name={SoknadFormField.erSelvstendigNæringsdrivende}
                    />
                </EntryQuestion>
                {infoStates.isSelvstendigButNoForetakFound && (
                    <FormBlock>
                        <Guide kompakt={true} svg={<VeilederSVG mood="uncertain" />} fargetema="advarsel">
                            <p>
                                Det er ikke registrert noe selskap på deg som selvstendig næringsdrivende. Hvis du mener
                                det er feil at det ikke er registrert selskap på deg som selvstendig næringsdrivende, må
                                du kontakte Brønnøysundregisteret.
                            </p>
                            <p>
                                For å være registrert som selvstendig næringsdrivende må du enten ha et
                                enkeltpersonforetak (EK), et ansvarlig selskap (ANS), eller et ansvarlig selskap med
                                delt ansvar (DA). Selskapet må være registrert før 1. mars 2020 for å kunne søke
                                kompensasjon gjennom denne ordningen.
                            </p>
                        </Guide>
                    </FormBlock>
                )}
                {infoStates.hasNotChosenSoknad && !infoStates.isSelvstendigButNoForetakFound && (
                    <>
                        <FormBlock>
                            <AlertStripeAdvarsel>
                                Du kan ikke gå videre før du har valgt hva du ønsker å søke om.{' '}
                                {infoStates.isSelvstendigButNoForetakFound && <p>sdf</p>}
                            </AlertStripeAdvarsel>
                        </FormBlock>
                    </>
                )}

                {canContinue && (
                    <FormBlock>
                        <FormComponents.ConfirmationCheckbox
                            label={intlHelper(intl, 'samtykke.tekst')}
                            name={SoknadFormField.harForståttRettigheterOgPlikter}
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
            </QuestionVisibilityContext.Provider>
        </FormComponents.Form>
    );
};

export default SoknadEntryForm;
