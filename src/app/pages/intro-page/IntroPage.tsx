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
import DateRangeView from '../../components/date-range-view/DateRangeView';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';

const bem = bemUtils('introPage');

interface LoadState {
    isLoading: boolean;
    error?: boolean;
}

const IntroPage: React.StatelessComponent = () => {
    const [dateRanges, setDateRanges] = useState<ApplicationDateRanges>();
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: true });
    const [formIsVisible, showForm] = useState<boolean>(true);

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
        <Page className={bem.block} title="Introside" topContentRenderer={() => <StepBanner text="Introside" />}>
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
                                    <p>
                                        Sjekk om du kan søke på Korona Cash for Selvstendinge (ENK) og Frilansere. svar
                                        på spørsmålene under, hvis du kan søke vil de ta deg til søknaden. da vil du bli
                                        spurt om å logge inn med elekronisk ID.
                                    </p>
                                    <Box margin="xl">
                                        <p>
                                            Søknadsperioden en kan søke for nå er{' '}
                                            <strong>
                                                <DateRangeView dateRange={applicationDateRange} />
                                            </strong>
                                        </p>
                                        <p>
                                            Selvstendig næringsdrivende kan søke for denne perioden i tidsrommet{' '}
                                            <DateRangeView dateRange={selvstendigDateRange} />, mens frilansere kan søke
                                            i tidsrommet i perioden <DateRangeView dateRange={frilansDateRange} />.
                                        </p>
                                    </Box>
                                </InformationPoster>
                            </Box>
                            {formIsVisible === false && (
                                <Box textAlignCenter={true}>
                                    <Knapp onClick={() => showForm(true)}>Se om du kan få</Knapp>
                                </Box>
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
