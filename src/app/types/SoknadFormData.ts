import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { DateRange } from '../utils/dateUtils';

export enum SoknadFormField {
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

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.kontonummerErRiktig]: YesOrNo;
    [SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo;
    [SoknadFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo;
    [SoknadFormField.erSelvstendigNæringsdrivende]?: YesOrNo;
    [SoknadFormField.ønskerÅFortsetteKunFrilanserSøknad]?: YesOrNo;
    [SoknadFormField.selvstendigHarTaptInntektPgaKorona]: YesOrNo;
    [SoknadFormField.selvstendigInntektstapStartetDato]: Date;
    [SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet]: YesOrNo;
    [SoknadFormField.selvstendigYtelseFraNavDekkerHeleTapet]: YesOrNo;
    [SoknadFormField.selvstendigInntektIPerioden]: number;
    [SoknadFormField.selvstendigErFrilanser]?: YesOrNo;
    [SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden]?: YesOrNo;
    [SoknadFormField.selvstendigInntektSomFrilanserIPerioden]?: number;
    [SoknadFormField.selvstendigInntekt2019]?: number;
    [SoknadFormField.selvstendigInntekt2020]?: number;
    [SoknadFormField.selvstendigCalculatedDateRange]?: DateRange;
    [SoknadFormField.selvstendigHarRegnskapsfører]: YesOrNo;
    [SoknadFormField.selvstendigRegnskapsførerNavn]?: string;
    [SoknadFormField.selvstendigRegnskapsførerTelefon]?: string;
    [SoknadFormField.selvstendigHarRevisor]?: YesOrNo;
    [SoknadFormField.selvstendigRevisorNavn]?: string;
    [SoknadFormField.selvstendigRevisorTelefon]?: string;
    [SoknadFormField.selvstendigRevisorNAVKanTaKontakt]?: YesOrNo;
    [SoknadFormField.frilanserHarTaptInntektPgaKorona]: YesOrNo;
    [SoknadFormField.frilanserErNyetablert]: YesOrNo;
    [SoknadFormField.frilanserInntektstapStartetDato]: Date;
    [SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet]: YesOrNo;
    [SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet]: YesOrNo;
    [SoknadFormField.frilanserInntektIPerioden]: number;
    [SoknadFormField.frilanserErSelvstendigNæringsdrivende]: YesOrNo;
    [SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden]?: YesOrNo;
    [SoknadFormField.frilanserInntektSomSelvstendigIPerioden]?: number;
    [SoknadFormField.frilanserCalculatedDateRange]?: DateRange;
}

export const initialSoknadFormData: Partial<SoknadFormData> = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: false,
    [SoknadFormField.harBekreftetOpplysninger]: false,
    [SoknadFormField.kontonummerErRiktig]: YesOrNo.UNANSWERED,
    [SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,
    [SoknadFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo.UNANSWERED,
};

export type SelvstendigFormData = Pick<
    Partial<SoknadFormData>,
    | SoknadFormField.søkerOmTaptInntektSomFrilanser
    | SoknadFormField.selvstendigHarTaptInntektPgaKorona
    | SoknadFormField.selvstendigInntektstapStartetDato
    | SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet
    | SoknadFormField.selvstendigYtelseFraNavDekkerHeleTapet
    | SoknadFormField.selvstendigInntektIPerioden
    | SoknadFormField.selvstendigErFrilanser
    | SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden
    | SoknadFormField.selvstendigInntektSomFrilanserIPerioden
    | SoknadFormField.selvstendigInntekt2019
    | SoknadFormField.selvstendigInntekt2020
    | SoknadFormField.selvstendigHarRegnskapsfører
    | SoknadFormField.selvstendigRegnskapsførerNavn
    | SoknadFormField.selvstendigRegnskapsførerTelefon
    | SoknadFormField.selvstendigHarRevisor
    | SoknadFormField.selvstendigRevisorNavn
    | SoknadFormField.selvstendigRevisorTelefon
    | SoknadFormField.selvstendigRevisorNAVKanTaKontakt
>;
export type FrilanserFormData = Pick<
    Partial<SoknadFormData>,
    | SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende
    | SoknadFormField.frilanserHarTaptInntektPgaKorona
    | SoknadFormField.frilanserErNyetablert
    | SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet
    | SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet
    | SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden
    | SoknadFormField.frilanserInntektSomSelvstendigIPerioden
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

export const initialFrilanserValues: FrilanserFormData = {
    frilanserHarTaptInntektPgaKorona: undefined,
    frilanserErNyetablert: undefined,
    frilanserHarYtelseFraNavSomDekkerTapet: undefined,
    frilanserYtelseFraNavDekkerHeleTapet: undefined,
    frilanserHarHattInntektSomSelvstendigIPerioden: undefined,
    frilanserInntektSomSelvstendigIPerioden: undefined,
};
