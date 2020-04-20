import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from 'common/types/Locale';

interface Question {
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
    questions?: Question[];
}

export interface FrilanserApiData {
    inntektstapStartet: ApiStringDate;
    inntektIPerioden: number;
    inntektIPeriodenSomSelvstendigNæringsdrivende?: number;
    info: {
        period: string;
        lastDayWithNormalIncome: string;
    };
    questions?: Question[];
}

export interface ApplicationApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    frilanser?: FrilanserApiData;
}
