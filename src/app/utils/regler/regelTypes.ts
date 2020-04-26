import { IntlShape } from 'react-intl';

type FeilIntlMessage = (intl: IntlShape) => string;

type avikValueFunk = (intl: IntlShape) => string;

export enum RegelType {
    'FEIL' = 'feil',
    'ADVARSEL' = 'advarsel',
    'INFO' = 'info',
}

export interface Regel<Key, Payload> {
    key: Key;
    test: RegelTest<Payload>;
    type: RegelType;
}

export type RegelTest<Payload> = (grunnlag: Payload) => RegelTestresultat;

export interface RegelTestresultat {
    passerer: boolean;
    info?: RegelTestresultatInfo | RegelTestresultatInfo[];
}

export type RegelTestresultatInfoObject = RegelTestresultatInfo | RegelTestresultatInfo[];

export interface RegelStatus<Key, Payload> {
    key: Key;
    passerer: boolean;
    regelAvvik?: RegelAvvik<Key, Payload>[];
}

export interface RegelAvvik<Key, Payload> {
    id: string;
    regel: Regel<Key, Payload>;
    info: RegelAvvikInfo;
}

interface AvvikInfo {
    values?: { [key: string]: string | number | Date | FeilIntlMessage | avikValueFunk | undefined };
}

export interface RegelAvvikInfo extends AvvikInfo {
    intlKey: string;
}

export interface RegelTestresultatInfo extends AvvikInfo {
    intlKey?: string;
}
