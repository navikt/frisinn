import { Person } from '../../types/SoknadEssentials';
import api, { ApiEndpoint } from '../api';

export async function getSoker(): Promise<Person> {
    try {
        const { data } = await api.get<Person>(ApiEndpoint.soker);
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error);
    }
}
