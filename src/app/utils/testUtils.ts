import { ApiSpørsmålOgSvar } from '../types/SoknadApiData';
import { SoknadFormField } from '../types/SoknadFormData';

export const getQuestionAnswer = (questions: ApiSpørsmålOgSvar[] | undefined, key: SoknadFormField): any => {
    return questions ? questions.find((q) => q.field === key)?.svar : undefined;
};
