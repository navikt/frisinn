import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from 'common/types/Locale';
import { SoknadFormField } from './SoknadFormData';
import { OpphørtPersonligeForetak } from '../api/inntektsperiode';

export interface ApiSpørsmålOgSvar {
    field: SoknadFormField /* Not used by api, only in tests */;
    spørsmål: string;
    svar: string | string[];
}

export interface SelvstendigNæringsdrivendeApiData {
    inntektstapStartet: ApiStringDate;
    inntektIPerioden: number;
    inntekt2019?: number;
    inntekt2020?: number;
    inntektIPeriodenSomFrilanser?: number;
    info: {
        periode: string;
    };
    regnskapsfører?: {
        navn: string;
        telefon: string;
    };
    opphørtePersonligeForetak: OpphørtPersonligeForetak[];
    spørsmålOgSvar?: ApiSpørsmålOgSvar[];
}

export interface FrilanserApiData {
    inntektstapStartet: ApiStringDate;
    erNyetablert: boolean;
    inntektIPerioden: number;
    inntektIPeriodenSomSelvstendigNæringsdrivende?: number;
    info: {
        periode: string;
    };
    spørsmålOgSvar?: ApiSpørsmålOgSvar[];
}

export interface SoknadApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    frilanser?: FrilanserApiData;
}
