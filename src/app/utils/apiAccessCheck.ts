import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { sjekkKrav } from '../api/krav';
import { AccessCheck, AccessCheckResult } from '../types/AccessCheck';
import { ApiKrav } from '../types/Krav';

export async function apiAccessCheck(krav: ApiKrav, dateRange?: DateRange): Promise<AccessCheckResult> {
    try {
        const result = await sjekkKrav(krav, dateRange);
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

export const alderAccessCheck = (dateRange: DateRange): AccessCheck => {
    return {
        name: ApiKrav.alder,
        check: () => apiAccessCheck(ApiKrav.alder, dateRange),
    };
};

export const selvstendigAccessCheck = (): AccessCheck => {
    return {
        name: ApiKrav.selvstendig,
        check: () => apiAccessCheck(ApiKrav.selvstendig),
    };
};