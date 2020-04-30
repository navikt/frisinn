import { SoknadFormData, initialFrilanserValues } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const cleanupFrilanserStep = (values: SoknadFormData, frilanserSoknadIsOk: boolean): SoknadFormData => {
    if (frilanserSoknadIsOk === false || values.frilanserHarTaptInntektPgaKorona === YesOrNo.NO) {
        const cleanedValues = {
            ...values,
            ...initialFrilanserValues,
            frilanserHarTaptInntektPgaKorona: YesOrNo.NO,
        };
        return cleanedValues;
    }
    const cleanedValues: SoknadFormData = {
        ...values,
    };
    if (values.frilanserHarHattInntektSomSelvstendigIPerioden === YesOrNo.NO) {
        cleanedValues.frilanserInntektSomSelvstendigIPerioden = undefined;
    }
    return cleanedValues;
};
