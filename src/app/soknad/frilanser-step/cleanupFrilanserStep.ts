import { SoknadFormData } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FrilanserAvslagStatus } from './frilanserAvslag';

export const cleanupFrilanserStep = (values: SoknadFormData, avslag: FrilanserAvslagStatus): SoknadFormData => {
    const v: SoknadFormData = {
        ...values,
    };
    if (v.frilanserHarTaptInntektPgaKorona === YesOrNo.NO) {
        v.frilanserInntektstapStartetDato = undefined as any;
    }
    if (v.frilanserInntektstapStartetDato === undefined || avslag.søkerIkkeForGyldigTidsrom) {
        v.frilanserInntektIPerioden = undefined as any;
    }
    if (v.frilanserInntektIPerioden === undefined) {
        v.frilanserHarYtelseFraNavSomDekkerTapet = YesOrNo.UNANSWERED;
    }
    if (v.frilanserHarYtelseFraNavSomDekkerTapet !== YesOrNo.YES) {
        v.frilanserYtelseFraNavDekkerHeleTapet = YesOrNo.UNANSWERED;
    }
    if (avslag.utebetalingFraNAVDekkerHeleInntektstapet) {
        v.frilanserHarHattInntektSomSelvstendigIPerioden = YesOrNo.UNANSWERED;
    }
    if (v.frilanserHarHattInntektSomSelvstendigIPerioden !== YesOrNo.YES) {
        v.frilanserInntektSomSelvstendigIPerioden = undefined as any;
    }
    return v;
};
