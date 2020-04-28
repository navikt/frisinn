import React from 'react';
import QuestionVisibilityBlock from '../../components/question-visibility-block/QuestionVisibilityBlock';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { IntroFormField } from './intro-form/introFormConfig';

interface Props {
    question: IntroFormField;
    children: React.ReactNode;
}

const IntroFormQuestion = ({ question, children }: Props) => (
    <QuestionVisibilityBlock<IntroFormField> fieldName={question}>
        <FormBlock>{children}</FormBlock>
    </QuestionVisibilityBlock>
);

export default IntroFormQuestion;
