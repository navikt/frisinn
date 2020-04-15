import { YesOrNo } from '@navikt/sif-common-formik/lib';

export enum ApplicationFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    kontonummerErRiktig = 'kontonummerErRiktig',
    søkerOmTaptInntektSomSelvstendigNæringsdrivende = 'søkerOmTaptInntektSomSelvstendigNæringsdrivende',
    erFrilanser = 'erFrilanser',
    søkerOmTaptInntektSomFrilanser = 'søkerOmTaptInntektSomFrilanser',
    harTaptInntektSomFrilanser = 'harTaptInntektSomFrilanser',
    selvstendigHarHattInntektstapHelePerioden = 'selvstendigHarHattInntektstapHelePerioden',
    selvstendigInntektstapStartetDato = 'selvstendigInntektstapStartetDato',
    selvstendigInntekt2019 = 'selvstendigInntekt2019',
    selvstendigInntekt2020 = 'selvstendigInntekt2020',
    selvstendigInntektIPerioden = 'selvstendigInntektIPerioden',
}

export interface ApplicationFormData {
    [ApplicationFormField.harForståttRettigheterOgPlikter]: boolean;
    [ApplicationFormField.harBekreftetOpplysninger]: boolean;
    [ApplicationFormField.kontonummerErRiktig]: YesOrNo;
    [ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo;
    [ApplicationFormField.erFrilanser]: YesOrNo;
    [ApplicationFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo;
    [ApplicationFormField.selvstendigHarHattInntektstapHelePerioden]: YesOrNo;
    [ApplicationFormField.selvstendigInntektstapStartetDato]?: Date;
    [ApplicationFormField.selvstendigInntekt2019]?: number;
    [ApplicationFormField.selvstendigInntekt2020]?: number;
    [ApplicationFormField.selvstendigInntektIPerioden]?: number;
}

export const initialApplicationValues: Partial<ApplicationFormData> = {
    [ApplicationFormField.harForståttRettigheterOgPlikter]: false,
    [ApplicationFormField.harBekreftetOpplysninger]: false,
    [ApplicationFormField.erFrilanser]: YesOrNo.UNANSWERED,
    [ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,
    // [ApplicationFormField.selvstendigHarHattInntektstapHelePerioden]: YesOrNo.UNANSWERED,
    // [ApplicationFormField.selvstendigHarHattInntektstapHelePerioden]: YesOrNo.YES,
    // [ApplicationFormField.selvstendigInntekt2019]: 200000,
    // [ApplicationFormField.selvstendigInntekt2020]: 23000,
    // [ApplicationFormField.selvstendigInntektIPerioden]: 0,
};
