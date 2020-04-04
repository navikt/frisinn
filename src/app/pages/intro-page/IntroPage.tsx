import React from 'react';
import Box from 'common/components/box/Box';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import bemUtils from 'common/utils/bemUtils';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import IntroForm from './intro-form/IntroForm';
import { navigateToApplication } from '../../utils/navigationUtils';

const bem = bemUtils('introPage');

const IntroPage: React.StatelessComponent = () => {
    return (
        <Page className={bem.block} title="Introside" topContentRenderer={() => <StepBanner text="Introside" />}>
            <Box margin="xxxl" padBottom="xxl">
                <InformationPoster>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam, culpa. Accusamus eveniet optio
                    tenetur fugiat soluta magni at eligendi saepe, dignissimos incidunt deserunt officia dolores! Eaque
                    quaerat vel ab tempora.
                </InformationPoster>
            </Box>
            <FormBlock>
                <IntroForm onValidSubmit={() => navigateToApplication()} />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
