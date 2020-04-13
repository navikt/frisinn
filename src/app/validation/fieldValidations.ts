import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import { FieldValidationResult } from 'common/validation/types';

export enum AppFieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'samtykkeErPåkrevd' = 'fieldvalidation.samtykkeErPåkrevd',
    'bekrefterOpplysningerPåkrevd' = 'fieldvalidation.bekrefterOpplysningerPåkrevd',
}

export const MAX_INNTEKT = 9999999;

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

export type FieldValidationArray = (validations: FormikValidateFunction[]) => (value: any) => FieldValidationResult;

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | AppFieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | AppFieldValidationErrors>(error, values);
};

export const validateSamtykke = (value: boolean) => {
    if (value !== true) {
        return createAppFieldValidationError(AppFieldValidationErrors.samtykkeErPåkrevd);
    }
    return undefined;
};

export const validateBekrefterOpplysninger = (value: boolean) => {
    if (value !== true) {
        return createAppFieldValidationError(AppFieldValidationErrors.bekrefterOpplysningerPåkrevd);
    }
    return undefined;
};
