import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';
import { ApplicationEssentials, PersonligeForetak } from '../../types/ApplicationEssentials';
import moment from 'moment';

const Q = ApplicationFormField;

type SelvstendigFormPayload = ApplicationFormData & ApplicationEssentials;

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
    [Q.selvstendigInntektstapErPgaKorona]: {
        isAnswered: ({ selvstendigInntektstapErPgaKorona }) => yesOrNoIsAnswered(selvstendigInntektstapErPgaKorona),
    },
    [Q.selvstendigInntektstapStartetDato]: {
        isIncluded: ({ selvstendigInntektstapErPgaKorona }) => selvstendigInntektstapErPgaKorona === YesOrNo.YES,
        isAnswered: ({ selvstendigInntektstapStartetDato }) => hasValue(selvstendigInntektstapStartetDato),
    },
    [Q.selvstendigInntekt2019]: {
        isIncluded: ({ personligeForetak: registrerteForetakInfo }) =>
            selvstendigSkalOppgiInntekt2019(registrerteForetakInfo),
        isAnswered: ({ selvstendigInntekt2019 }) => hasValue(selvstendigInntekt2019),
    },
    [Q.selvstendigInntekt2020]: {
        isIncluded: ({ personligeForetak: registrerteForetakInfo }) =>
            selvstendigSkalOppgiInntekt2020(registrerteForetakInfo),
        isAnswered: ({ selvstendigInntekt2020 }) => hasValue(selvstendigInntekt2020),
    },
    [Q.selvstendigInntektIPerioden]: {
        isAnswered: ({ selvstendigInntektIPerioden }) => hasValue(selvstendigInntektIPerioden),
    },
};

export const SelvstendigFormQuestions = Questions<SelvstendigFormPayload, ApplicationFormField>(SelvstendigFormConfig);
