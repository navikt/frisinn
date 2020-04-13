import { ApplicationApiData } from '../../types/ApplicationApiData';
import api, { ApiEndpoint } from '../api';

export const sendApplication = (data: ApplicationApiData) => api.post(ApiEndpoint.soknad, data);
