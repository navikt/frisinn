import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';

export enum IntroFormField {
    'erSelvstendigNæringsdrivende' = 'erSelvstendigNæringsdrivende',
    'erFrilanser' = 'erFrilanser',
}

export interface IntroFormData {
    [IntroFormField.erFrilanser]: YesOrNo;
    [IntroFormField.erSelvstendigNæringsdrivende]: YesOrNo;
}

const Q = IntroFormField;

const IntroFormConfig: QuestionConfig<IntroFormData, IntroFormField> = {
    [Q.erSelvstendigNæringsdrivende]: {
        isAnswered: ({ erSelvstendigNæringsdrivende }) => yesOrNoIsAnswered(erSelvstendigNæringsdrivende),
    },
    [Q.erFrilanser]: {
        parentQuestion: Q.erSelvstendigNæringsdrivende,
        isAnswered: ({ erFrilanser }) => yesOrNoIsAnswered(erFrilanser),
    },
};

export const IntroFormQuestions = Questions<IntroFormData, IntroFormField>(IntroFormConfig);
