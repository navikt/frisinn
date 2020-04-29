import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import DateView from '../../../components/date-view/DateView';
import InfoMessage from '../../../components/info-message/InfoMessage';
import PhoneView from '../../../components/phone-view/PhoneView';
import StopMessage from '../../../components/stop-message/StopMessage';
import SuksessMessage from '../../../components/suksess-message/SuksessMessage';
import { QuestionVisibilityContext } from '../../../context/QuestionVisibilityContext';
import { DateRange, getSisteGyldigeDagForInntektstapIPeriode } from '../../../utils/dateUtils';
import { hasValue } from '../../../validation/fieldValidations';
import FormSection from '../FormSection';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';
import Info from './IntroFormInfo';
import FormQuestion from './IntroFormQuestion';
import introFormUtils from './introFormUtils';
import IntroFormInfo from './IntroFormInfo';
import Guide from '../../../components/guide/Guide';
import VeilederSVG from '../../../components/veileder-svg/VeilederSVG';
import { Undertittel } from 'nav-frontend-typografi';

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
                    erFrilanser,
                    erSelvstendigNæringsdrivende,
                    selvstendigFårDekketTapet,
                    selvstendigHarTaptInntektPgaKorona,
                    selvstendigHarTattUtInntektFraSelskap,
                    selvstendigInntektstapStartetFørFrist,
                    selvstendigHarAlleredeSøkt,
                    frilanserFårDekketTapet,
                    frilanserInntektstapStartetFørFrist,
                    frilanserHarTaptInntektPgaKorona,
                    frilansHarAlleredeSøkt,
                    frilansVilFortsetteTilSøknad,
                    selvstendigVilFortsetteTilSøknad,
                } = values;

                const alderIsOk = introFormUtils.birthdateIsValid(fødselsdato, soknadsperiode);
                const selvstendigIsOk = introFormUtils.canApplyAsSelvstendig(values);
                const frilanserIsOk = introFormUtils.canApplyAsFrilanser(values);

                const sisteGyldigeDagForInntektstap: Date = getSisteGyldigeDagForInntektstapIPeriode(soknadsperiode);

                const canContinueToSoknad =
                    areAllQuestionsAnswered() && (selvstendigIsOk || frilanserIsOk) && alderIsOk;

                const canApplyAs = [
                    ...(selvstendigIsOk ? ['selvstendig næringsdrivende'] : []),
                    ...(frilanserIsOk ? ['frilanser'] : []),
                ];

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
                                    <FormQuestion question={IntroFormField.selvstendigHarTattUtInntektFraSelskap}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigHarTattUtInntektFraSelskap}
                                            legend={`Har du tatt ut inntekt fra selskapet/selskapene i 2019 og 2020?`}
                                            description={<Info.selvstendigHvaMenesMedInntekt />}
                                        />
                                        {selvstendigHarTattUtInntektFraSelskap === YesOrNo.NO && (
                                            <StopMessage>
                                                <Info.selvstendigIkkeTattUtInntekt />
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
                                    <FormQuestion question={IntroFormField.selvstendigHarAlleredeSøkt}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigHarAlleredeSøkt}
                                            legend="Har du søkt om andre utbetalinger fra NAV som skal dekke det samme inntektstapet du ønsker å søke kompensasjon for som selvstendig næringsdrivende i denne søknaden?"
                                        />
                                        {selvstendigHarAlleredeSøkt === YesOrNo.YES && (
                                            <InfoMessage margin="l">
                                                <Info.harAlleredeSøkt />
                                            </InfoMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigVilFortsetteTilSøknad}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigVilFortsetteTilSøknad}
                                            legend={
                                                'Vil du trekke den andre søknaden du har hos NAV og gå videre med denne søknaden?'
                                            }
                                        />
                                    </FormQuestion>

                                    {(selvstendigVilFortsetteTilSøknad === YesOrNo.YES ||
                                        selvstendigHarAlleredeSøkt === YesOrNo.NO) && (
                                        <SuksessMessage margin="l">
                                            Du kan søke om kompensasjon for tapt inntekt som selvstendig
                                            næringsdrivende.
                                            {selvstendigVilFortsetteTilSøknad === YesOrNo.YES &&
                                                selvstendigHarAlleredeSøkt === YesOrNo.YES && (
                                                    <p style={{ marginBottom: 0 }}>
                                                        For å trekke den andre søknaden din, må du ta kontakt med NAV på
                                                        telefon <PhoneView>55 55 33 33</PhoneView>.
                                                    </p>
                                                )}
                                        </SuksessMessage>
                                    )}
                                    {selvstendigVilFortsetteTilSøknad === YesOrNo.NO &&
                                        selvstendigHarAlleredeSøkt === YesOrNo.YES && (
                                            <StopMessage>
                                                <IntroFormInfo.vilIkkeTrekkeAnnenSøknadSelvstendig />
                                            </StopMessage>
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
                                            legend={'Har du tapt inntekt som frilanser som følge av koronautbruddet?'}
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
                                    </FormQuestion>

                                    <FormQuestion question={IntroFormField.frilansHarAlleredeSøkt}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.frilansHarAlleredeSøkt}
                                            legend="Har du søkt om andre utbetalinger fra NAV som skal dekke det samme inntektstapet du ønsker å søke kompensasjon som frilanser for i denne søknaden?"
                                        />
                                        {frilansHarAlleredeSøkt === YesOrNo.YES && (
                                            <InfoMessage margin="l">
                                                <Info.harAlleredeSøkt />
                                            </InfoMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.frilansVilFortsetteTilSøknad}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.frilansVilFortsetteTilSøknad}
                                            legend={
                                                'Vil du trekke den andre søknaden du har hos NAV og gå videre med denne søknaden?'
                                            }
                                        />
                                    </FormQuestion>

                                    {(frilansVilFortsetteTilSøknad === YesOrNo.YES ||
                                        frilansHarAlleredeSøkt === YesOrNo.NO) && (
                                        <SuksessMessage margin="l">
                                            Du kan søke om kompensasjon for tapt inntekt som frilanser.
                                            {frilansVilFortsetteTilSøknad === YesOrNo.YES &&
                                                frilansHarAlleredeSøkt === YesOrNo.YES && (
                                                    <p style={{ marginBottom: 0 }}>
                                                        For å trekke den andre søknaden din, må du ta kontakt med NAV på
                                                        telefon <PhoneView>55 55 33 33</PhoneView>.
                                                    </p>
                                                )}
                                        </SuksessMessage>
                                    )}
                                    {frilansVilFortsetteTilSøknad === YesOrNo.NO &&
                                        frilansHarAlleredeSøkt === YesOrNo.YES && (
                                            <StopMessage>
                                                <IntroFormInfo.vilIkkeTrekkeAnnenSøknadFrilanser />
                                            </StopMessage>
                                        )}
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
                                <>
                                    <FormBlock margin="xxl">
                                        <Guide svg={<VeilederSVG mood={'happy'} />} kompakt={true}>
                                            <Undertittel>Tips nå du søker som {canApplyAs.join(' og ')}</Undertittel>
                                            <p style={{ marginTop: '.5rem' }}>
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat ut, sit
                                                libero earum quaerat cumque deleniti. Eveniet, quos sed pariatur
                                                architecto atque quidem nam adipisci maxime, laborum, quis corporis
                                                enim?
                                            </p>
                                        </Guide>
                                    </FormBlock>
                                </>
                            )}
                        </QuestionVisibilityContext.Provider>
                    </FormComponent.Form>
                );
            }}
        />
    );
};

export default IntroForm;
