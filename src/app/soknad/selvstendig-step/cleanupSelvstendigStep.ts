import { SoknadFormData } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const cleanupSelvstendigStep = (values: SoknadFormData): SoknadFormData => {
    const cleanedValues: SoknadFormData = {
        ...values,
    };
    if (values.selvstendigHarHattInntektFraForetak === YesOrNo.NO) {
        cleanedValues.selvstendigHarTaptInntektPgaKorona = YesOrNo.NO;
        cleanedValues.selvstendigInntektIPerioden = undefined as any;
    }
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
