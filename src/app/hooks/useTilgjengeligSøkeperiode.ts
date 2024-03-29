import { useEffect, useState } from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { getSøknadsperiode } from '../api/perioder';
import { isSameDate } from '../utils/dateUtils';
import { KORONA_DATE } from '../utils/koronaUtils';
import { usePrevious } from './usePrevious';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export type NO_AVAILABLE_DATERANGE = 'NO_AVAILABLE_DATERANGE';

export type TilgjengeligSøkeperiode = DateRange | NO_AVAILABLE_DATERANGE | undefined;

export const isValidDateRange = (dateRange: TilgjengeligSøkeperiode): dateRange is DateRange => {
    return dateRange !== 'NO_AVAILABLE_DATERANGE' && dateRange !== undefined;
};

function useTilgjengeligSøkeperiode({
    inntektstapStartDato,
    currentAvailableSøknadsperiode,
    startetSøknad,
    søknadsperiode,
    harMottattUtbetalingTidligere,
}: {
    inntektstapStartDato: Date;
    søknadsperiode: DateRange;
    currentAvailableSøknadsperiode: TilgjengeligSøkeperiode;
    startetSøknad: Date;
    harMottattUtbetalingTidligere?: YesOrNo;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tilgjengeligSøkeperiode, setTilgjengeligSøkeperiode] = useState<TilgjengeligSøkeperiode>(undefined);
    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        setFirstRender(false);
    }, []);

    const prevSelectedDate = usePrevious<Date | undefined>(inntektstapStartDato);

    async function fetchStorage(date: Date) {
        setIsLoading(true);
        setTilgjengeligSøkeperiode(undefined);
        try {
            const availableSøknadsperiode = await getSøknadsperiode({ inntektstapStartet: [date], startetSøknad });
            setTilgjengeligSøkeperiode(availableSøknadsperiode);
        } catch (error) {
            setTilgjengeligSøkeperiode('NO_AVAILABLE_DATERANGE');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (firstRender) {
            if (currentAvailableSøknadsperiode) {
                setTilgjengeligSøkeperiode(currentAvailableSøknadsperiode);
            }
            return;
        }
        if (harMottattUtbetalingTidligere === YesOrNo.YES) {
            setTilgjengeligSøkeperiode(søknadsperiode);
        } else if (inntektstapStartDato === undefined) {
            setTilgjengeligSøkeperiode(undefined);
        } else if (!isSameDate(inntektstapStartDato, prevSelectedDate)) {
            fetchStorage(moment.max(moment(KORONA_DATE), moment(inntektstapStartDato)).toDate());
        }
    }, [inntektstapStartDato, harMottattUtbetalingTidligere]);

    return { tilgjengeligSøkeperiode, isLoading };
}

export default useTilgjengeligSøkeperiode;
