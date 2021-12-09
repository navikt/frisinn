import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';

const Q = SoknadFormField;

type SoknadEntryFormPayload = SoknadFormData & { isSelvstendigNæringsdrivende: boolean };

const SoknadEntryFormConfig: QuestionConfig<SoknadEntryFormPayload, SoknadFormField> = {
    [Q.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: {
        isIncluded: ({ isSelvstendigNæringsdrivende }) => isSelvstendigNæringsdrivende === true,
        isAnswered: ({ søkerOmTaptInntektSomSelvstendigNæringsdrivende }) =>
            yesOrNoIsAnswered(søkerOmTaptInntektSomSelvstendigNæringsdrivende),
    },
    [Q.søkerOmTaptInntektSomFrilanser]: {
        visibilityFilter: ({ isSelvstendigNæringsdrivende, søkerOmTaptInntektSomSelvstendigNæringsdrivende }) =>
            isSelvstendigNæringsdrivende === false ||
            yesOrNoIsAnswered(søkerOmTaptInntektSomSelvstendigNæringsdrivende),
        isAnswered: ({ søkerOmTaptInntektSomFrilanser }) => yesOrNoIsAnswered(søkerOmTaptInntektSomFrilanser),
    },
    [Q.erSelvstendigNæringsdrivende]: {
        visibilityFilter: ({ søkerOmTaptInntektSomFrilanser }) => yesOrNoIsAnswered(søkerOmTaptInntektSomFrilanser),
        isIncluded: ({ isSelvstendigNæringsdrivende }) => isSelvstendigNæringsdrivende === false,
        isAnswered: ({ erSelvstendigNæringsdrivende }) => yesOrNoIsAnswered(erSelvstendigNæringsdrivende),
    },
};

export const SoknadEntryFormQuestions = Questions<SoknadEntryFormPayload, SoknadFormField>(SoknadEntryFormConfig);
