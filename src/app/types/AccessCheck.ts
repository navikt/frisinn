import { ApiKrav } from './ApiKrav';

export type AccessCheckFunction = () => Promise<AccessCheckResult>;

export interface AccessCheckResult {
    checkName: ApiKrav;
    passes: boolean;
    info: string;
}

export interface AccessCheck {
    name: string;
    check: AccessCheckFunction;
}
