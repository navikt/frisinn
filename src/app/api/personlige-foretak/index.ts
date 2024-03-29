import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Foretak } from '../../types/SoknadEssentials';
import api, { ApiEndpoint } from '../api';

interface ApiPersonligeForetak {
    organisasjonsnummer: string;
    navn: string;
    registreringsdato: ApiStringDate;
}

export interface PersonligeForetak {
    foretak: Foretak[];
    tidligsteRegistreringsdato: Date;
}

interface PersonligeForetakApiResponse {
    personligeForetak: ApiPersonligeForetak[];
    tidligsteRegistreringsdato: ApiStringDate;
}

const parsePersonligeForetakApiResponse = (data: PersonligeForetakApiResponse): PersonligeForetak => {
    const { personligeForetak = [], tidligsteRegistreringsdato } = data;
    return {
        tidligsteRegistreringsdato: apiStringDateToDate(tidligsteRegistreringsdato),
        foretak: personligeForetak.map((e) => ({
            navn: e.navn,
            organisasjonsnummer: e.organisasjonsnummer,
            registreringsdato: apiStringDateToDate(e.registreringsdato),
        })),
    };
};

export async function getPersonligeForetak(harSøktTidligere?: boolean): Promise<PersonligeForetak | undefined> {
    if (harSøktTidligere) {
        return Promise.resolve(undefined);
    }
    try {
        const { data } = await api.get<PersonligeForetakApiResponse>(ApiEndpoint.personligeForetak);
        return Promise.resolve(parsePersonligeForetakApiResponse(data));
    } catch (error) {
        return Promise.reject(undefined);
    }
}
