import React from 'react';
import { SoknadFormField } from '../../types/SoknadFormData';
import QuestionVisibilityBlock from '../../components/question-visibility-block/QuestionVisibilityBlock';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { BoxMargin } from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    question: SoknadFormField;
    children: React.ReactNode;
    margin?: BoxMargin;
}

const SelvstendigFormQuestion = ({ question, children, margin }: Props) => (
    <QuestionVisibilityBlock<SoknadFormField> fieldName={question}>
        <FormBlock margin={margin}>{children}</FormBlock>
    </QuestionVisibilityBlock>
);

export default SelvstendigFormQuestion;
