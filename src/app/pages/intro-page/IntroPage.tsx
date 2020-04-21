import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import useCurrentPeriode from '../../hooks/useCurrentPeriode';
import { relocateToApplication } from '../../utils/navigationUtils';
import IntroForm from './intro-form/IntroForm';
import InformationPoster from 'common/components/information-poster/InformationPoster';

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
                                    <Undertittel>
                                        Søknad om kompensasjon for tapt inntekt for selvstendig næringsdrivende (ENK,
                                        DA/ANS) og frilansere
                                    </Undertittel>
                                    <Normaltekst tag="div">
                                        <p>
                                            Dersom du mistet hele eller deler av inntekten din på grunn av
                                            korona-pandemien, kan du søke om kompensasjon for dette. De første 16 dagene
                                            etter at du startet å miste inntekt, må du dekke selv, mens dagene etter kan
                                            du få kompensasjon for.
                                            <br /> Dette er en midlertidig ordning.
                                        </p>
                                        <p>
                                            Ordningen er lagt opp slik at du søker for én og én periode i etterkant av
                                            perioden. Perioden du kan søke kompensasjon for nå er{' '}
                                            <strong>
                                                <DateRangeView dateRange={currentPeriode} />
                                            </strong>
                                            .
                                        </p>
                                    </Normaltekst>
                                </InformationPoster>
                            </Box>
                            <Box margin="xl">
                                <Panel>
                                    <Box padBottom="l">
                                        <Undertittel className="sectionTitle">Sjekk om du kan søke</Undertittel>
                                        <p>
                                            Svar på spørsmålene nedenfor for å se om du har rett på denne kompansasjonen
                                            Hvis du har det, vil du kunne gå videre til søknaden, hvor du må logge deg
                                            inn med elektronisk ID.
                                        </p>
                                        <p>
                                            Om du har kombinasjonsinntekt som både selvstending næringsdrivende (ENK,
                                            DA/ANS) og frilans krysser du av at du er begge. Inne i søknaden vil du bli
                                            bedt om å oppgi inntektene separat.
                                        </p>
                                    </Box>
                                    <IntroForm
                                        onValidSubmit={() => relocateToApplication()}
                                        currentPeriode={currentPeriode}
                                    />
                                </Panel>
                            </Box>
                        </>
                    );
                }}
            />
        </Page>
    );
};

export default IntroPage;
