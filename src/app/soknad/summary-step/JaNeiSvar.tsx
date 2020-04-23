import React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
    harSvartJa?: boolean;
}

const JaNeiSvar: React.FunctionComponent<Props> = ({ harSvartJa }: Props) => {
    return <FormattedMessage id={harSvartJa === true ? 'Ja' : 'Nei'} tagName="span" />;
};

export default JaNeiSvar;
