import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';

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
    [Q.erSelvstendigNæringsdrivende]: {
        visibilityFilter: ({ søkerOmTaptInntektSomFrilanser }) => yesOrNoIsAnswered(søkerOmTaptInntektSomFrilanser),
        isIncluded: ({ isSelvstendig, kontonummerErRiktig }) =>
            isSelvstendig === false && kontonummerErRiktig === YesOrNo.YES,
        isAnswered: ({ erSelvstendigNæringsdrivende }) => yesOrNoIsAnswered(erSelvstendigNæringsdrivende),
    },
    [Q.ønskerÅFortsetteKunFrilanserSøknad]: {
        visibilityFilter: ({ søkerOmTaptInntektSomFrilanser, erSelvstendigNæringsdrivende }) =>
            erSelvstendigNæringsdrivende === YesOrNo.YES && søkerOmTaptInntektSomFrilanser === YesOrNo.YES,
        isAnswered: ({ ønskerÅFortsetteKunFrilanserSøknad }) => yesOrNoIsAnswered(ønskerÅFortsetteKunFrilanserSøknad),
    },
};

export const EntryFormQuestions = Questions<EntryFormPayload, ApplicationFormField>(EntryFormConfig);
