import { AxiosError } from 'axios';
import HttpStatus from 'http-status-codes';

export const isForbidden = (error: AxiosError): boolean =>
    error !== undefined && error.response !== undefined && error.response.status === HttpStatus.FORBIDDEN;

export const isUnauthorized = (error: AxiosError): boolean =>
    error !== undefined && error.response !== undefined && error.response.status === HttpStatus.UNAUTHORIZED;

export const getStartedSøknadRequestParam = (date?: Date): string | undefined => {
    return date ? `startetSøknad=${date.toISOString()}` : undefined;
};
