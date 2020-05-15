import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getInntektsperiode, Inntektsperiode } from '../api/inntektsperiode';
import { AvvikletSelskap } from '../types/AvvikletSelskap';
import { HistoriskInntektÅrstall } from '../types/HistoriskInntektÅrstall';
import { usePrevious } from './usePrevious';

function useInntektsperiode({
    avvikledeSelskaper = [],
    currentHistoriskInntektsÅrstall,
}: {
    avvikledeSelskaper: AvvikletSelskap[];
    currentHistoriskInntektsÅrstall: HistoriskInntektÅrstall | undefined;
}) {
    const [inntektsperiode, setInntektsperiode] = useState<Inntektsperiode | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | undefined>();
    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        setFirstRender(false);
    }, []);

    const fetch = async () => {
        setError(undefined);
        setIsLoading(true);
        try {
            const inntektsperiode = await getInntektsperiode({
                avvikledeSelskaper: avvikledeSelskaper,
            });
            setInntektsperiode(inntektsperiode);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getForetakCompareString = (foretak: AvvikletSelskap[]): string => JSON.stringify({ foretak });
    const compareString = getForetakCompareString(avvikledeSelskaper);
    const prevCompareString = usePrevious(getForetakCompareString(avvikledeSelskaper));
    useEffect(() => {
        if (firstRender && currentHistoriskInntektsÅrstall) {
            setInntektsperiode({
                inntektsårstall: currentHistoriskInntektsÅrstall,
            });
            return;
        }
        if (compareString !== prevCompareString) {
            fetch();
        }
    }, [compareString]);

    return { inntektsperiode, isLoading, error };
}

export default useInntektsperiode;
