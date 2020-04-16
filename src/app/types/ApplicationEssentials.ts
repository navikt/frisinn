import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn: string;
    kjønn: string;
    fødselsnummer: string;
    kontonummer: string;
}

export interface Foretak {
    organisasjonsnummer: string;
    navn: string;
    registreringsdato: Date;
}

export interface ForetakInfo {
    foretak: Foretak[];
    tidligsteRegistreringsdato: Date;
}

export interface ApplicationDateRanges {
    applicationDateRange: DateRange;
}

export interface ApplicationEssentials {
    person: Person;
    applicationDateRanges: ApplicationDateRanges;
    registrerteForetakInfo?: ForetakInfo;
}
