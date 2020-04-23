import React from 'react';
import { IntroFormField, IntroFormData, IntroFormQuestions } from './intro-form/introFormConfig';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '../../utils/dateUtils';

interface Props {
    question: IntroFormField;
    children: React.ReactNode;
}

const IntroFormQuestion = (values: IntroFormData, soknadsperiode: DateRange) => {
    const { isVisible } = IntroFormQuestions.getVisbility({
        ...values,
        soknadsperiode,
    });

    return function QuestionQrapper({ question, children }: Props) {
        if (isVisible(question)) {
            return <FormBlock>{children}</FormBlock>;
        }
        return null;
    };
};

export default IntroFormQuestion;
