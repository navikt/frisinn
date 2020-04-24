import React from 'react';
import VisibilityBlock from '../../context/VisibilityBlock';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { IntroFormField } from './intro-form/introFormConfig';

interface Props {
    question: IntroFormField;
    children: React.ReactNode;
}

const IntroFormQuestion = ({ question, children }: Props) => (
    <VisibilityBlock<IntroFormField> fieldName={question}>
        <FormBlock>{children}</FormBlock>
    </VisibilityBlock>
);

export default IntroFormQuestion;
