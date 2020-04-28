import React from 'react';
import { SoknadFormField } from '../../types/SoknadFormData';
import QuestionVisibilityBlock from '../../components/question-visibility-block/QuestionVisibilityBlock';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';

interface Props {
    question: SoknadFormField;
    children: React.ReactNode;
}

const FrilanserFormQuestion = ({ question, children }: Props) => (
    <QuestionVisibilityBlock<SoknadFormField> fieldName={question}>
        <FormBlock>{children}</FormBlock>
    </QuestionVisibilityBlock>
);

export default FrilanserFormQuestion;
