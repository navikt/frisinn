import { YesOrNo } from '@navikt/sif-common-formik/lib';

export enum ApplicationFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    kontonummerErRiktig = 'kontonummerErRiktig',
    søkerOmTaptInntektSomSelvstendigNæringsdrivende = 'søkerOmTaptInntektSomSelvstendigNæringsdrivende',
    søkerOmTaptInntektSomFrilanser = 'søkerOmTaptInntektSomFrilanser',
    selvstendigHarTaptInntektPgaKorona = 'selvstendigHarTaptInntektPgaKorona',
    selvstendigInntektstapStartetDato = 'selvstendigInntektstapStartetDato',
    selvstendigInntektIPerioden = 'selvstendigInntektIPerioden',
    selvstendigErFrilanser = 'selvstendigErFrilanser',
    selvstendigHarHattInntektSomFrilanserIPerioden = 'selvstendigHarHattInntektSomFrilanserIPerioden',
    selvstendigInntektSomFrilanserIPerioden = 'selvstendigInntektSomFrilanserIPerioden',
    selvstendigInntekt2019 = 'selvstendigInntekt2019',
    selvstendigInntekt2020 = 'selvstendigInntekt2020',
    frilanser = 'frilanser',
}

export interface ApplicationFormData {
    [ApplicationFormField.harForståttRettigheterOgPlikter]: boolean;
    [ApplicationFormField.harBekreftetOpplysninger]: boolean;
    [ApplicationFormField.kontonummerErRiktig]: YesOrNo;
    [ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo;
    [ApplicationFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo;
    [ApplicationFormField.selvstendigHarTaptInntektPgaKorona]: YesOrNo;
    [ApplicationFormField.selvstendigInntektstapStartetDato]: Date;
    [ApplicationFormField.selvstendigInntektIPerioden]: number;
    [ApplicationFormField.selvstendigErFrilanser]?: YesOrNo;
    [ApplicationFormField.selvstendigHarHattInntektSomFrilanserIPerioden]?: YesOrNo;
    [ApplicationFormField.selvstendigInntektSomFrilanserIPerioden]?: number;
    [ApplicationFormField.selvstendigInntekt2019]?: number;
    [ApplicationFormField.selvstendigInntekt2020]?: number;
}

export const initialApplicationValues: Partial<ApplicationFormData> = {
    [ApplicationFormField.harForståttRettigheterOgPlikter]: false,
    [ApplicationFormField.harBekreftetOpplysninger]: false,
    [ApplicationFormField.kontonummerErRiktig]: YesOrNo.UNANSWERED,
    [ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,
    [ApplicationFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo.UNANSWERED,
};
