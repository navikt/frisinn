import { SoknadFormData } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const cleanupSelvstendigStep = (values: SoknadFormData): SoknadFormData => {
    const v: SoknadFormData = {
        ...values,
    };
    if (v.selvstendigHarHattInntektFraForetak === YesOrNo.NO) {
        v.selvstendigHarTaptInntektPgaKorona = YesOrNo.UNANSWERED;
    }
    if (v.selvstendigHarTaptInntektPgaKorona !== YesOrNo.YES) {
        v.selvstendigInntektstapStartetDato = undefined as any;
    }
    if (
        v.selvstendigInntektstapStartetDato === undefined ||
        v.selvstendigBeregnetTilgjengeligSøknadsperiode === undefined
    ) {
        v.selvstendigHarYtelseFraNavSomDekkerTapet = YesOrNo.UNANSWERED;
    }
    if (v.selvstendigHarYtelseFraNavSomDekkerTapet !== YesOrNo.YES) {
        v.selvstendigYtelseFraNavDekkerHeleTapet = YesOrNo.UNANSWERED;
    }
    if (v.selvstendigYtelseFraNavDekkerHeleTapet === YesOrNo.YES) {
        v.selvstendigInntektIPerioden = undefined as any;
    }
    if (v.selvstendigInntektIPerioden === undefined) {
        v.selvstendigErFrilanser = YesOrNo.UNANSWERED;
        v.selvstendigInntekt2019 = undefined as any;
        v.selvstendigInntekt2020 = undefined as any;
        v.selvstendigHarHattInntektSomFrilanserIPerioden = YesOrNo.UNANSWERED;
        v.selvstendigHarRegnskapsfører = YesOrNo.UNANSWERED;
    }
    if (v.selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.NO) {
        v.selvstendigInntektSomFrilanserIPerioden = undefined;
    }
    if (v.selvstendigHarRegnskapsfører !== YesOrNo.YES) {
        v.selvstendigRegnskapsførerNavn = undefined;
        v.selvstendigRegnskapsførerTelefon = undefined;
    }
    if (v.selvstendigHarRegnskapsfører === YesOrNo.YES) {
        v.selvstendigHarRevisor = YesOrNo.UNANSWERED;
    }
    if (v.selvstendigHarRevisor !== YesOrNo.YES) {
        v.selvstendigRevisorNavn = undefined;
        v.selvstendigRevisorTelefon = undefined;
        v.selvstendigRevisorNAVKanTaKontakt = undefined;
    }
    return v;
};
