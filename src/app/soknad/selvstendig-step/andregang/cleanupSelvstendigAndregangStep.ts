import { SoknadFormData } from '../../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SelvstendigNæringsdrivendeAvslagStatus } from '../selvstendigAvslag';

export const cleanupSelvstendigAndregangStep = (
    values: SoknadFormData,
    avslag: Partial<SelvstendigNæringsdrivendeAvslagStatus>
): SoknadFormData => {
    const v: SoknadFormData = {
        ...values,
    };
    if (v.selvstendigHarTaptInntektPgaKorona !== YesOrNo.YES) {
        v.selvstendigHarMottattUtbetalingTidligere = YesOrNo.UNANSWERED;
    }
    if (v.selvstendigHarMottattUtbetalingTidligere === YesOrNo.YES) {
        v.selvstendigInntektstapStartetDato = undefined as any;
    }
    if (avslag.søkerIkkeForGyldigTidsrom || avslag.ingenUttaksdager) {
        v.selvstendigInntektIPerioden = undefined as any;
        v.selvstendigBeregnetTilgjengeligSøknadsperiode = undefined;
    }
    if (v.selvstendigInntektIPerioden === undefined) {
        v.selvstendigHarYtelseFraNavSomDekkerTapet = YesOrNo.UNANSWERED;
    }
    return v;
};
