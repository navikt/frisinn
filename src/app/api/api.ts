import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { isForbidden, isUnauthorized } from '../utils/apiUtils';
import { getEnvironmentVariable } from '../utils/envUtils';
import { navigateToLoginPage } from '../utils/navigationUtils';

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
            navigateToLoginPage();
        }
        return Promise.reject(error);
    }
);

export enum ApiEndpoint {
    'enkeltpersonforetak' = 'enkeltpersonforetak',
    'perioder' = 'perioder',
    'soker' = 'soker',
    'soknad' = 'soknad',
    'kravAlder' = 'krav/alder',
    'kravSelvstendigNæringsdrivende' = 'krav/selvstendig-naeringsdrivende',
    'mellomlagring' = 'mellomlagring',
}

const api = {
    get: <ResponseType>(endpoint: ApiEndpoint, config?: AxiosRequestConfig) =>
        axios.get<ResponseType>(endpoint, config || axiosConfig),
    post: <DataType = any, ResponseType = any>(endpoint: ApiEndpoint, data: DataType) =>
        axios.post<ResponseType>(endpoint, data, axiosConfig),
};

export default api;
