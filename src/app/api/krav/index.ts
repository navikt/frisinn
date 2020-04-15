import api, { ApiEndpoint } from '../api';
import { ApiKrav } from '../../types/Krav';

const getKravEndPointFromKrav = (krav: ApiKrav) => {
    switch (krav) {
        case ApiKrav.alder:
            return ApiEndpoint.kravAlder;
        case ApiKrav.selvstendig:
            return ApiEndpoint.kravSelvstendigNæringsdrivende;
    }
};

export interface KravApiResponse {
    innfrirKrav: boolean;
    beskrivelse: string;
}

export const sjekkKrav = (krav: ApiKrav) => api.get<KravApiResponse>(getKravEndPointFromKrav(krav));
