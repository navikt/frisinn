import { createContext } from 'react';
import { QuestionVisibility } from '@navikt/sif-common-question-config/lib';

interface VisibilityContext<FieldName> {
    visibility: QuestionVisibility<FieldName>;
}

export const QuestionVisibilityContext = createContext<VisibilityContext<any> | undefined>(undefined);
