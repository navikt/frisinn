import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import { FieldValidationResult } from 'common/validation/types';

export enum AppFieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd'
}

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

export type FieldValidationArray = (validations: FormikValidateFunction[]) => (value: any) => FieldValidationResult;

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | AppFieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | AppFieldValidationErrors>(error, values);
};
