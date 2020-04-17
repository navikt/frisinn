import { YesOrNo } from '@navikt/sif-common-formik/lib';

export enum SelvstendigFormFields {
    harTaptInntektPgaKorona = 'harTaptInntektPgaKorona',
    inntektstapStartetDato = 'inntektstapStartetDato',
    inntektIPerioden = 'inntektIPerioden',
    erFrilanser = 'erFrilanser',
    harHattInntektSomFrilanserIPerioden = 'harHattInntektSomFrilanserIPerioden',
    inntektSomFrilanserIPerioden = 'inntektSomFrilanserIPerioden',
    historiskInntekt = 'historiskInntekt',
}

export interface SelvstendigFormData {
    [SelvstendigFormFields.harTaptInntektPgaKorona]: YesOrNo;
    [SelvstendigFormFields.inntektstapStartetDato]: Date;
    [SelvstendigFormFields.inntektIPerioden]: number;
    [SelvstendigFormFields.harHattInntektSomFrilanserIPerioden]?: YesOrNo;
    [SelvstendigFormFields.inntektSomFrilanserIPerioden]?: number;
    [SelvstendigFormFields.historiskInntekt]: number;
}

export enum FrilanserFormFields {
    'inntektstapErPgaKorona' = 'inntektstapErPgaKorona',
    'inntektstapStartetDato' = 'inntektstapStartetDato',
    'inntektIPerioden' = 'inntektIPerioden',
    'harHattInntektSomSelvstendigIPerioden' = 'harHattInntektSomSelvstendigIPerioden',
    'inntektSomSelvstendigIPerioden' = 'inntektSomSelvstendigIPerioden',
}

export interface FrilanserFormData {
    [FrilanserFormFields.inntektstapErPgaKorona]: YesOrNo;
    [FrilanserFormFields.inntektstapStartetDato]: Date;
    [FrilanserFormFields.inntektIPerioden]: number;
    [FrilanserFormFields.harHattInntektSomSelvstendigIPerioden]?: YesOrNo;
    [FrilanserFormFields.inntektSomSelvstendigIPerioden]?: number;
}

export enum ApplicationFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    kontonummerErRiktig = 'kontonummerErRiktig',
    søkerOmTaptInntektSomSelvstendigNæringsdrivende = 'søkerOmTaptInntektSomSelvstendigNæringsdrivende',
    søkerOmTaptInntektSomFrilanser = 'søkerOmTaptInntektSomFrilanser',
    selvstendig = 'selvstendig',
    frilanser = 'frilanser',
}

export interface ApplicationFormData {
    [ApplicationFormField.harForståttRettigheterOgPlikter]: boolean;
    [ApplicationFormField.harBekreftetOpplysninger]: boolean;
    [ApplicationFormField.kontonummerErRiktig]: YesOrNo;
    [ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo;
    [ApplicationFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo;
    [ApplicationFormField.selvstendig]?: SelvstendigFormData;
    [ApplicationFormField.frilanser]?: FrilanserFormData;
}

export const initialApplicationValues: Partial<ApplicationFormData> = {
    [ApplicationFormField.harForståttRettigheterOgPlikter]: false,
    [ApplicationFormField.harBekreftetOpplysninger]: false,
    [ApplicationFormField.kontonummerErRiktig]: YesOrNo.UNANSWERED,
    [ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,
    [ApplicationFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo.UNANSWERED,
};
