import { ApiKrav, KlientKrav } from './Krav';

export type AccessCheckFunction = () => Promise<AccessCheckResult>;

export interface AccessCheckResult {
    checkName: ApiKrav | KlientKrav;
    passes: boolean;
    info: string;
}

export interface AccessCheck {
    name: string;
    check: AccessCheckFunction;
}
