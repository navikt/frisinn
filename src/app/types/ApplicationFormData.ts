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
    selvstendigHarYtelseFraNavSomDekkerTapet = 'selvstendigHarYtelseFraNavSomDekkerTapet',
    selvstendigYtelseFraNavDekkerHeleTapet = 'selvstendigYtelseFraNavDekkerHeleTapet',
    selvstendigInntektIPerioden = 'selvstendigInntektIPerioden',
    selvstendigErFrilanser = 'selvstendigErFrilanser',
    selvstendigHarHattInntektSomFrilanserIPerioden = 'selvstendigHarHattInntektSomFrilanserIPerioden',
    selvstendigInntektSomFrilanserIPerioden = 'selvstendigInntektSomFrilanserIPerioden',
    selvstendigInntekt2019 = 'selvstendigInntekt2019',
    selvstendigInntekt2020 = 'selvstendigInntekt2020',
    selvstendigCalculatedDateRange = 'selvstendigCalculatedDateRange',
    selvstendigHarRegnskapsfører = 'selvstendigHarRegnskapsfører',
    selvstendigRegnskapsførerNavn = 'selvstendigRegnskapsførerNavn',
    selvstendigRegnskapsførerTelefon = 'selvstendigRegnskapsførerTelefon',
    selvstendigHarRevisor = 'selvstendigHarRevisor',
    selvstendigRevisorNavn = 'selvstendigRevisorNavn',
    selvstendigRevisorTelefon = 'selvstendigRevisorTelefon',
    selvstendigRevisorNAVKanTaKontakt = 'selvstendigRevisorNAVKanTaKontakt',
    frilanserHarTaptInntektPgaKorona = 'frilanserHarTaptInntektPgaKorona',
    frilanserErNyetablert = 'frilanserErNyetablert',
    frilanserInntektstapStartetDato = 'frilanserInntektstapStartetDato',
    frilanserHarYtelseFraNavSomDekkerTapet = 'frilanserHarYtelseFraNavSomDekkerTapet',
    frilanserYtelseFraNavDekkerHeleTapet = 'frilanserYtelseFraNavDekkerHeleTapet',
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
    [ApplicationFormField.selvstendigHarYtelseFraNavSomDekkerTapet]: YesOrNo;
    [ApplicationFormField.selvstendigYtelseFraNavDekkerHeleTapet]: YesOrNo;
    [ApplicationFormField.selvstendigInntektIPerioden]: number;
    [ApplicationFormField.selvstendigErFrilanser]?: YesOrNo;
    [ApplicationFormField.selvstendigHarHattInntektSomFrilanserIPerioden]?: YesOrNo;
    [ApplicationFormField.selvstendigInntektSomFrilanserIPerioden]?: number;
    [ApplicationFormField.selvstendigInntekt2019]?: number;
    [ApplicationFormField.selvstendigInntekt2020]?: number;
    [ApplicationFormField.selvstendigCalculatedDateRange]?: DateRange;
    [ApplicationFormField.selvstendigHarRegnskapsfører]: YesOrNo;
    [ApplicationFormField.selvstendigRegnskapsførerNavn]?: string;
    [ApplicationFormField.selvstendigRegnskapsførerTelefon]?: string;
    [ApplicationFormField.selvstendigHarRevisor]?: YesOrNo;
    [ApplicationFormField.selvstendigRevisorNavn]?: string;
    [ApplicationFormField.selvstendigRevisorTelefon]?: string;
    [ApplicationFormField.selvstendigRevisorNAVKanTaKontakt]?: YesOrNo;
    [ApplicationFormField.frilanserHarTaptInntektPgaKorona]: YesOrNo;
    [ApplicationFormField.frilanserErNyetablert]: YesOrNo;
    [ApplicationFormField.frilanserInntektstapStartetDato]: Date;
    [ApplicationFormField.frilanserHarYtelseFraNavSomDekkerTapet]: YesOrNo;
    [ApplicationFormField.frilanserYtelseFraNavDekkerHeleTapet]: YesOrNo;
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

export type SelvstendigFormData = Pick<
    Partial<ApplicationFormData>,
    | ApplicationFormField.søkerOmTaptInntektSomFrilanser
    | ApplicationFormField.selvstendigHarTaptInntektPgaKorona
    | ApplicationFormField.selvstendigInntektstapStartetDato
    | ApplicationFormField.selvstendigHarYtelseFraNavSomDekkerTapet
    | ApplicationFormField.selvstendigYtelseFraNavDekkerHeleTapet
    | ApplicationFormField.selvstendigInntektIPerioden
    | ApplicationFormField.selvstendigErFrilanser
    | ApplicationFormField.selvstendigHarHattInntektSomFrilanserIPerioden
    | ApplicationFormField.selvstendigInntektSomFrilanserIPerioden
    | ApplicationFormField.selvstendigInntekt2019
    | ApplicationFormField.selvstendigInntekt2020
    | ApplicationFormField.selvstendigHarRegnskapsfører
    | ApplicationFormField.selvstendigRegnskapsførerNavn
    | ApplicationFormField.selvstendigRegnskapsførerTelefon
    | ApplicationFormField.selvstendigHarRevisor
    | ApplicationFormField.selvstendigRevisorNavn
    | ApplicationFormField.selvstendigRevisorTelefon
    | ApplicationFormField.selvstendigRevisorNAVKanTaKontakt
>;

export const initialSelvstendigValues: SelvstendigFormData = {
    selvstendigHarTaptInntektPgaKorona: undefined,
    selvstendigInntektstapStartetDato: undefined,
    selvstendigHarYtelseFraNavSomDekkerTapet: undefined,
    selvstendigYtelseFraNavDekkerHeleTapet: undefined,
    selvstendigInntektIPerioden: undefined,
    selvstendigInntekt2019: undefined,
    selvstendigInntekt2020: undefined,
    selvstendigHarRegnskapsfører: undefined,
    selvstendigRegnskapsførerNavn: undefined,
    selvstendigRegnskapsførerTelefon: undefined,
    selvstendigHarRevisor: undefined,
    selvstendigRevisorNavn: undefined,
    selvstendigRevisorTelefon: undefined,
    selvstendigRevisorNAVKanTaKontakt: undefined,
    selvstendigErFrilanser: undefined,
    selvstendigHarHattInntektSomFrilanserIPerioden: undefined,
    selvstendigInntektSomFrilanserIPerioden: undefined,
};
