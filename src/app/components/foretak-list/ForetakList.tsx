import React from 'react';
import { Foretak } from '../../types/ApplicationEssentials';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    foretak: Foretak[];
}

const ForetakList = ({ foretak }: Props) => (
    <div>
        <ul>
            {foretak.map((f) => {
                return (
                    <li key={f.organisasjonsnummer}>
                        <div>{f.navn}</div>
                        Orgnr: {f.organisasjonsnummer}:. Registrert {prettifyDate(f.registreringsdato)}
                    </li>
                );
            })}
        </ul>
    </div>
);

export default ForetakList;
