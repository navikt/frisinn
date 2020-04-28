import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import { BoxMargin } from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    margin?: BoxMargin;
    children: React.ReactNode;
}

const SuksessMessage = ({ children, margin }: Props) => (
    <FormBlock margin={margin}>
        <AlertStripeSuksess>{children}</AlertStripeSuksess>
    </FormBlock>
);

export default SuksessMessage;
