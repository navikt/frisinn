import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { isForbidden, isUnauthorized } from '../utils/apiUtils';
import { getEnvironmentVariable, isRunningInDevEnvironment } from '../utils/envUtils';
import { relocateToLoginPage } from '../utils/navigationUtils';
import { triggerSentryError, SentryEventName } from '../utils/sentryUtils';

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
    'personligeForetak' = 'personlige-foretak',
    'perioder' = 'perioder',
    'soker' = 'soker',
    'soknad' = 'soknad',
    'kravAlder' = 'krav/alder',
    'kravSelvstendigNæringsdrivende' = 'krav/selvstendig-naeringsdrivende',
    'kravMaksEnSoknadPerPeriode' = 'krav/maks-en-soknad-per-periode',
    'apenKravAlder' = 'aapen-krav/alder',
    'mellomlagring' = 'mellomlagring',
    'tilgjengelig' = 'tilgjengelig',
}

const api = {
    get: <ResponseType>(endpoint: ApiEndpoint, paramString?: string, config?: AxiosRequestConfig) => {
        const url = `${endpoint}${paramString ? `?${paramString}` : ''}`;
        return axios.get<ResponseType>(url, config || axiosConfig);
    },
    post: <DataType = any, ResponseType = any>(endpoint: ApiEndpoint, data: DataType) =>
        axios.post<ResponseType>(endpoint, data, axiosConfig),
};

export default api;
