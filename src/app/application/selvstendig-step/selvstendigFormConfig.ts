import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';

const Q = ApplicationFormField;

const SelvstendigFormConfig: QuestionConfig<ApplicationFormData, ApplicationFormField> = {
    [Q.selvstendigHarHattInntektstapHelePerioden]: {
        isAnswered: ({ selvstendigHarHattInntektstapHelePerioden }) =>
            yesOrNoIsAnswered(selvstendigHarHattInntektstapHelePerioden),
    },
    [Q.selvstendigInntektstapStartetDato]: {
        parentQuestion: Q.selvstendigHarHattInntektstapHelePerioden,
        isIncluded: ({ selvstendigHarHattInntektstapHelePerioden }) =>
            selvstendigHarHattInntektstapHelePerioden === YesOrNo.NO,
        isAnswered: ({ selvstendigInntektstapStartetDato }) => hasValue(selvstendigInntektstapStartetDato),
    },
    [Q.selvstendigInntekt2019]: {
        parentQuestion: Q.selvstendigHarHattInntektstapHelePerioden,
        isIncluded: ({ selvstendigHarHattInntektstapHelePerioden, selvstendigInntektstapStartetDato }) =>
            selvstendigHarHattInntektstapHelePerioden === YesOrNo.YES || hasValue(selvstendigInntektstapStartetDato),
        isAnswered: ({ selvstendigInntekt2019 }) => hasValue(selvstendigInntekt2019),
    },
    [Q.selvstendigInntekt2020]: {
        parentQuestion: Q.selvstendigInntekt2019,
        isAnswered: ({ selvstendigInntekt2020 }) => hasValue(selvstendigInntekt2020),
    },
    [Q.selvstendigInntektIPerioden]: {
        parentQuestion: Q.selvstendigInntekt2020,
        isAnswered: ({ selvstendigInntektIPerioden }) => hasValue(selvstendigInntektIPerioden),
    },
};

export const SelvstendigFormQuestions = Questions<ApplicationFormData, ApplicationFormField>(SelvstendigFormConfig);
