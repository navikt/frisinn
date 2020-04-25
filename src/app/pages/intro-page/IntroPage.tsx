import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst, Ingress, Systemtittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import useSoknadsperiode from '../../hooks/useSoknadsperiode';
import { relocateToSoknad } from '../../utils/navigationUtils';
import IntroForm from './intro-form/IntroForm';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import useApiGet from '../../hooks/useApiGet';
import { ApiEndpoint } from '../../api/api';
import Guide from '../../components/guide/Guide';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';

const bem = bemUtils('introPage');

const IntroPage: React.StatelessComponent = () => {
    const soknadsperiode = useSoknadsperiode();
    const soknadErTilgjengelig = useApiGet(ApiEndpoint.tilgjengelig);

    const isLoading = soknadsperiode.isLoading || soknadErTilgjengelig.isLoading;

    return (
        <Page
            className={bem.block}
            title="Inntektskompensasjon for selvstendig næringsdrivende (ENK) og frilansere"
            topContentRenderer={() => (
                <StepBanner text="Inntektskompensasjon for selvstendig næringsdrivende (ENK) og frilansere" />
            )}>
            <LoadWrapper
                isLoading={isLoading}
                contentRenderer={() => {
                    if (!soknadsperiode.soknadsperiode) {
                        return null;
                    }
                    if (soknadErTilgjengelig.error?.response?.status === 503) {
                        return (
                            <Box margin="xxxl">
                                <Guide svg={<VeilederSVG mood="uncertain" />} kompakt={true} type="plakat">
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
                                            Dette er en <strong>ny og midlertidig ordning</strong> som er opprettet som
                                            en følge av koronasituasjonen. Den er for deg som er selvstendig
                                            næringsdrivende og/eller frilanser som helt eller delvis har tapt inntekt på
                                            grunn av koronautbruddet.
                                        </p>
                                        <p>
                                            Er du selvstendig næringsdrivende må du enten ha et enkeltpersonforetak
                                            (EK), et ansvarlig selskap (ANS), eller et ansvarlig selskap med delt ansvar
                                            (DA). Selskapet må være registrert før 1. mars 2020.
                                        </p>
                                        <p>
                                            Ordningen trådte i kraft fra 16. Mars 2020. De første 16 dagene av
                                            inntektstapet må du dekke selv.
                                        </p>
                                        <p>
                                            Perioden du kan søke om nå, er{' '}
                                            <DateRangeView dateRange={soknadsperiode.soknadsperiode} />. Kompensasjon
                                            for inntektstap i mai, kan du søke om i begynnelsen av juni.
                                        </p>
                                    </Normaltekst>
                                </InformationPoster>
                            </Box>
                            <Box margin="xl">
                                <Panel>
                                    <Undertittel className="sectionTitle">Sjekk om du kan søke</Undertittel>
                                    <p>For å kunne søke kompensasjon for tapt inntekt gjennom denne ordningen, må du</p>
                                    <ul className="infoList">
                                        <li>være fylt 18 år</li>
                                        <li>ikke ha fylt 67 år</li>
                                        <li>ha tapt inntekt som følge av koronasituasjonen</li>
                                        <li>
                                            ikke motta annen utbetaling fra NAV som kompenserer det samme inntektstapet
                                        </li>
                                    </ul>
                                    <p>
                                        Vi vil nå stille deg noen spørsmål som avgjør om du kan søke, og om du kan ha
                                        rett på denne kompensasjonen.
                                    </p>
                                    <IntroForm
                                        onValidSubmit={() => relocateToSoknad()}
                                        soknadsperiode={soknadsperiode.soknadsperiode}
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
