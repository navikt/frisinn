import { SoknadFormData } from '../../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SelvstendigNæringsdrivendeAvslagStatus } from '../selvstendigAvslag';

export const cleanupSelvstendigForstegangStep = (
    values: SoknadFormData,
    avslag: SelvstendigNæringsdrivendeAvslagStatus
): SoknadFormData => {
    const v: SoknadFormData = {
        ...values,
    };
    if (v.selvstendigHarTaptInntektPgaKorona !== YesOrNo.YES) {
        v.selvstendigInntektstapStartetDato = undefined as any;
    }
    if (
        v.selvstendigInntektstapStartetDato === undefined ||
        avslag.søkerIkkeForGyldigTidsrom ||
        avslag.ingenUttaksdager
    ) {
        v.selvstendigInntektIPerioden = undefined as any;
        v.selvstendigHarAvsluttetSelskaper = YesOrNo.UNANSWERED;
        v.selvstendigBeregnetTilgjengeligSøknadsperiode = undefined;
    }
    if (v.selvstendigHarAvsluttetSelskaper !== YesOrNo.YES) {
        v.selvstendigAvsluttaSelskaper = undefined;
        v.selvstendigAlleAvsluttaSelskaperErRegistrert = YesOrNo.UNANSWERED;
    }
    if (v.selvstendigInntektIPerioden === undefined) {
        v.selvstendigInntekt2019 = undefined as any;
        v.selvstendigInntekt2020 = undefined as any;
    }
    if (v.selvstendigBeregnetInntektsårstall === 2019) {
        v.selvstendigInntekt2020 = undefined as any;
    }
    if (v.selvstendigBeregnetInntektsårstall === 2020) {
        v.selvstendigInntekt2019 = undefined as any;
    }
    if (
        (v.selvstendigInntekt2019 === undefined && v.selvstendigInntekt2020 === undefined) ||
        avslag.oppgirNullHistoriskInntekt
    ) {
        v.selvstendigHarYtelseFraNavSomDekkerTapet = YesOrNo.UNANSWERED;
    }
    if (avslag.harYtelseFraNavSomDekkerTapet || v.selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.UNANSWERED) {
        v.selvstendigHarRegnskapsfører = YesOrNo.UNANSWERED;
        v.selvstendigErFrilanser = YesOrNo.UNANSWERED;
        v.selvstendigHarRevisor = YesOrNo.UNANSWERED;
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
        v.selvstendigRevisorNAVKanTaKontakt = YesOrNo.UNANSWERED;
    }
    return v;
};
