import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

const Q = ApplicationFormField;

type EntryFormPayload = ApplicationFormData & { isSelvstendig: boolean };

const EntryFormConfig: QuestionConfig<EntryFormPayload, ApplicationFormField> = {
    [Q.kontonummerErRiktig]: {
        isAnswered: ({ kontonummerErRiktig }) => yesOrNoIsAnswered(kontonummerErRiktig),
    },
    [Q.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: {
        isIncluded: ({ kontonummerErRiktig, isSelvstendig }) =>
            isSelvstendig === true && kontonummerErRiktig === YesOrNo.YES,
        isAnswered: ({ søkerOmTaptInntektSomSelvstendigNæringsdrivende }) =>
            yesOrNoIsAnswered(søkerOmTaptInntektSomSelvstendigNæringsdrivende),
    },
    [Q.søkerOmTaptInntektSomFrilanser]: {
        visibilityFilter: ({ isSelvstendig, søkerOmTaptInntektSomSelvstendigNæringsdrivende }) =>
            isSelvstendig === false || yesOrNoIsAnswered(søkerOmTaptInntektSomSelvstendigNæringsdrivende),
        isIncluded: ({ kontonummerErRiktig }) => kontonummerErRiktig === YesOrNo.YES,
        isAnswered: ({ søkerOmTaptInntektSomFrilanser }) => yesOrNoIsAnswered(søkerOmTaptInntektSomFrilanser),
    },
};

export const EntryFormQuestions = Questions<EntryFormPayload, ApplicationFormField>(EntryFormConfig);
