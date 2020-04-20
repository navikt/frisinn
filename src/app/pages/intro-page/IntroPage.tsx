import React, { useEffect, useState } from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import { getSøknadsperiode } from '../../api/perioder';
import DateView from '../../components/date-view/DateView';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import { relocateToApplication } from '../../utils/navigationUtils';
import IntroForm from './intro-form/IntroForm';

const bem = bemUtils('introPage');

interface LoadState {
    isLoading: boolean;
    error?: boolean;
}

const IntroPage: React.StatelessComponent = () => {
    const [currentPeriode, setCurrentPeriode] = useState<DateRange>();
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: true });
    const [formIsVisible, showForm] = useState<boolean>(false);

    async function loadPageData() {
        try {
            const søknadsperiode = await getSøknadsperiode();
            setCurrentPeriode(søknadsperiode);
            setLoadState({ isLoading: false, error: false });
        } catch (error) {
            setLoadState({ isLoading: false, error: true });
        }
    }

    useEffect(() => {
        loadPageData();
    }, []);

    return (
        <Page
            className={bem.block}
            title="Introside"
            topContentRenderer={() => (
                <StepBanner text="Inntektskompensasjon for selvstendig næringsdrivende (ENK) og frilansere" />
            )}>
            <LoadWrapper
                isLoading={loadState.isLoading}
                contentRenderer={() => {
                    if (!currentPeriode) {
                        return null;
                    }
                    return (
                        <>
                            <Box margin="xxxl" padBottom="xxl">
                                <InformationPoster>
                                    <Box margin="xl">
                                        <Systemtittel>
                                            Inntektskompensasjon for selvstendig næringsdrivende (ENK) og frilansere.
                                        </Systemtittel>
                                        <Ingress tag="div">
                                            <p>
                                                Dersom du er selvstendig næringsdrivende med personlige foretak og/eller
                                                frilanser, og har mistet hele eller deler av inntekten din på grunn av
                                                korona-pandemien, kan du søke om kompensasjon for dette. Ordningen er
                                                midlertidig, og en ...
                                            </p>
                                            <p>
                                                En søker for én måned om gangen, og første måned en kan søke for er{' '}
                                                <strong>
                                                    <DateView date={currentPeriode.to} format="monthAndYear" />
                                                </strong>
                                                .
                                            </p>
                                        </Ingress>
                                    </Box>
                                </InformationPoster>
                            </Box>
                            <Box>
                                <Systemtittel>Sjekk om du kan få søke</Systemtittel>
                                <Ingress tag="div">
                                    <p>
                                        Svar på spørsmålene nedenfor og som du du kan ha rett på denne kompensasjonen.
                                        Hvis du har det, vil du kunne gå videre til søknaden, hvor du må logge inn med
                                        elektronisk ID.
                                    </p>
                                </Ingress>
                            </Box>
                            {formIsVisible === false && (
                                <>
                                    <Box textAlignCenter={true}>
                                        <Knapp onClick={() => showForm(true)}>Vis spørsmål</Knapp>
                                    </Box>
                                </>
                            )}
                            {formIsVisible && (
                                <Panel>
                                    <IntroForm onValidSubmit={() => relocateToApplication()} />
                                </Panel>
                            )}
                        </>
                    );
                }}
            />
        </Page>
    );
};

export default IntroPage;
