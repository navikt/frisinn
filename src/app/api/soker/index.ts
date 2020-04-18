import api, { ApiEndpoint } from '../api';
import { Person } from '../../types/ApplicationEssentials';

export async function getSoker(): Promise<Person> {
    try {
        const { data } = await api.get<Person>(ApiEndpoint.soker);
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error);
    }
}
