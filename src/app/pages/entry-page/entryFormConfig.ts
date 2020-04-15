import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { RejectReason } from '../../utils/accessUtils';

const Q = ApplicationFormField;

type EntryFormPayload = ApplicationFormData & { isSelvstendig: boolean; rejectionReason?: RejectReason };

const EntryFormConfig: QuestionConfig<EntryFormPayload, ApplicationFormField> = {
    [Q.kontonummerErRiktig]: {
        isAnswered: ({ kontonummerErRiktig }) => yesOrNoIsAnswered(kontonummerErRiktig),
    },
    [Q.søkerOmTaptInntektSomSelvstendigNæringsdrivende]: {
        parentQuestion: Q.kontonummerErRiktig,
        isIncluded: ({ isSelvstendig, rejectionReason }) =>
            isSelvstendig === true && rejectionReason !== RejectReason.kontonummerStemmerIkke,
        isAnswered: ({ søkerOmTaptInntektSomSelvstendigNæringsdrivende }) =>
            yesOrNoIsAnswered(søkerOmTaptInntektSomSelvstendigNæringsdrivende),
    },
    [Q.erFrilanser]: {
        parentQuestion: Q.kontonummerErRiktig,
        visibilityFilter: ({ isSelvstendig, søkerOmTaptInntektSomSelvstendigNæringsdrivende, rejectionReason }) => {
            if (rejectionReason === RejectReason.kontonummerStemmerIkke) {
                return false;
            }
            if (isSelvstendig) {
                return yesOrNoIsAnswered(søkerOmTaptInntektSomSelvstendigNæringsdrivende);
            }
            return true;
        },
        isAnswered: ({ erFrilanser }) => yesOrNoIsAnswered(erFrilanser),
    },
    [Q.søkerOmTaptInntektSomFrilanser]: {
        parentQuestion: Q.erFrilanser,
        isIncluded: ({ erFrilanser }) => erFrilanser === YesOrNo.YES,
        isAnswered: ({ søkerOmTaptInntektSomFrilanser }) => yesOrNoIsAnswered(søkerOmTaptInntektSomFrilanser),
    },
};

export const EntryFormQuestions = Questions<EntryFormPayload, ApplicationFormField>(EntryFormConfig);
