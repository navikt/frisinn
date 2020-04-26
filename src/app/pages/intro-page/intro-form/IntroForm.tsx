import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import DateView from '../../../components/date-view/DateView';
import { DateRange, getSisteGyldigeDagForInntektstapIPeriode } from '../../../utils/dateUtils';
import { hasValue } from '../../../validation/fieldValidations';
import FormSection from '../FormSection';
import InfoMessage from '../../../components/InfoMessage';
import IntroCheckList from '../IntroCheckList';
import FormQuestion from '../IntroFormQuestion';
import StopMessage from '../../../components/StopMessage';
import SuksessMessage from '../../../components/SuksessMessage';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';
import Info from './IntroFormInfo';
import introFormUtils from './introFormUtils';
import { QuestionVisibilityContext } from '../../../context/QuestionVisibilityContext';
import IntroFormInfo from './IntroFormInfo';

const FormComponent = getTypedFormComponents<IntroFormField, IntroFormData>();

interface Props {
    soknadsperiode: DateRange;
    onValidSubmit: (values: IntroFormData) => void;
}
const IntroForm = ({ onValidSubmit, soknadsperiode }: Props) => {
    const intl = useIntl();
    return (
        <FormComponent.FormikWrapper
            onSubmit={onValidSubmit}
            initialValues={{}}
            renderForm={({ values }) => {
                const visibility = IntroFormQuestions.getVisbility({
                    ...values,
                    soknadsperiode,
                });
                const { isVisible, areAllQuestionsAnswered } = visibility;

                const {
                    fødselsdato,
                    harAlleredeSøkt,
                    vilFortsetteTilSøknad,
                    erFrilanser,
                    erSelvstendigNæringsdrivende,
                    selvstendigFårDekketTapet,
                    selvstendigHarTaptInntektPgaKorona,
                    selvstendigHarTattUtLønn,
                    selvstendigInntektstapStartetFørFrist,
                    frilanserFårDekketTapet,
                    frilanserInntektstapStartetFørFrist,
                    frilanserHarTaptInntektPgaKorona,
                } = values;

                const alderIsOk = introFormUtils.birthdateIsValid(fødselsdato, soknadsperiode);
                const selvstendigIsOk = introFormUtils.canApplyAsSelvstendig(values);
                const frilanserIsOk = introFormUtils.canApplyAsFrilanser(values);
                const harAlleredeSøktIsOk = harAlleredeSøkt === YesOrNo.NO || vilFortsetteTilSøknad === YesOrNo.YES;

                const sisteGyldigeDagForInntektstap: Date = getSisteGyldigeDagForInntektstapIPeriode(soknadsperiode);

                const canContinueToSoknad =
                    areAllQuestionsAnswered() && (selvstendigIsOk || frilanserIsOk) && alderIsOk && harAlleredeSøktIsOk;

                return (
                    <FormComponent.Form
                        includeValidationSummary={true}
                        includeButtons={canContinueToSoknad}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel="Gå videre til søknaden">
                        <QuestionVisibilityContext.Provider value={{ visibility }}>
                            <FormSection>
                                <FormQuestion question={IntroFormField.fødselsdato}>
                                    <FormComponent.DatePicker
                                        name={IntroFormField.fødselsdato}
                                        label="Når er du født?"
                                        showYearSelector={true}
                                        dayPickerProps={{ initialMonth: new Date(1995, 0, 1) }}
                                        dateLimitations={{ maksDato: moment.utc().subtract(17, 'years').toDate() }}
                                    />
                                    {hasValue(fødselsdato) && !alderIsOk && (
                                        <StopMessage>
                                            <Info.ikkeGyldigAlder periode={soknadsperiode} />
                                        </StopMessage>
                                    )}
                                </FormQuestion>
                            </FormSection>

                            {isVisible(IntroFormField.erSelvstendigNæringsdrivende) && (
                                <FormSection title="Selvstendig næringsdrivende">
                                    <FormQuestion question={IntroFormField.erSelvstendigNæringsdrivende}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.erSelvstendigNæringsdrivende}
                                            legend={
                                                'Er du registrert som selvstendig næringsdrivende før 1. mars 2020?'
                                            }
                                        />
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigHarTattUtLønn}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigHarTattUtLønn}
                                            legend={'Har du tatt hatt inntekt fra dine foretak i 2019 og 2020?'}
                                            description={<Info.selvstendigLønn />}
                                        />
                                        {selvstendigHarTattUtLønn === YesOrNo.NO && (
                                            <StopMessage>
                                                <Info.selvstendigIkkeTattUtLønn />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigHarTaptInntektPgaKorona}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigHarTaptInntektPgaKorona}
                                            legend={
                                                'Har du tapt inntekt som selvstendig næringsdrivende som følge av koronautbruddet? '
                                            }
                                            description={<Info.hvaRegnesSomInntektstap />}
                                        />
                                        {selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
                                            <StopMessage>
                                                <Info.selvstendigIkkeTapPgaKorona />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigInntektstapStartetFørFrist}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigInntektstapStartetFørFrist}
                                            legend={
                                                <span>
                                                    Startet inntektstapet ditt som selvstendig næringsdrivende før{' '}
                                                    <DateView date={sisteGyldigeDagForInntektstap} />?
                                                </span>
                                            }
                                            description={<Info.hvaErStartdatoForInntektstap />}
                                        />
                                        {selvstendigInntektstapStartetFørFrist === YesOrNo.NO && (
                                            <StopMessage>
                                                <Info.selvstendigForSentInntektstap />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigFårDekketTapet}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigFårDekketTapet}
                                            legend={
                                                'Har du allerede en utbetaling fra NAV som dekker hele inntektstapet ditt som selvstendig næringsdrivende? '
                                            }
                                            description={<Info.fårDekketTapetSomSelvstendigForklaring />}
                                        />
                                        {selvstendigFårDekketTapet === YesOrNo.YES && (
                                            <StopMessage>
                                                <Info.selvstendigFårDekketTapet />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    {selvstendigFårDekketTapet === YesOrNo.NO && (
                                        <SuksessMessage>
                                            Du kan søke om kompensasjon for tapt inntekt som selvstendig
                                            næringsdrivende.
                                        </SuksessMessage>
                                    )}
                                </FormSection>
                            )}
                            {isVisible(IntroFormField.erFrilanser) && (
                                <FormSection title="Frilanser">
                                    <FormQuestion question={IntroFormField.erFrilanser}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.erFrilanser}
                                            legend={'Er du frilanser?'}
                                            description={<Info.frilanserNAVsDefinisjon />}
                                        />
                                    </FormQuestion>
                                    {erSelvstendigNæringsdrivende === YesOrNo.NO && erFrilanser === YesOrNo.NO && (
                                        <StopMessage>
                                            <IntroFormInfo.ikkeFrilanserOgIkkeRettSomSelvstendig />
                                        </StopMessage>
                                    )}
                                    <FormQuestion question={IntroFormField.frilanserHarTaptInntektPgaKorona}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.frilanserHarTaptInntektPgaKorona}
                                            legend={
                                                'Har du tapt inntekt som frilanser i perioden på grunn av koronasituasjonen?'
                                            }
                                        />
                                        {frilanserHarTaptInntektPgaKorona === YesOrNo.NO && (
                                            <StopMessage>
                                                <Info.frilanserIkkeTapPgaKorona />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.frilanserInntektstapStartetFørFrist}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.frilanserInntektstapStartetFørFrist}
                                            legend={
                                                <span>
                                                    Startet inntektstapet ditt som frilanser før{' '}
                                                    <DateView date={sisteGyldigeDagForInntektstap} />?
                                                </span>
                                            }
                                            description={<Info.hvaErStartdatoForInntektstap />}
                                        />
                                        {frilanserInntektstapStartetFørFrist === YesOrNo.NO && (
                                            <StopMessage>
                                                <Info.frilanserForSentInntektstap />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.frilanserFårDekketTapet}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.frilanserFårDekketTapet}
                                            legend={
                                                'Har du allerede en utbetaling fra NAV som dekker inntektstapet ditt som frilanser?'
                                            }
                                            description={<Info.fårDekketTapetSomFrilanserForklaring />}
                                        />
                                        {frilanserFårDekketTapet === YesOrNo.YES && (
                                            <StopMessage>
                                                <Info.frilanserFårDekketTapet />
                                            </StopMessage>
                                        )}
                                        {frilanserFårDekketTapet === YesOrNo.NO && (
                                            <SuksessMessage>
                                                Du kan søke om kompensasjon for tapt inntekt som frilanser.
                                            </SuksessMessage>
                                        )}
                                    </FormQuestion>
                                </FormSection>
                            )}

                            {isVisible(IntroFormField.harAlleredeSøkt) && (
                                <FormSection title="Har du søkt om andre utbetalinger fra NAV?">
                                    <FormQuestion question={IntroFormField.harAlleredeSøkt}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.harAlleredeSøkt}
                                            legend="Har du søkt om andre utbetalinger fra NAV som skal dekke det samme inntektstapet du ønsker å søke kompensasjon for i denne søknaden?"
                                        />
                                        {harAlleredeSøkt === YesOrNo.YES && (
                                            <InfoMessage>
                                                <Info.harAlleredeSøkt />
                                            </InfoMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.vilFortsetteTilSøknad}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.vilFortsetteTilSøknad}
                                            legend={
                                                'Vil du trekke den andre søknaden du har hos NAV og gå videre med denne søknaden?'
                                            }
                                        />
                                    </FormQuestion>
                                </FormSection>
                            )}
                            {erFrilanser === YesOrNo.NO &&
                                erSelvstendigNæringsdrivende === YesOrNo.YES &&
                                !selvstendigIsOk && (
                                    <StopMessage>
                                        <Info.selvstendigIkkeOkOgErIkkeFrilanser />
                                    </StopMessage>
                                )}
                            {canContinueToSoknad && (
                                <FormBlock>
                                    <IntroCheckList />
                                </FormBlock>
                            )}
                        </QuestionVisibilityContext.Provider>
                    </FormComponent.Form>
                );
            }}
        />
    );
};

export default IntroForm;
