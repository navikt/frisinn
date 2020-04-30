import { SoknadFormData } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const cleanupFrilanserStep = (values: SoknadFormData): SoknadFormData => {
    const v: SoknadFormData = {
        ...values,
    };
    if (v.frilanserHarTaptInntektPgaKorona === YesOrNo.NO) {
        v.frilanserErNyetablert = YesOrNo.UNANSWERED;
        v.frilanserInntektstapStartetDato = undefined as any;
    }
    if (v.frilanserInntektstapStartetDato === undefined) {
        v.frilanserHarYtelseFraNavSomDekkerTapet = YesOrNo.UNANSWERED;
    }
    if (v.frilanserHarYtelseFraNavSomDekkerTapet !== YesOrNo.YES) {
        v.frilanserYtelseFraNavDekkerHeleTapet = YesOrNo.UNANSWERED;
    }
    if (
        v.frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES &&
        v.frilanserYtelseFraNavDekkerHeleTapet === YesOrNo.YES
    ) {
        v.frilanserInntektIPerioden = undefined as any;
    }
    if (v.frilanserInntektIPerioden === undefined) {
        v.frilanserHarHattInntektSomSelvstendigIPerioden = YesOrNo.UNANSWERED;
    }
    if (v.frilanserHarHattInntektSomSelvstendigIPerioden !== YesOrNo.YES) {
        v.frilanserInntektSomSelvstendigIPerioden = undefined as any;
    }
    return v;
};
