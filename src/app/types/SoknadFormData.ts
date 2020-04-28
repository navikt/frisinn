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
    selvstendigHarHattInntektFraForetak = 'selvstendigHarHattInntektFraForetak',
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
    selvstendigBeregnetTilgjengeligSøknadsperiode = 'selvstendigBeregnetTilgjengeligSøknadsperiode',
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
    bekrefterSelvstendigInntektIPerioden = 'bekrefterSelvstendigInntektIPerioden',
    bekrefterSelvstendigInntektI2019 = 'bekrefterSelvstendigInntektI2019',
    bekrefterSelvstendigInntektI2020 = 'bekrefterSelvstendigInntektI2020',
    bekrefterSelvstendigFrilanserInntektIPerioden = 'bekrefterSelvstendigFrilanserInntektIPerioden',
    bekrefterFrilansinntektIPerioden = 'bekrefterFrilansinntektIPerioden',
    bekrefterFrilanserSelvstendigInntektIPerioden = 'bekrefterFrilanserSelvstendigInntektIPerioden',
    bekrefterSjekkAvFrilanserinntektIRegister = 'bekrefterSjekkAvFrilanserinntektIRegister',
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
    [SoknadFormField.selvstendigHarHattInntektFraForetak]: YesOrNo;
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
    [SoknadFormField.selvstendigBeregnetTilgjengeligSøknadsperiode]?: DateRange; // Hentes fra api når bruker velger startdato for inntektstap
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
    [SoknadFormField.bekrefterSelvstendigInntektIPerioden]?: YesOrNo;
    [SoknadFormField.bekrefterSelvstendigInntektI2019]?: YesOrNo;
    [SoknadFormField.bekrefterSelvstendigInntektI2020]?: YesOrNo;
    [SoknadFormField.bekrefterSelvstendigFrilanserInntektIPerioden]?: YesOrNo;
    [SoknadFormField.bekrefterFrilansinntektIPerioden]?: YesOrNo;
    [SoknadFormField.bekrefterFrilanserSelvstendigInntektIPerioden]?: YesOrNo;
    [SoknadFormField.bekrefterSjekkAvFrilanserinntektIRegister]?: YesOrNo;
}

export const initialSoknadFormData: Partial<SoknadFormData> = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: false,
    [SoknadFormField.harBekreftetOpplysninger]: false,
    [SoknadFormField.kontonummerErRiktig]: YesOrNo.UNANSWERED,
    [SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,
    [SoknadFormField.søkerOmTaptInntektSomFrilanser]: YesOrNo.UNANSWERED,
};

export type SelvstendigFormData = Pick<
    SoknadFormData,
    | SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende
    | SoknadFormField.selvstendigBeregnetTilgjengeligSøknadsperiode
    | SoknadFormField.søkerOmTaptInntektSomFrilanser
    | SoknadFormField.selvstendigHarHattInntektFraForetak
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
    SoknadFormData,
    | SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende
    | SoknadFormField.frilanserHarTaptInntektPgaKorona
    | SoknadFormField.frilanserErNyetablert
    | SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet
    | SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet
    | SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden
    | SoknadFormField.frilanserInntektSomSelvstendigIPerioden
>;

export const initialSelvstendigValues: Partial<SelvstendigFormData> = {
    selvstendigHarHattInntektFraForetak: YesOrNo.UNANSWERED,
    selvstendigHarTaptInntektPgaKorona: YesOrNo.UNANSWERED,
    selvstendigInntektstapStartetDato: undefined,
    selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.UNANSWERED,
    selvstendigYtelseFraNavDekkerHeleTapet: YesOrNo.UNANSWERED,
    selvstendigInntektIPerioden: undefined,
    selvstendigInntekt2019: undefined,
    selvstendigInntekt2020: undefined,
    selvstendigHarRegnskapsfører: YesOrNo.UNANSWERED,
    selvstendigRegnskapsførerNavn: '',
    selvstendigRegnskapsførerTelefon: '',
    selvstendigHarRevisor: YesOrNo.UNANSWERED,
    selvstendigRevisorNavn: '',
    selvstendigRevisorTelefon: '',
    selvstendigRevisorNAVKanTaKontakt: YesOrNo.UNANSWERED,
    selvstendigErFrilanser: YesOrNo.UNANSWERED,
    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.UNANSWERED,
    selvstendigInntektSomFrilanserIPerioden: undefined,
};

export const initialFrilanserValues: Partial<FrilanserFormData> = {
    frilanserHarTaptInntektPgaKorona: YesOrNo.UNANSWERED,
    frilanserErNyetablert: YesOrNo.UNANSWERED,
    frilanserHarYtelseFraNavSomDekkerTapet: YesOrNo.UNANSWERED,
    frilanserYtelseFraNavDekkerHeleTapet: YesOrNo.UNANSWERED,
    frilanserHarHattInntektSomSelvstendigIPerioden: YesOrNo.UNANSWERED,
    frilanserInntektSomSelvstendigIPerioden: undefined,
};
