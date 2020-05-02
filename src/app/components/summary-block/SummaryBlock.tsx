import React from 'react';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    header: string;
    children: React.ReactElement<any> | Array<React.ReactElement<any>> | React.ReactNode;
}

const SummaryBlock: React.FunctionComponent<Props> = ({ header, children }: Props) => (
    <Box margin="l">
        <ContentWithHeader header={header}>{children}</ContentWithHeader>
    </Box>
);

export default SummaryBlock;
