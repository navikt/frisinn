import { hasValue } from '../validation/fieldValidations';

export interface HistoriskFortak {
    id: string;
    opprettetDato: Date;
    avsluttetDato: Date;
    navn: string;
}

export const isHistoriskForetak = (foretak: Partial<HistoriskFortak>): foretak is HistoriskFortak => {
    return foretak.avsluttetDato !== undefined && foretak.opprettetDato !== undefined && hasValue(foretak.navn);
};
