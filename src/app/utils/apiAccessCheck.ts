import { AccessCheck, AccessCheckResult } from '../types/AccessCheck';
import { Krav } from '../types/Krav';
import { sjekkKrav } from '../api/krav';

export async function apiAccessCheck(krav: Krav): Promise<AccessCheckResult> {
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
        name: Krav.alder,
        check: () => apiAccessCheck(Krav.alder),
    };
};

export const selvstendigAccessCheck = (): AccessCheck => {
    return {
        name: Krav.selvstendig,
        check: () => apiAccessCheck(Krav.selvstendig),
    };
};
export const frilanserAccessCheck = (): AccessCheck => {
    return {
        name: Krav.frilanser,
        check: () => apiAccessCheck(Krav.frilanser),
    };
};
