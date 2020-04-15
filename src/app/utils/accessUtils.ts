import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { IntroFormData } from '../pages/intro-page/intro-form/introFormConfig';
import { ApplicationFormData } from '../types/ApplicationFormData';

export enum RejectReason {
    'erIkkeMellom18og66' = 'erIkkeMellom18og66',
    'erIkkeSelvstendigEllerFrilanser' = 'erIkkeSelvstendigEllerFrilanser',
    'harFullUtbetalingFraNAV' = 'harFullUtbetalingFraNAV',
    'harIkkeTaptInntektPgaKorona' = 'harIkkeTaptInntektPgaKorona',
    'harIkkeHattInntektOver75000SomFrilanser' = 'harIkkeHattInntektOver75000SomFrilanser',
    'harInntektOver6g' = 'harInntektOver6g',
    'kontonummerStemmerIkke' = 'kontonummerStemmerIkke',
    'søkerHverkenSomSelvstendigEllerFrilanser' = 'søkerHverkenSomSelvstendigEllerFrilanser',
}

export const shouldUserBeStoppedFormUsingApplication = (values: IntroFormData): RejectReason | undefined => {
    const {
        erMellom18og67år,
        erSelvstendigNæringsdrivende,
        erFrilanser,
        harFullUtbetalingFraNAV,
        harInntektUnder6g,
        harTaptInntektPgaKorona,
        harHattInntektOver75000SomFrilanser,
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
    if (
        erSelvstendigNæringsdrivende === YesOrNo.NO &&
        erFrilanser === YesOrNo.YES &&
        harHattInntektOver75000SomFrilanser === YesOrNo.NO
    ) {
        return RejectReason.harIkkeHattInntektOver75000SomFrilanser;
    }
    return undefined;
};

export const shouldLoggedInUserBeStoppedFormUsingApplication = (
    values: ApplicationFormData
): RejectReason | undefined => {
    if (values.kontonummerErRiktig === YesOrNo.NO) {
        return RejectReason.kontonummerStemmerIkke;
    }
    if (
        values.søkerOmTaptInntektSomFrilanser === YesOrNo.NO &&
        values.søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.NO
    ) {
        return RejectReason.søkerHverkenSomSelvstendigEllerFrilanser;
    }
    return undefined;
};
