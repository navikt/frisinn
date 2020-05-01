import React from 'react';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Foretak } from '../../types/SoknadEssentials';

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
                        Orgnr: {f.organisasjonsnummer}: Registrert {prettifyDate(f.registreringsdato)}
                    </li>
                );
            })}
        </ul>
    </div>
);

export default ForetakList;
