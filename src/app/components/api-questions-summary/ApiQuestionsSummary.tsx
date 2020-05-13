import React from 'react';
import { ApiSpørsmålOgSvar } from '../../types/SoknadApiData';
import SummaryBlock from '../summary-block/SummaryBlock';

interface Props {
    spørsmålOgSvar?: ApiSpørsmålOgSvar[];
}

const ApiQuestionsSummary = ({ spørsmålOgSvar }: Props) => {
    if (!spørsmålOgSvar || spørsmålOgSvar.length === 0) {
        return null;
    }
    return (
        <>
            {spørsmålOgSvar.map((s, key) => (
                <SummaryBlock key={key} header={s.spørsmål}>
                    {Array.isArray(s.svar) ? (
                        <ul className="infoList">
                            {s.svar.map((svar, index) => (
                                <li key={index}>{svar}</li>
                            ))}
                        </ul>
                    ) : (
                        s.svar
                    )}
                </SummaryBlock>
            ))}
        </>
    );
};

export default ApiQuestionsSummary;
