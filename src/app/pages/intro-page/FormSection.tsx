import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Undertittel } from 'nav-frontend-typografi';

interface Props {
    title?: string;
    children: React.ReactNode;
}

const FormSection = ({ children, title }: Props) => (
    <div>
        <Box margin="xxl">
            {title && <Undertittel className="sectionTitle">{title}</Undertittel>}
            {children}
        </Box>
    </div>
);

export default FormSection;
