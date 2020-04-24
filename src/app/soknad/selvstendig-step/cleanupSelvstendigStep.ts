import { SoknadFormData, initialSelvstendigValues, SoknadFormField } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionVisibility } from '@navikt/sif-common-question-config/lib';

export const cleanupSelvstendigStep = (
    values: SoknadFormData,
    visibility: QuestionVisibility<SoknadFormField>,
    hasValidSelvstendigFormData: boolean
): SoknadFormData => {
    if (hasValidSelvstendigFormData === false || values.selvstendigHarTaptInntektPgaKorona === YesOrNo.NO) {
        const cleanedValues = {
            ...values,
            ...initialSelvstendigValues,
            selvstendigHarTaptInntektPgaKorona: YesOrNo.NO,
        };
        return cleanedValues;
    }
    return values;
};
