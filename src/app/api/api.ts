import axios from 'axios';
import axiosConfig from '../config/axiosConfig';
import { ApplicationApiData } from '../types/ApplicationApiData';
import { getEnvironmentVariable } from '../utils/envUtils';

axios.defaults.baseURL = getEnvironmentVariable('API_URL');
axios.defaults.withCredentials = true;

export const getApplicantData = () => axios.get('soker', axiosConfig);

export const sendApplication = (data: ApplicationApiData) => axios.post('soknad', data, axiosConfig);
