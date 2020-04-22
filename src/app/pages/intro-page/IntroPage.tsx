import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst, Ingress, Systemtittel } from 'nav-frontend-typografi';
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
import useApiGet from '../../hooks/useApiGet';
import { ApiEndpoint } from '../../api/api';
import Guide from '../../components/guide/Guide';
import AppVeilederSVG from '../../components/app-veileder-svg/AppVeilederSVG';

const bem = bemUtils('introPage');

const IntroPage: React.StatelessComponent = () => {
    const periode = useCurrentPeriode();
    const erTilgjengelig = useApiGet(ApiEndpoint.tilgjengelig);

    const isLoading = periode.isLoading || erTilgjengelig.isLoading;
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
                    if (!periode.currentPeriode) {
                        return null;
                    }
                    if (erTilgjengelig.error?.response?.status === 503) {
                        return (
                            <Box margin="xxxl">
                                <Guide svg={<AppVeilederSVG mood="uncertain" />} kompakt={true} type="plakat">
                                    <Box padBottom="m">
                                        <Systemtittel>Søknaden er ikke tilgjengelig</Systemtittel>
                                    </Box>
                                    <Ingress>
                                        Søknaden er dessverre ikke tilgjengelig akkurat nå. Vennligst prøv igjen på et
                                        senere tidspunkt.
                                    </Ingress>
                                </Guide>
                            </Box>
                        );
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
                                                <DateRangeView dateRange={periode.currentPeriode} />
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
                                        currentPeriode={periode.currentPeriode}
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
