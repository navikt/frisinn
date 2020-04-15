import axios, { AxiosError } from 'axios';
import HttpStatus from 'http-status-codes';
import axiosConfig from '../config/axiosConfig';

export const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' }, ...axiosConfig };

export const sendMultipartPostRequest = (url: string, formData: FormData) => {
    return axios.post(url, formData, multipartConfig);
};

export const isForbidden = ({ response }: AxiosError): boolean =>
    response !== undefined && response.status === HttpStatus.FORBIDDEN;

export const isUnauthorized = ({ response }: AxiosError): boolean =>
    response !== undefined && response.status === HttpStatus.UNAUTHORIZED;

export const userNeedsToLogin = (error: AxiosError): boolean => {
    return isForbidden(error) || isUnauthorized(error);
};
