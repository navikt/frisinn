import { hasValue } from '../validation/fieldValidations';

export interface AvsluttetSelskap {
    id: string;
    opprettetDato: Date;
    avsluttetDato: Date;
    navn: string;
}

export const isAvsluttetSelskap = (foretak: Partial<AvsluttetSelskap>): foretak is AvsluttetSelskap => {
    return foretak.avsluttetDato !== undefined && foretak.opprettetDato !== undefined && hasValue(foretak.navn);
};
