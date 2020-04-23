import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { SoknadEntryFormQuestions } from './soknadEntryFormConfig';

interface Props {
    question: SoknadFormField;
    children: React.ReactNode;
}

const EntryFormQuestion = (values: SoknadFormData, isSelvstendig: boolean) => {
    const { isVisible } = SoknadEntryFormQuestions.getVisbility({
        ...values,
        isSelvstendig,
    });

    return function QuestionWrapper({ question, children }: Props) {
        if (isVisible(question)) {
            return <FormBlock>{children}</FormBlock>;
        }
        return null;
    };
};

export default EntryFormQuestion;
