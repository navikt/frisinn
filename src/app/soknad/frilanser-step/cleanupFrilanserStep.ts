import { SoknadFormData } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FrilanserAvslagStatus } from './frilanserAvslag';

export const cleanupFrilanserStep = (
    values: SoknadFormData,
    avslag: FrilanserAvslagStatus,
    harSøktSomFrilanserTidligere: boolean
): SoknadFormData => {
    const v: SoknadFormData = {
        ...values,
    };
    if (v.frilanserHarTaptInntektPgaKorona === YesOrNo.NO) {
        if (harSøktSomFrilanserTidligere) {
            v.frilanserHarMottattUtbetalingTidligere = undefined as any;
        } else {
            v.frilanserInntektstapStartetDato = undefined as any;
        }
    }
    if (v.frilanserHarMottattUtbetalingTidligere === YesOrNo.YES) {
        v.frilanserInntektstapStartetDato = undefined as any;
    }
    if (
        (v.frilanserInntektstapStartetDato === undefined || avslag.søkerIkkeForGyldigTidsrom) &&
        v.frilanserHarMottattUtbetalingTidligere !== YesOrNo.YES
    ) {
        v.frilanserInntektIPerioden = undefined as any;
    }
    if (avslag.ingenUttaksdager === true) {
        v.frilanserInntektIPerioden = undefined as any;
    }
    if (v.frilanserInntektIPerioden === undefined) {
        v.frilanserHarYtelseFraNavSomDekkerTapet = YesOrNo.UNANSWERED;
    }
    if (avslag.utebetalingFraNAVDekkerHeleInntektstapet) {
        v.frilanserHarHattInntektSomSelvstendigIPerioden = YesOrNo.UNANSWERED;
    }
    if (values.selvstendigSoknadIsOk) {
        v.frilanserHarHattInntektSomSelvstendigIPerioden = YesOrNo.UNANSWERED;
    }
    if (v.frilanserHarHattInntektSomSelvstendigIPerioden !== YesOrNo.YES) {
        v.frilanserInntektSomSelvstendigIPerioden = undefined as any;
    }
    return v;
};
