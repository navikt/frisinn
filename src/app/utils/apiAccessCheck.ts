import { sjekkKrav } from '../api/krav';
import { AccessCheck, AccessCheckResult } from '../types/AccessCheck';
import { ApiKrav } from '../types/ApiKrav';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';

export async function apiAccessCheck(krav: ApiKrav, params?: string): Promise<AccessCheckResult> {
    try {
        const result = await sjekkKrav(krav, params);
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
export const apenAlderAccessCheck = (fdato?: Date): AccessCheck => {
    return {
        name: ApiKrav.apenAlder,
        check: () => {
            if (fdato) {
                return apiAccessCheck(ApiKrav.apenAlder, `fødselsdato=${formatDateToApiFormat(fdato)}`);
            }
            return Promise.resolve({
                checkName: ApiKrav.apenAlder,
                passes: false,
                info: 'no-fdate',
            });
        },
    };
};

export const maksEnSoknadPerPeriodeAccessCheck = (): AccessCheck => {
    return {
        name: ApiKrav.maksEnSoknadPerPeriodeAccessCheck,
        check: () => apiAccessCheck(ApiKrav.maksEnSoknadPerPeriodeAccessCheck),
    };
};
