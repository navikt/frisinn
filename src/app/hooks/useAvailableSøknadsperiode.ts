import { useEffect, useState } from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';
import { getSøknadsperiode } from '../api/perioder';
import { isSameDate } from '../utils/dateUtils';
import { usePrevious } from './usePrevious';

export type NO_AVAILABLE_DATERANGE = 'NO_AVAILABLE_DATERANGE';

export type AvailableDateRange = DateRange | NO_AVAILABLE_DATERANGE | undefined;

export const isValidDateRange = (dateRange: AvailableDateRange): dateRange is DateRange => {
    return dateRange !== 'NO_AVAILABLE_DATERANGE' && dateRange !== undefined;
};

function useAvailableSøknadsperiode({
    inntektstapStartDato,
    currentSøknadsperiode,
    currentAvailableSøknadsperiode,
    startetSøknad,
}: {
    inntektstapStartDato: Date;
    currentSøknadsperiode: DateRange;
    currentAvailableSøknadsperiode: AvailableDateRange;
    startetSøknad: Date;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [availableDateRange, setAvailableDateRange] = useState<AvailableDateRange>(undefined);
    const [isLimitedDateRange, setIsLimitedDateRange] = useState<boolean>(false);
    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        setFirstRender(false);
    }, []);

    const prevSelectedDate = usePrevious<Date | undefined>(inntektstapStartDato);

    async function fetchStorage(date: Date) {
        setIsLoading(true);
        setAvailableDateRange(undefined);
        setIsLimitedDateRange(false);
        try {
            const availableSøknadsperiode = await getSøknadsperiode({ inntektstapStartet: [date], startetSøknad });
            setAvailableDateRange(availableSøknadsperiode);
            setIsLimitedDateRange(moment(availableSøknadsperiode.from).isAfter(currentSøknadsperiode.from));
        } catch (error) {
            setAvailableDateRange('NO_AVAILABLE_DATERANGE');
            setIsLimitedDateRange(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (firstRender) {
            if (currentAvailableSøknadsperiode) {
                setAvailableDateRange(currentAvailableSøknadsperiode);
            }
            return;
        }
        if (inntektstapStartDato === undefined) {
            setAvailableDateRange(undefined);
        } else if (!isSameDate(inntektstapStartDato, prevSelectedDate)) {
            const dateToUse = moment.max(moment(currentSøknadsperiode.from), moment(inntektstapStartDato)).toDate();
            fetchStorage(dateToUse);
        }
    }, [inntektstapStartDato]);

    return { availableDateRange, isLimitedDateRange, isLoading };
}

export default useAvailableSøknadsperiode;
