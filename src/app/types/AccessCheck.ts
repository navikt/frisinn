import { Krav } from './Krav';

export type AccessCheckFunction = () => Promise<AccessCheckResult>;

export interface AccessCheckResult {
    checkName: Krav;
    passes: boolean;
    info: string;
}

export interface AccessCheck {
    name: string;
    check: AccessCheckFunction;
}
