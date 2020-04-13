import api, { ApiEndpoint } from '../api';
import { Person } from '../../types/ApplicationEssentials';

export const getSoker = (): Promise<{ data: Person }> => api.get(ApiEndpoint.soker);
