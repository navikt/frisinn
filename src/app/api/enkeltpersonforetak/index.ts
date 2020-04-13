import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import api, { ApiEndpoint } from '../api';
import { RegistrerteEnkeltpersonforetak } from '../../types/ApplicationEssentials';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface ApiEnkeltpersonforetak {
    organisasjonsnummer: string;
    navn: string;
    registreringsdato: ApiStringDate;
}

export interface EnkeltpersonforetakApiResponse {
    enkeltpersonforetak: ApiEnkeltpersonforetak[];
    tidligsteRegistreringsdato: ApiStringDate;
}

const parseEnkeltpersonforetakApiResponse = (data: EnkeltpersonforetakApiResponse): RegistrerteEnkeltpersonforetak => {
    const { enkeltpersonforetak: enkeltpersonforetak, tidligsteRegistreringsdato } = data;
    return {
        tidligsteRegistreringsdato: apiStringDateToDate(tidligsteRegistreringsdato),
        enkeltpersonforetak: enkeltpersonforetak.map((e) => ({
            navn: e.navn,
            organisasjonsnummer: e.organisasjonsnummer,
            registreringsdato: apiStringDateToDate(e.registreringsdato),
        })),
    };
};

export async function getEnkeltpersonforetak(): Promise<RegistrerteEnkeltpersonforetak> {
    try {
        const { data } = await api.get<EnkeltpersonforetakApiResponse>(ApiEndpoint.enkeltpersonforetak);
        return Promise.resolve(parseEnkeltpersonforetakApiResponse(data));
    } catch (error) {
        return Promise.reject(undefined);
    }
}
