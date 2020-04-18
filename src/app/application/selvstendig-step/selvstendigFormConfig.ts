import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';
import { ApplicationEssentials, PersonligeForetak } from '../../types/ApplicationEssentials';
import moment from 'moment';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

const Field = ApplicationFormField;

type SelvstendigFormPayload = Partial<ApplicationFormData> &
    ApplicationEssentials & { søkerForTaptInntektSomFrilanser: boolean };

const selvstendigSkalOppgiInntekt2019 = (registrerteForetakInfo: PersonligeForetak | undefined): boolean => {
    if (!registrerteForetakInfo) {
        return false;
    }
    const { tidligsteRegistreringsdato } = registrerteForetakInfo;
    return moment(tidligsteRegistreringsdato).isBefore(new Date(2020, 0, 1), 'day');
};

const selvstendigSkalOppgiInntekt2020 = (registrerteForetakInfo: PersonligeForetak | undefined): boolean => {
    if (!registrerteForetakInfo) {
        return false;
    }
    const { tidligsteRegistreringsdato } = registrerteForetakInfo;
    return moment(tidligsteRegistreringsdato).isSameOrAfter(new Date(2020, 0, 1), 'day');
};

const SelvstendigFormConfig: QuestionConfig<SelvstendigFormPayload, ApplicationFormField> = {
    [Field.selvstendigHarTaptInntektPgaKorona]: {
        isAnswered: ({ selvstendigHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(selvstendigHarTaptInntektPgaKorona),
    },
    [Field.selvstendigInntektstapStartetDato]: {
        isIncluded: ({ selvstendigHarTaptInntektPgaKorona }) => selvstendigHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: (payload) => hasValue(payload[Field.selvstendigInntektstapStartetDato]),
    },
    [Field.selvstendigInntektIPerioden]: {
        parentQuestion: Field.selvstendigInntektstapStartetDato,
        isAnswered: ({ selvstendigInntektIPerioden }) => hasValue(selvstendigInntektIPerioden),
    },
    [Field.selvstendigErFrilanser]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ søkerForTaptInntektSomFrilanser }) => søkerForTaptInntektSomFrilanser === true,
        isAnswered: ({ selvstendigErFrilanser }) => yesOrNoIsAnswered(selvstendigErFrilanser),
    },
    [Field.selvstendigHarHattInntektSomFrilanserIPerioden]: {
        isIncluded: ({ selvstendigErFrilanser }) => selvstendigErFrilanser === YesOrNo.YES,
        isAnswered: ({ selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden),
    },
    [Field.selvstendigInntektSomFrilanserIPerioden]: {
        isIncluded: ({ selvstendigErFrilanser }) => selvstendigErFrilanser === YesOrNo.YES,
        visibilityFilter: ({ selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden),
        isAnswered: ({ selvstendigInntektSomFrilanserIPerioden }) => hasValue(selvstendigInntektSomFrilanserIPerioden),
    },
    [Field.selvstendigInntekt2019]: {
        isIncluded: ({ personligeForetak }) => selvstendigSkalOppgiInntekt2019(personligeForetak),
        isAnswered: ({ selvstendigInntekt2019 }) => hasValue(selvstendigInntekt2019),
    },
    [Field.selvstendigInntekt2020]: {
        isIncluded: ({ personligeForetak }) => selvstendigSkalOppgiInntekt2020(personligeForetak),
        isAnswered: ({ selvstendigInntekt2020 }) => hasValue(selvstendigInntekt2020),
    },
};

export const SelvstendigFormQuestions = Questions<SelvstendigFormPayload, ApplicationFormField>(SelvstendigFormConfig);
