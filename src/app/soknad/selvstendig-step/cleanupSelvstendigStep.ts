import { SoknadFormData, initialSelvstendigValues } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const cleanupSelvstendigStep = (values: SoknadFormData): SoknadFormData => {
    if (values.selvstendigHarHattInntektFraForetak === YesOrNo.NO) {
        const cleanedValues = {
            ...values,
            ...initialSelvstendigValues,
            selvstendigHarHattInntektFraForetak: YesOrNo.NO,
        };
        return cleanedValues;
    }
    if (values.selvstendigHarTaptInntektPgaKorona === YesOrNo.NO) {
        const cleanedValues = {
            ...values,
            ...initialSelvstendigValues,
            selvstendigHarTaptInntektPgaKorona: YesOrNo.NO,
        };
        return cleanedValues;
    }
    const cleanedValues: SoknadFormData = {
        ...values,
    };
    if (values.selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.NO) {
        cleanedValues.selvstendigInntektSomFrilanserIPerioden = undefined;
    }
    if (cleanedValues.selvstendigHarRegnskapsfører === YesOrNo.NO) {
        cleanedValues.selvstendigRegnskapsførerNavn = undefined;
        cleanedValues.selvstendigRegnskapsførerTelefon = undefined;
    }
    if (cleanedValues.selvstendigHarRegnskapsfører === YesOrNo.YES) {
        cleanedValues.selvstendigHarRevisor === undefined;
    }
    if (cleanedValues.selvstendigHarRevisor === YesOrNo.NO) {
        cleanedValues.selvstendigRevisorNavn = undefined;
        cleanedValues.selvstendigRevisorTelefon = undefined;
        cleanedValues.selvstendigRevisorNAVKanTaKontakt = undefined;
    }
    return cleanedValues;
};
