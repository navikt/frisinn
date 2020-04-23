import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

interface Props {
    children: React.ReactNode;
}

const StopMessage = ({ children }: Props) => (
    <FormBlock>
        <AlertStripeAdvarsel>{children}</AlertStripeAdvarsel>
    </FormBlock>
);

export default StopMessage;
