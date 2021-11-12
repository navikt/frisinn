import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosJsonConfig } from '../config/axiosConfig';
import { isForbidden, isUnauthorized } from '../utils/apiUtils';
import { getEnvironmentVariable, isRunningInDevEnvironment } from '../utils/envUtils';
import { relocateToLoginPage } from '../utils/navigationUtils';
import { SentryEventName, triggerSentryError } from '../utils/sentryUtils';

axios.defaults.baseURL = getEnvironmentVariable('API_URL');
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    return config;
});
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (isForbidden(error) || isUnauthorized(error)) {
            relocateToLoginPage();
            return Promise.reject(error);
        }
        if (isRunningInDevEnvironment()) {
            triggerSentryError(SentryEventName.apiRequestFailed, error);
        }
        return Promise.reject(error);
    }
);

export enum ApiEndpoint {
    'apenKravAlder' = 'aapen-krav/alder',
    'kravAlder' = 'krav/alder',
    'kravMaksEnSoknadPerPeriode' = 'krav/maks-en-soknad-per-periode',
    'mellomlagring' = 'mellomlagring',
    'perioder' = 'perioder',
    'personligeForetak' = 'personlige-foretak',
    'soker' = 'soker',
    'soknad' = 'soknad',
    'tilgjengelig' = 'tilgjengelig',
    'inntektsperiode' = 'inntektsperiode',
    'tidspunkt' = 'tidspunkt',
    'harSoktTidligerePeriode' = 'har-sokt-tidligere-periode',
}

const api = {
    get: <ResponseType>(endpoint: ApiEndpoint, paramString?: string, config?: AxiosRequestConfig) => {
        const url = `${endpoint}${paramString ? `?${paramString}` : ''}`;
        return axios.get<ResponseType>(url, config || axiosJsonConfig);
    },
    post: <DataType = any, ResponseType = any>(endpoint: ApiEndpoint, data: DataType) =>
        axios.post<ResponseType>(endpoint, data, axiosJsonConfig),
};

export default api;
