import React from 'react';
import { FormattedNumber } from 'react-intl';

interface Props {
    verdi?: number;
}

const TallSvar: React.FunctionComponent<Props> = ({ verdi }: Props) =>
    verdi !== undefined ? <FormattedNumber value={verdi} /> : null;

export default TallSvar;
