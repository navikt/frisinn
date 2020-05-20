import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const PersonligeForetakMock = {
    personligeFortak1998: {
        foretak: [],
        tidligsteRegistreringsdato: apiStringDateToDate('1998-01-01'),
    },
    personligeFortak2017: {
        foretak: [],
        tidligsteRegistreringsdato: apiStringDateToDate('2017-12-31'),
    },
    personligeFortak2018: {
        foretak: [],
        tidligsteRegistreringsdato: apiStringDateToDate('2018-01-01'),
    },
    personligeFortak2019: {
        foretak: [],
        tidligsteRegistreringsdato: apiStringDateToDate('2019-01-01'),
    },
    personligeFortak2020: {
        foretak: [],
        tidligsteRegistreringsdato: apiStringDateToDate('2020-01-01'),
    },
};
