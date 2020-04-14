import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { IntroFormData } from '../pages/intro-page/intro-form/introFormConfig';

export enum RejectReason {
    'erIkkeMellom18og66' = 'erIkkeMellom18og66',
    'erIkkeSelvstendigEllerFrilanser' = 'erIkkeSelvstendigEllerFrilanser',
    'harFullUtbetalingFraNAV' = 'harFullUtbetalingFraNAV',
    'harIkkeTaptInntektPgaKorona' = 'harIkkeTaptInntektPgaKorona',
    'harInntektOver6g' = 'harInntektOver6g',
}

export const shouldUserBeStoppedFormUsingApplication = (values: IntroFormData): RejectReason | undefined => {
    const {
        erMellom18og67år,
        erSelvstendigNæringsdrivende,
        erFrilanser,
        harFullUtbetalingFraNAV,
        harInntektUnder6g,
        harTaptInntektPgaKorona,
    } = values;

    if (erMellom18og67år === YesOrNo.NO) {
        return RejectReason.erIkkeMellom18og66;
    }
    if (erSelvstendigNæringsdrivende === YesOrNo.NO && erFrilanser === YesOrNo.NO) {
        return RejectReason.erIkkeSelvstendigEllerFrilanser;
    }
    if (harFullUtbetalingFraNAV === YesOrNo.YES) {
        return RejectReason.harFullUtbetalingFraNAV;
    }
    if (harTaptInntektPgaKorona === YesOrNo.NO) {
        return RejectReason.harIkkeTaptInntektPgaKorona;
    }
    if (harInntektUnder6g === YesOrNo.NO) {
        return RejectReason.harInntektOver6g;
    }
    return undefined;
};
