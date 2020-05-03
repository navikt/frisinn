import React from 'react';
import { stringToSpacedCharString } from '../../utils/accessibility';

interface Props {
    str: string;
}

const SpacedCharString = ({ str }: Props) => <span aria-label={stringToSpacedCharString(str)}>{str}</span>;

export default SpacedCharString;
