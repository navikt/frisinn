import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    createFieldValidationError,
    fieldIsRequiredError,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import { FieldValidationResult } from 'common/validation/types';

export enum AppFieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'samtykkeErPåkrevd' = 'fieldvalidation.samtykkeErPåkrevd',
    'bekrefterOpplysningerPåkrevd' = 'fieldvalidation.bekrefterOpplysningerPåkrevd',
    'dato_utenfor_gyldig_tidsrom' = 'fieldvalidation.dato_utenfor_gyldig_tidsrom',
    'ugyldig_telefonnummer' = 'fieldvalidation.ugyldig_telefonnummer',
}

export const MAX_INNTEKT = 10000000;

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

export type FieldValidationArray = (validations: FormikValidateFunction[]) => (value: any) => FieldValidationResult;

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | AppFieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | AppFieldValidationErrors>(error, values);
};

export const validateAll: FieldValidationArray = (validations: FormikValidateFunction[]) => (
    value: any
): FieldValidationResult => {
    let result: FieldValidationResult;
    validations.some((validate) => {
        const r = validate(value);
        if (r) {
            result = r;
            return true;
        }
        return false;
    });
    return result;
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

const datoErInnenforTidsrom = (dato: Date, range: Partial<DateRange>): boolean => {
    if (range.from && range.to) {
        return moment(dato).isBetween(range.from, range.to, 'days', '[]');
    }
    if (range.from) {
        return moment(dato).isSameOrAfter(range.from);
    }
    if (range.to) {
        return moment(dato).isSameOrBefore(range.to);
    }
    return true;
};

export const validateDateInRange = (tidsrom: Partial<DateRange>) => (date: any): FieldValidationResult => {
    if (!datoErInnenforTidsrom(date, tidsrom)) {
        return createFieldValidationError(AppFieldValidationErrors.dato_utenfor_gyldig_tidsrom);
    }
    return undefined;
};
export const validatePhoneNumber = (value: string): FieldValidationResult => {
    if (!hasValue(value)) {
        return fieldIsRequiredError();
    }
    if (value.length < 5 || value.length > 12) {
        return createAppFieldValidationError(AppFieldValidationErrors.ugyldig_telefonnummer);
    }
    return undefined;
};
