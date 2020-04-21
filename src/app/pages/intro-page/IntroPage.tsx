import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Ingress, Undertittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import useCurrentPeriode from '../../hooks/useCurrentPeriode';
import { relocateToApplication } from '../../utils/navigationUtils';
import IntroForm from './intro-form/IntroForm';

const bem = bemUtils('introPage');

const IntroPage: React.StatelessComponent = () => {
    const { isLoading, currentPeriode } = useCurrentPeriode();

    return (
        <Page
            className={bem.block}
            title="Introside"
            topContentRenderer={() => (
                <StepBanner text="Inntektskompensasjon for selvstendig næringsdrivende (ENK) og frilansere" />
            )}>
            <LoadWrapper
                isLoading={isLoading}
                contentRenderer={() => {
                    if (!currentPeriode) {
                        return null;
                    }
                    return (
                        <>
                            <Box margin="xxxl">
                                <InformationPoster>
                                    <Box margin="xl">
                                        <Ingress tag="div">
                                            <p>
                                                Dersom du er selvstendig næringsdrivende med personlige foretak og/eller
                                                frilanser, og har mistet hele eller deler av inntekten din på grunn av
                                                korona-pandemien, kan du søke om kompensasjon for dette. Ordningen er
                                                midlertidig, og en ...
                                            </p>
                                        </Ingress>
                                        <Undertittel>Perioden du kan søke for: </Undertittel>
                                        <Ingress>
                                            <DateRangeView dateRange={currentPeriode} />.
                                        </Ingress>
                                    </Box>
                                </InformationPoster>
                            </Box>
                            <Box margin="xxl">
                                <Undertittel>Sjekk om du kan få søke</Undertittel>
                                <p>
                                    Svar på spørsmålene nedenfor for å se om du har rett på denne kompansasjonen Hvis du
                                    har det, vil du kunne gå videre til søknaden, hvor du må logge deg inn med
                                    elektonisk ID.
                                </p>
                                <p>
                                    Om du har kombinasjonsinntekt som både selvstending næringsdrivende (ENK, DA/ANS) og
                                    frilans krysser du av at du er begge. Inne i søknaden vil du bli bedt om å oppgi
                                    inntektene separat.
                                </p>
                            </Box>
                            <Panel>
                                <IntroForm
                                    onValidSubmit={() => relocateToApplication()}
                                    currentPeriode={currentPeriode}
                                />
                            </Panel>
                        </>
                    );
                }}
            />
        </Page>
    );
};

export default IntroPage;
