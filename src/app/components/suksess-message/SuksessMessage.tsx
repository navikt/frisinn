import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';

interface Props {
    children: React.ReactNode;
}

const SuksessMessage = ({ children }: Props) => (
    <FormBlock>
        <AlertStripeSuksess>{children}</AlertStripeSuksess>
    </FormBlock>
);

export default SuksessMessage;
