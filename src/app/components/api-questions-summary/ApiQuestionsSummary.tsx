import React from 'react';
import { ApiQuestion } from '../../types/SoknadApiData';
import SummaryBlock from '../summary-block/SummaryBlock';

interface Props {
    questions?: ApiQuestion[];
}

const ApiQuestionsSummary = ({ questions }: Props) => {
    if (!questions || questions.length === 0) {
        return null;
    }
    return (
        <>
            {questions.map((q, key) => (
                <SummaryBlock key={key} header={q.question}>
                    {q.answer}
                </SummaryBlock>
            ))}
        </>
    );
};

export default ApiQuestionsSummary;
