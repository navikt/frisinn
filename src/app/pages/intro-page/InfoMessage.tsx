import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

interface Props {
    children: React.ReactNode;
}

const InfoMessage = ({ children }: Props) => (
    <FormBlock>
        <AlertStripeInfo>{children}</AlertStripeInfo>
    </FormBlock>
);

export default InfoMessage;
