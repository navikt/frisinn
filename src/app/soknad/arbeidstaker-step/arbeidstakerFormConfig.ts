import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { ArbeidstakerFormData, SoknadFormField } from '../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';

const Field = SoknadFormField;

export type ArbeidstakerFormConfigPayload = ArbeidstakerFormData & SoknadEssentials;

const ArbeidstakerFormConfig: QuestionConfig<ArbeidstakerFormConfigPayload, SoknadFormField> = {
    [Field.arbeidstakerErArbeidstaker]: {
        isAnswered: ({ arbeidstakerErArbeidstaker }) => yesOrNoIsAnswered(arbeidstakerErArbeidstaker),
    },
    [Field.arbeidstakerHarHattInntektIPerioden]: {
        isIncluded: ({ arbeidstakerErArbeidstaker }) => arbeidstakerErArbeidstaker === YesOrNo.YES,
        isAnswered: ({ arbeidstakerHarHattInntektIPerioden }) => yesOrNoIsAnswered(arbeidstakerHarHattInntektIPerioden),
    },
    [Field.arbeidstakerInntektIPerioden]: {
        isIncluded: ({ arbeidstakerHarHattInntektIPerioden, arbeidstakerErArbeidstaker }) =>
            arbeidstakerHarHattInntektIPerioden === YesOrNo.YES && arbeidstakerErArbeidstaker === YesOrNo.YES,
        isAnswered: ({ arbeidstakerInntektIPerioden }) => hasValue(arbeidstakerInntektIPerioden),
    },
};

export const ArbeidstakerFormQuestions = Questions<ArbeidstakerFormConfigPayload, SoknadFormField>(
    ArbeidstakerFormConfig
);
