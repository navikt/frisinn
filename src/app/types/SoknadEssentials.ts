import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn?: string;
    kjønn: string;
    fødselsnummer: string;
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

export interface Søknadsperiodeinfo {
    søknadsperiode: DateRange;
    søknadsfrist: Date;
    erÅpnetForAndregangssøknad: boolean;
    arbeidstakerinntektErAktiv: boolean;
    sisteGyldigeDagForInntektstap: Date;
    førsteUgyldigeStartdatoForInntektstap: Date;
    erISisteSøknadsperiode: boolean;
}

export interface SoknadEssentials {
    person: Person;
    søknadsperiode: DateRange;
    søknadsperiodeinfo: Søknadsperiodeinfo;
    isSelvstendigNæringsdrivende: boolean;
    personligeForetak?: PersonligeForetak;
    avsluttetSelskapDateRange: DateRange | undefined;
    tidligerePerioder: TidligerePerioder;
}
