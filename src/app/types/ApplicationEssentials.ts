import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn: string;
    kjønn: string;
    fødselsnummer: string;
}

export interface Enkeltpersonforetak {
    organisasjonsnummer: string;
    navn: string;
    registreringsdato: Date;
}

export interface RegistrerteEnkeltpersonforetak {
    enkeltpersonforetak: Enkeltpersonforetak[];
    tidligsteRegistreringsdato: Date;
}

export interface ApplicationDateRanges {
    applicationDateRange: DateRange;
    frilansDateRange: DateRange;
    selvstendigDateRange: DateRange;
}

export interface ApplicationEssentials {
    person: Person;
    applicationDateRanges: ApplicationDateRanges;
    companies?: RegistrerteEnkeltpersonforetak;
}
