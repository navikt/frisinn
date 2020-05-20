import { ApiKrav } from './ApiKrav';
import { AxiosError } from 'axios';

export type AccessCheckFunction = (startetSøknadTimestamp?: Date) => Promise<AccessCheckResult>;

export interface AccessCheckResult {
    checkName: ApiKrav;
    passes: boolean;
    info: string;
    error?: AxiosError<any>;
}

export interface AccessCheck {
    name: string;
    check: AccessCheckFunction;
}
