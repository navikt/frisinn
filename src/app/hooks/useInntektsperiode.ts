import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getInntektsperiode, Inntektsperiode } from '../api/inntektsperiode';
import { HistoriskInntektÅrstall } from '../types/inntektÅrstall';
import { HistoriskFortak } from '../types/HistoriskeForetak';
import { usePrevious } from './usePrevious';

function useInntektsperiode({
    historiskeForetak = [],
    currentHistoriskInntektsÅrstall,
}: {
    historiskeForetak: HistoriskFortak[];
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
                historiskeForetak,
            });
            setInntektsperiode(inntektsperiode);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getForetakCompareString = (foretak: HistoriskFortak[]): string => JSON.stringify({ foretak });
    const compareString = getForetakCompareString(historiskeForetak);
    const prevCompareString = usePrevious(getForetakCompareString(historiskeForetak));
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
