import { SoknadFormData } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SelvstendigNæringsdrivendeAvslagStatus } from './selvstendigAvslag';

export const cleanupSelvstendigStep = (
    values: SoknadFormData,
    avslag: SelvstendigNæringsdrivendeAvslagStatus
): SoknadFormData => {
    const v: SoknadFormData = {
        ...values,
    };
    if (v.selvstendigHarHattInntektFraForetak === YesOrNo.NO) {
        v.selvstendigHarTaptInntektPgaKorona = YesOrNo.UNANSWERED;
    }
    if (v.selvstendigHarTaptInntektPgaKorona !== YesOrNo.YES) {
        v.selvstendigInntektstapStartetDato = undefined as any;
    }
    if (v.selvstendigInntektstapStartetDato === undefined || avslag.søkerIkkeForGyldigTidsrom) {
        v.selvstendigInntektIPerioden = undefined as any;
    }
    if (v.selvstendigInntektIPerioden === undefined) {
        v.selvstendigInntekt2019 = undefined as any;
        v.selvstendigInntekt2020 = undefined as any;
    }
    if (v.selvstendigInntekt2019 === undefined && v.selvstendigInntekt2020 === undefined) {
        v.selvstendigHarYtelseFraNavSomDekkerTapet = YesOrNo.UNANSWERED;
    }
    if (avslag.harYtelseFraNavSomDekkerTapet) {
        v.selvstendigErFrilanser = YesOrNo.UNANSWERED;
        v.selvstendigHarRegnskapsfører = YesOrNo.UNANSWERED;
    }
    if (v.selvstendigErFrilanser !== YesOrNo.YES) {
        v.selvstendigHarHattInntektSomFrilanserIPerioden = YesOrNo.UNANSWERED;
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
