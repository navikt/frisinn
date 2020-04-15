import React, { useState, useEffect } from 'react';
import Box from 'common/components/box/Box';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import { navigateToApplication } from '../../utils/navigationUtils';
import IntroForm from './intro-form/IntroForm';
import { ApplicationDateRanges } from '../../types/ApplicationEssentials';
import { getPerioder } from '../../api/perioder';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import DateView from '../../components/date-view/DateView';

const bem = bemUtils('introPage');

interface LoadState {
    isLoading: boolean;
    error?: boolean;
}

const IntroPage: React.StatelessComponent = () => {
    const [dateRanges, setDateRanges] = useState<ApplicationDateRanges>();
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: true });
    const [formIsVisible, showForm] = useState<boolean>(false);

    async function loadPageData() {
        try {
            const søknadsperioder = await getPerioder();
            setDateRanges(søknadsperioder);
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
                    if (!dateRanges) {
                        return null;
                    }
                    const { frilansDateRange, applicationDateRange, selvstendigDateRange } = dateRanges;
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
                                                Dersom du er selvstendig næringsdrivende med enkeltpersonforetak
                                                og/eller frilanser, og har mistet hele eller deler av inntekten din på
                                                grunn av korona-pandemien, kan du søke om kompensasjon for dette.
                                                Ordningen er midlertidig, og en ...
                                            </p>
                                            <p>
                                                En søker for én måned om gangen, og første måned en kan søke for er{' '}
                                                <strong>
                                                    <DateView date={applicationDateRange.to} format="monthAndYear" />
                                                </strong>
                                                . Selvstendig næringsdrivende kan søke fra og med{' '}
                                                <strong>
                                                    <DateView date={selvstendigDateRange.from} />
                                                </strong>
                                                , mens frilansere kan søke fra og med{' '}
                                                <strong>
                                                    <DateView date={frilansDateRange.from} />
                                                </strong>
                                                .
                                            </p>
                                        </Ingress>
                                    </Box>
                                </InformationPoster>
                            </Box>
                            <Box>
                                <Systemtittel>Sjekk om du kan få søke</Systemtittel>
                                <Ingress>
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
                                    <IntroForm onValidSubmit={() => navigateToApplication()} />
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
