import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';

const Q = SoknadFormField;

type SoknadEntryFormPayload = SoknadFormData & { utelatKontonummer: boolean; isSelvstendigNæringsdrivende: boolean };

const SoknadEntryFormConfig: QuestionConfig<SoknadEntryFormPayload, SoknadFormField> = {
    [Q.kontonummerErRiktig]: {
        isIncluded: ({ utelatKontonummer }) => utelatKontonummer === false,
        isAnswered: ({ kontonummerErRiktig }) => yesOrNoIsAnswered(kontonummerErRiktig),
    },
    [Q.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: {
        isIncluded: ({ utelatKontonummer, kontonummerErRiktig, isSelvstendigNæringsdrivende }) =>
            utelatKontonummer === true ||
            (isSelvstendigNæringsdrivende === true && kontonummerErRiktig === YesOrNo.YES),
        isAnswered: ({ søkerOmTaptInntektSomSelvstendigNæringsdrivende }) =>
            yesOrNoIsAnswered(søkerOmTaptInntektSomSelvstendigNæringsdrivende),
    },
    [Q.søkerOmTaptInntektSomFrilanser]: {
        visibilityFilter: ({ isSelvstendigNæringsdrivende, søkerOmTaptInntektSomSelvstendigNæringsdrivende }) =>
            isSelvstendigNæringsdrivende === false ||
            yesOrNoIsAnswered(søkerOmTaptInntektSomSelvstendigNæringsdrivende),
        isIncluded: ({ kontonummerErRiktig }) => kontonummerErRiktig === YesOrNo.YES,
        isAnswered: ({ søkerOmTaptInntektSomFrilanser }) => yesOrNoIsAnswered(søkerOmTaptInntektSomFrilanser),
    },
    [Q.erSelvstendigNæringsdrivende]: {
        visibilityFilter: ({ søkerOmTaptInntektSomFrilanser }) => yesOrNoIsAnswered(søkerOmTaptInntektSomFrilanser),
        isIncluded: ({ isSelvstendigNæringsdrivende, kontonummerErRiktig }) =>
            isSelvstendigNæringsdrivende === false && kontonummerErRiktig === YesOrNo.YES,
        isAnswered: ({ erSelvstendigNæringsdrivende }) => yesOrNoIsAnswered(erSelvstendigNæringsdrivende),
    },
};

export const SoknadEntryFormQuestions = Questions<SoknadEntryFormPayload, SoknadFormField>(SoknadEntryFormConfig);
