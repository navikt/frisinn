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

export interface PersonligeForetak {
    foretak: Foretak[];
    tidligsteRegistreringsdato: Date;
}

export interface ApplicationEssentials {
    person: Person;
    currentSøknadsperiode: DateRange;
    personligeForetak?: PersonligeForetak;
}
