import React, { useState, useEffect } from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
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
import { Undertittel } from 'nav-frontend-typografi';
import DateRangeView from '../../components/date-range-view/DateRangeView';

const bem = bemUtils('introPage');

interface LoadState {
    isLoading: boolean;
    error?: boolean;
}

const IntroPage: React.StatelessComponent = () => {
    const [dateRanges, setDateRanges] = useState<ApplicationDateRanges>();
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: true });

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
            <Box margin="xxxl" padBottom="xxl">
                <InformationPoster>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam, culpa. Accusamus eveniet optio
                    tenetur fugiat soluta magni at eligendi saepe, dignissimos incidunt deserunt officia dolores! Eaque
                    quaerat vel ab tempora.
                </InformationPoster>
            </Box>
            <LoadWrapper
                isLoading={loadState.isLoading}
                contentRenderer={() => {
                    if (!dateRanges) {
                        return null;
                    }
                    const { frilansDateRange, applicationDateRange, selvstendigDateRange } = dateRanges;
                    return (
                        <>
                            <FormBlock>
                                <Undertittel>Perioder og frister</Undertittel>
                                <p>
                                    Periode det søkes for: <DateRangeView dateRange={applicationDateRange} />
                                </p>
                                <p>
                                    Gyldig søknadsperiode for frilansere: <DateRangeView dateRange={frilansDateRange} />
                                </p>
                                <p>
                                    Gyldig søknadsperiode for selvstendig næringsdrivende:{' '}
                                    <DateRangeView dateRange={selvstendigDateRange} />
                                </p>
                                <IntroForm onValidSubmit={() => navigateToApplication()} />
                            </FormBlock>{' '}
                        </>
                    );
                }}
            />
        </Page>
    );
};

export default IntroPage;
