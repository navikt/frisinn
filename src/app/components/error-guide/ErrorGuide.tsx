import React from 'react';
import Guide from '../guide/Guide';
import { Undertittel } from 'nav-frontend-typografi';
import VeilederSVG from '../veileder-svg/VeilederSVG';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    title: string;
    children: React.ReactNode;
    stillHappy?: boolean;
}

const ErrorGuide = ({ title, stillHappy, children }: Props) => (
    <Guide
        type="plakat"
        kompakt={true}
        fargetema="normal"
        svg={<VeilederSVG mood={stillHappy ? 'happy' : 'uncertain'} />}>
        <Undertittel tag="h2">{title}</Undertittel>
        <Box margin="m" padBottom="l">
            {children}
        </Box>
    </Guide>
);

export default ErrorGuide;
