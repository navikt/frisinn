import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Foretak } from '../types/SoknadEssentials';

const foretak: Foretak = {
    organisasjonsnummer: '123',
    navn: 'Foretaket',
    registreringsdato: apiStringDateToDate('2020-01-01'),
};

export const PersonligeForetakMock = {
    personligeFortak1998: {
        foretak: [{ ...foretak, registreringsdato: apiStringDateToDate('1998-01-01') }],
        tidligsteRegistreringsdato: apiStringDateToDate('1998-01-01'),
    },
    personligeFortak2017: {
        foretak: [{ ...foretak, registreringsdato: apiStringDateToDate('2017-12-31') }],
        tidligsteRegistreringsdato: apiStringDateToDate('2017-12-31'),
    },
    personligeFortak2018: {
        foretak: [{ ...foretak, registreringsdato: apiStringDateToDate('2018-01-01') }],
        tidligsteRegistreringsdato: apiStringDateToDate('2018-01-01'),
    },
    personligeFortak2019: {
        foretak: [{ ...foretak, registreringsdato: apiStringDateToDate('2019-01-01') }],
        tidligsteRegistreringsdato: apiStringDateToDate('2019-01-01'),
    },
    personligeFortak2020: {
        foretak: [{ ...foretak, registreringsdato: apiStringDateToDate('2020-01-01') }],
        tidligsteRegistreringsdato: apiStringDateToDate('2020-01-01'),
    },
};
