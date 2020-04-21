import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { DateRange } from '../utils/dateUtils';

export enum ApplicationFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    kontonummerErRiktig = 'kontonummerErRiktig',
    erSelvstendigNæringsdrivende = 'erSelvstendigNæringsdrivende',
    ønskerÅFortsetteKunFrilanserSøknad = 'ønskerÅFortsetteKunFrilanserSøknad',
    søkerOmTaptInntektSomSelvstendigNæringsdrivende = 'søkerOmTaptInntektSomSelvstendigNæringsdrivende',
    søkerOmTaptInntektSomFrilanser = 'søkerOmTaptInntektSomFrilanser',
    selvstendigHarTaptInntektPgaKorona = 'selvstendigHarTaptInntektPgaKorona',
    selvstendigInntektstapStartetDato = 'selvstendigInntektstapStartetDato',
    selvstendigTapHeltEllerDelvisDekketAvNAV = 'selvstendigTapHeltEllerDelvisDekketAvNAV',
    selvstendigTapHeltDekketAvNAV = 'selvstendigTapHeltDekketAvNAV',
    selvstendigInntektIPerioden = 'selvstendigInntektIPerioden',
    selvstendigErFrilanser = 'selvstendigErFrilanser',
    selvstendigHarHattInntektSomFrilanserIPerioden = 'selvstendigHarHattInntektSomFrilanserIPerioden',
    selvstendigInntektSomFrilanserIPerioden = 'selvstendigInntektSomFrilanserIPerioden',
    selvstendigInntekt2019 = 'selvstendigInntekt2019',
    selvstendigInntekt2020 = 'selvstendigInntekt2020',
    selvstendigCalculatedDateRange = 'selvstendigCalculatedDateRange',
    frilanserHarTaptInntektPgaKorona = 'frilanserHarTaptInntektPgaKorona',
    frilanserInntektstapStartetDato = 'frilanserInntektstapStartetDato',
    frilanserTapHeltEllerDelvisDekketAvNAV = 'frilanserTapHeltEllerDelvisDekketAvNAV',
    frilanserTapHeltDekketAvNAV = 'frilanserTapHeltDekketAvNAV',
    frilanserInntektIPerioden = 'frilanserInntektIPerioden',
    frilanserErSelvstendigNæringsdrivende = 'frilanserErSelvstendigNæringsdrivende',
    frilanserHarHattInntektSomSelvstendigIPerioden = 'frilanserHarHattInntektSomSelvstendigIPerioden',
    frilanserInntektSomSelvstendigIPerioden = 'frilanserInntektSomSelvstendigIPerioden',
    frilanserCalculatedDateRange = 'frilanserCalculatedDateRange',
}

export interface ApplicationFormData {
    [ApplicationFormField.harForståttRettigheterOgPlikter]: boolean;
    [ApplicationFormField.harBekreftetOpplysninger]: boolean;
    [ApplicationFormField.kontonummerErRiktig]: YesOrNo;
    [ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo;
    [ApplicationFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo;
    [ApplicationFormField.erSelvstendigNæringsdrivende]?: YesOrNo;
    [ApplicationFormField.ønskerÅFortsetteKunFrilanserSøknad]?: YesOrNo;
    [ApplicationFormField.selvstendigHarTaptInntektPgaKorona]: YesOrNo;
    [ApplicationFormField.selvstendigInntektstapStartetDato]: Date;
    [ApplicationFormField.selvstendigTapHeltEllerDelvisDekketAvNAV]: YesOrNo;
    [ApplicationFormField.selvstendigTapHeltDekketAvNAV]: YesOrNo;
    [ApplicationFormField.selvstendigInntektIPerioden]: number;
    [ApplicationFormField.selvstendigErFrilanser]?: YesOrNo;
    [ApplicationFormField.selvstendigHarHattInntektSomFrilanserIPerioden]?: YesOrNo;
    [ApplicationFormField.selvstendigInntektSomFrilanserIPerioden]?: number;
    [ApplicationFormField.selvstendigInntekt2019]?: number;
    [ApplicationFormField.selvstendigInntekt2020]?: number;
    [ApplicationFormField.selvstendigCalculatedDateRange]?: DateRange;
    [ApplicationFormField.frilanserHarTaptInntektPgaKorona]: YesOrNo;
    [ApplicationFormField.frilanserInntektstapStartetDato]: Date;
    [ApplicationFormField.frilanserTapHeltEllerDelvisDekketAvNAV]: YesOrNo;
    [ApplicationFormField.frilanserTapHeltDekketAvNAV]: YesOrNo;
    [ApplicationFormField.frilanserInntektIPerioden]: number;
    [ApplicationFormField.frilanserErSelvstendigNæringsdrivende]: YesOrNo;
    [ApplicationFormField.frilanserHarHattInntektSomSelvstendigIPerioden]?: YesOrNo;
    [ApplicationFormField.frilanserInntektSomSelvstendigIPerioden]?: number;
    [ApplicationFormField.frilanserCalculatedDateRange]?: DateRange;
}

export const initialApplicationValues: Partial<ApplicationFormData> = {
    [ApplicationFormField.harForståttRettigheterOgPlikter]: false,
    [ApplicationFormField.harBekreftetOpplysninger]: false,
    [ApplicationFormField.kontonummerErRiktig]: YesOrNo.UNANSWERED,
    [ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,
    [ApplicationFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo.UNANSWERED,
};
