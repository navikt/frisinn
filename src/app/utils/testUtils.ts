import { ApiQuestion } from '../types/SoknadApiData';
import { SoknadFormField } from '../types/SoknadFormData';

export const getQuestionAnswer = (questions: ApiQuestion[] | undefined, key: SoknadFormField): any => {
    return questions ? questions.find((q) => q.field === key)?.answer : undefined;
};
