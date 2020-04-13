import api, { ApiEndpoint } from '../api';
import { Krav } from '../../types/Krav';

const getKravEndPointFromKrav = (krav: Krav) => {
    switch (krav) {
        case Krav.alder:
            return ApiEndpoint.kravAlder;
        case Krav.frilanser:
            return ApiEndpoint.kravFrilanser;
        case Krav.selvstendig:
            return ApiEndpoint.kravSelvstendigNæringsdrivende;
    }
};

export interface KravApiResponse {
    innfrirKrav: boolean;
    beskrivelse: string;
}

export const sjekkKrav = (krav: Krav) => api.get<KravApiResponse>(getKravEndPointFromKrav(krav));
