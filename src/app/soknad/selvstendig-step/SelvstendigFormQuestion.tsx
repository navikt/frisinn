import React from 'react';
import { SoknadFormField } from '../../types/SoknadFormData';
import VisibilityBlock from '../../context/VisibilityBlock';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';

interface Props {
    question: SoknadFormField;
    children: React.ReactNode;
}

const SelvstendigFormQuestion = ({ question, children }: Props) => (
    <VisibilityBlock<SoknadFormField> fieldName={question}>
        <FormBlock>{children}</FormBlock>
    </VisibilityBlock>
);

export default SelvstendigFormQuestion;
