import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { ApplicationEssentials } from '../../types/ApplicationEssentials';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { selvstendigSkalOppgiInntekt2019, selvstendigSkalOppgiInntekt2020 } from '../../utils/selvstendigUtils';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';

const Field = ApplicationFormField;

type SelvstendigFormData = Pick<
    Partial<ApplicationFormData>,
    | ApplicationFormField.søkerOmTaptInntektSomFrilanser
    | ApplicationFormField.selvstendigHarTaptInntektPgaKorona
    | ApplicationFormField.selvstendigInntektstapStartetDato
    | ApplicationFormField.selvstendigInntektIPerioden
    | ApplicationFormField.selvstendigErFrilanser
    | ApplicationFormField.selvstendigHarHattInntektSomFrilanserIPerioden
    | ApplicationFormField.selvstendigInntektSomFrilanserIPerioden
    | ApplicationFormField.selvstendigInntekt2019
    | ApplicationFormField.selvstendigInntekt2020
>;

export type SelvstendigFormPayload = SelvstendigFormData & ApplicationEssentials;

const showHistoricIncomeQuestion = ({
    søkerOmTaptInntektSomFrilanser,
    selvstendigInntektIPerioden,
    selvstendigErFrilanser,
    selvstendigHarHattInntektSomFrilanserIPerioden,
    selvstendigInntektSomFrilanserIPerioden,
}: SelvstendigFormPayload): boolean => {
    if (søkerOmTaptInntektSomFrilanser === YesOrNo.YES) {
        return hasValue(selvstendigInntektIPerioden);
    }
    if (selvstendigErFrilanser === YesOrNo.YES) {
        if (selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES) {
            return hasValue(selvstendigInntektSomFrilanserIPerioden);
        }
        return yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden);
    }
    if (selvstendigErFrilanser === YesOrNo.NO) {
        return true;
    }
    return false;
};

const SelvstendigFormConfig: QuestionConfig<SelvstendigFormPayload, ApplicationFormField> = {
    [Field.selvstendigHarTaptInntektPgaKorona]: {
        isAnswered: ({ selvstendigHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(selvstendigHarTaptInntektPgaKorona),
    },
    [Field.selvstendigInntektstapStartetDato]: {
        isIncluded: ({ selvstendigHarTaptInntektPgaKorona }) => selvstendigHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: ({ selvstendigInntektstapStartetDato }) => hasValue(selvstendigInntektstapStartetDato),
    },
    [Field.selvstendigInntektIPerioden]: {
        parentQuestion: Field.selvstendigInntektstapStartetDato,
        isAnswered: ({ selvstendigInntektIPerioden }) => hasValue(selvstendigInntektIPerioden),
    },
    [Field.selvstendigErFrilanser]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ søkerOmTaptInntektSomFrilanser }) => søkerOmTaptInntektSomFrilanser === YesOrNo.NO,
        isAnswered: ({ selvstendigErFrilanser }) => yesOrNoIsAnswered(selvstendigErFrilanser),
    },
    [Field.selvstendigHarHattInntektSomFrilanserIPerioden]: {
        isIncluded: ({ selvstendigErFrilanser }) => selvstendigErFrilanser === YesOrNo.YES,
        isAnswered: ({ selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden),
    },
    [Field.selvstendigInntektSomFrilanserIPerioden]: {
        isIncluded: ({ selvstendigErFrilanser, selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            selvstendigErFrilanser === YesOrNo.YES && selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES,
        visibilityFilter: ({ selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden),
        isAnswered: ({ selvstendigInntektSomFrilanserIPerioden }) => hasValue(selvstendigInntektSomFrilanserIPerioden),
    },
    [Field.selvstendigInntekt2019]: {
        visibilityFilter: showHistoricIncomeQuestion,
        isIncluded: ({ personligeForetak }) => selvstendigSkalOppgiInntekt2019(personligeForetak),
        isAnswered: ({ selvstendigInntekt2019 }) => hasValue(selvstendigInntekt2019),
    },
    [Field.selvstendigInntekt2020]: {
        visibilityFilter: showHistoricIncomeQuestion,
        isIncluded: ({ personligeForetak }) => selvstendigSkalOppgiInntekt2020(personligeForetak),
        isAnswered: ({ selvstendigInntekt2020 }) => hasValue(selvstendigInntekt2020),
    },
};

export const SelvstendigFormQuestions = Questions<SelvstendigFormPayload, ApplicationFormField>(SelvstendigFormConfig);
