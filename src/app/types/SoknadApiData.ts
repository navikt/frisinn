import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from 'common/types/Locale';

export interface ApiQuestion {
    question: string;
    answer: string;
}

export interface SelvstendigNæringsdrivendeApiData {
    inntektstapStartet: ApiStringDate;
    inntektIPerioden: number;
    inntekt2019?: number;
    inntekt2020?: number;
    inntektIPeriodenSomFrilanser?: number;
    info: {
        period: string;
        lastDayWithNormalIncome: string;
    };
    regnskapsfører?: {
        navn: string;
        telefon: string;
    };
    questions?: ApiQuestion[];
}

export interface FrilanserApiData {
    inntektstapStartet: ApiStringDate;
    erNyetablert: boolean;
    inntektIPerioden: number;
    inntektIPeriodenSomSelvstendigNæringsdrivende?: number;
    info: {
        period: string;
        lastDayWithNormalIncome: string;
    };
    questions?: ApiQuestion[];
}

export interface SoknadApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    frilanser?: FrilanserApiData;
}
