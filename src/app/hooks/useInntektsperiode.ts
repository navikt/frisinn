import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getInntektsperiode, Inntektsperiode } from '../api/inntektsperiode';
import { isSameDate } from '../utils/dateUtils';
import { usePrevious } from './usePrevious';

function useInntektsperiode({
    startetSomSelvstendigNæringsdrivende,
    selvstendigInntektstapStartetDato,
}: {
    startetSomSelvstendigNæringsdrivende: Date;
    selvstendigInntektstapStartetDato: Date;
}) {
    const [inntektsperiode, setInntektsperiode] = useState<Inntektsperiode | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | undefined>();

    const prevStartetSomSelvstendigNæringsdrivende = usePrevious<Date | undefined>(
        startetSomSelvstendigNæringsdrivende
    );

    const prevSelvstendigInntektstapStartetDato = usePrevious<Date | undefined>(selvstendigInntektstapStartetDato);

    const fetch = async () => {
        setError(undefined);
        setIsLoading(true);
        try {
            const inntektsperiode = await getInntektsperiode({
                selvstendigInntektstapStartetDato,
                startetSomSelvstendigNæringsdrivende,
            });
            setInntektsperiode(inntektsperiode);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (startetSomSelvstendigNæringsdrivende === undefined || selvstendigInntektstapStartetDato === undefined) {
            setInntektsperiode(undefined);
        } else if (
            isSameDate(prevSelvstendigInntektstapStartetDato, selvstendigInntektstapStartetDato) === false ||
            isSameDate(prevStartetSomSelvstendigNæringsdrivende, startetSomSelvstendigNæringsdrivende) === false
        ) {
            fetch();
        }
    }, [startetSomSelvstendigNæringsdrivende, selvstendigInntektstapStartetDato]);

    return { inntektsperiode, isLoading, error };
}

export default useInntektsperiode;
