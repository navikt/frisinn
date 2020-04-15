import { AccessCheck, AccessCheckResult } from '../types/AccessCheck';
import { ApiKrav } from '../types/Krav';
import { sjekkKrav } from '../api/krav';

export async function apiAccessCheck(krav: ApiKrav): Promise<AccessCheckResult> {
    try {
        const result = await sjekkKrav(krav);
        const passes = result.data.innfrirKrav === true;
        return {
            checkName: krav,
            passes,
            info: result.data.beskrivelse,
        };
    } catch (error) {
        return {
            checkName: krav,
            passes: false,
            info: error.message,
        };
    }
}

export const alderAccessCheck = (): AccessCheck => {
    return {
        name: ApiKrav.alder,
        check: () => apiAccessCheck(ApiKrav.alder),
    };
};

export const selvstendigAccessCheck = (): AccessCheck => {
    return {
        name: ApiKrav.selvstendig,
        check: () => apiAccessCheck(ApiKrav.selvstendig),
    };
};
