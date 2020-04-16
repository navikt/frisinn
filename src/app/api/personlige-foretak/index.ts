import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import api, { ApiEndpoint } from '../api';
import { PersonligeForetak } from '../../types/ApplicationEssentials';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface ApiPersonligeForetak {
    organisasjonsnummer: string;
    navn: string;
    registreringsdato: ApiStringDate;
}

interface PersonligeForetakApiResponse {
    personligeForetak: ApiPersonligeForetak[];
    tidligsteRegistreringsdato: ApiStringDate;
}

const parsePersonligeForetakApiResponse = (data: PersonligeForetakApiResponse): PersonligeForetak => {
    const { personligeForetak, tidligsteRegistreringsdato } = data;
    return {
        tidligsteRegistreringsdato: apiStringDateToDate(tidligsteRegistreringsdato),
        foretak: personligeForetak.map((e) => ({
            navn: e.navn,
            organisasjonsnummer: e.organisasjonsnummer,
            registreringsdato: apiStringDateToDate(e.registreringsdato),
        })),
    };
};

export async function getPersonligeForetak(): Promise<PersonligeForetak> {
    try {
        const { data } = await api.get<PersonligeForetakApiResponse>(ApiEndpoint.personligeForetak);
        return Promise.resolve(parsePersonligeForetakApiResponse(data));
    } catch (error) {
        return Promise.reject(undefined);
    }
}
