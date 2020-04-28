import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { BoxMargin } from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    margin?: BoxMargin;
    children: React.ReactNode;
}

const InfoMessage = ({ margin, children }: Props) => (
    <FormBlock margin={margin}>
        <AlertStripeInfo>{children}</AlertStripeInfo>
    </FormBlock>
);

export default InfoMessage;
