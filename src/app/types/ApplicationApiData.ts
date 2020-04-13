import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from 'common/types/Locale';

export interface SelvstendigNæringsdrivendeApiData {
    harHattInntektstapHelePeriode: boolean;
    inntektstapStartetDato?: ApiStringDate;
    inntekt2019?: number;
    inntekt2020: number;
    inntektIPerioden: number;
}

export interface FrilanserApiData {
    inntektstapStartetDato: ApiStringDate;
    inntektIPeriode: number;
}

export interface ApplicationApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    frilanser?: FrilanserApiData;
}
