import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn?: string;
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
    tidligsteRegistreringsdato: Date | undefined;
}

export interface TidligerePerioder {
    harSøktSomSelvstendigNæringsdrivende: boolean;
    harSøktSomFrilanser: boolean;
}

export interface SoknadEssentials {
    person: Person;
    currentSøknadsperiode: DateRange;
    isSelvstendigNæringsdrivende: boolean;
    personligeForetak?: PersonligeForetak;
    avsluttetSelskapDateRange: DateRange | undefined;
    tidligerePerioder: TidligerePerioder;
}
