import { hasValue } from '../validation/fieldValidations';

export interface AvvikletSelskap {
    id: string;
    opprettetDato: Date;
    avsluttetDato: Date;
    navn: string;
}

export const isAvvikletSelskap = (foretak: Partial<AvvikletSelskap>): foretak is AvvikletSelskap => {
    return foretak.avsluttetDato !== undefined && foretak.opprettetDato !== undefined && hasValue(foretak.navn);
};
