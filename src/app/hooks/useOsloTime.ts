import { useState } from 'react';
import { AxiosError } from 'axios';
import api, { ApiEndpoint } from '../api/api';
import { TidspunktApiResponse } from '../api/tidspunkt/TidspunktApiResponse';
import moment from 'moment';

function useOsloTime() {
    const [utcString, setUtcString] = useState<string | undefined>();
    const [timestamp, setTimestamp] = useState<Date | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | undefined>();

    const fetch = async () => {
        setError(undefined);
        setIsLoading(true);
        try {
            const response = await api.get<TidspunktApiResponse>(ApiEndpoint.tidspunkt);
            setUtcString(response.data.UTC);
            setTimestamp(moment.utc(response.data.UTC).toDate());
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const triggerFetch = async () => {
        await fetch();
        return timestamp;
    };

    return { utcString, timestamp, triggerFetch, isLoading, error };
}

export default useOsloTime;
