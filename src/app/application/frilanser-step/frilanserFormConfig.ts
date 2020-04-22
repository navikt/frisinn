import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { ApplicationEssentials } from '../../types/ApplicationEssentials';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';

const Field = ApplicationFormField;

type FrilanserFormData = Pick<
    ApplicationFormData,
    | ApplicationFormField.frilanserHarTaptInntektPgaKorona
    | ApplicationFormField.frilanserErNyetablert
    | ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende
    | ApplicationFormField.frilanserHarYtelseFraNavSomDekkerTapet
    | ApplicationFormField.frilanserYtelseFraNavDekkerHeleTapet
    | ApplicationFormField.frilanserInntektstapStartetDato
    | ApplicationFormField.frilanserInntektIPerioden
    | ApplicationFormField.frilanserHarHattInntektSomSelvstendigIPerioden
    | ApplicationFormField.frilanserInntektSomSelvstendigIPerioden
    | ApplicationFormField.erSelvstendigNæringsdrivende
>;

type FrilanserFormPayload = Partial<FrilanserFormData> & ApplicationEssentials;

const FrilanserFormConfig: QuestionConfig<FrilanserFormPayload, ApplicationFormField> = {
    [Field.frilanserHarTaptInntektPgaKorona]: {
        isAnswered: ({ frilanserHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(frilanserHarTaptInntektPgaKorona),
    },
    [Field.frilanserErNyetablert]: {
        isIncluded: ({ frilanserHarTaptInntektPgaKorona }) => frilanserHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: ({ frilanserErNyetablert }) => hasValue(frilanserErNyetablert),
    },
    [Field.frilanserInntektstapStartetDato]: {
        visibilityFilter: ({ frilanserErNyetablert }) => yesOrNoIsAnswered(frilanserErNyetablert),
        isIncluded: ({ frilanserHarTaptInntektPgaKorona }) => frilanserHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: ({ frilanserInntektstapStartetDato }) => hasValue(frilanserInntektstapStartetDato),
    },
    [Field.frilanserHarYtelseFraNavSomDekkerTapet]: {
        visibilityFilter: ({ frilanserInntektstapStartetDato }) => hasValue(frilanserInntektstapStartetDato),
        isAnswered: ({ frilanserHarYtelseFraNavSomDekkerTapet }) => hasValue(frilanserHarYtelseFraNavSomDekkerTapet),
    },
    [Field.frilanserYtelseFraNavDekkerHeleTapet]: {
        isIncluded: ({ frilanserHarYtelseFraNavSomDekkerTapet }) =>
            frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES,
        isAnswered: ({ frilanserYtelseFraNavDekkerHeleTapet }) => hasValue(frilanserYtelseFraNavDekkerHeleTapet),
    },
    [Field.frilanserInntektIPerioden]: {
        visibilityFilter: ({ frilanserHarYtelseFraNavSomDekkerTapet, frilanserYtelseFraNavDekkerHeleTapet }) =>
            frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.NO ||
            yesOrNoIsAnswered(frilanserYtelseFraNavDekkerHeleTapet),
        isAnswered: ({ frilanserInntektIPerioden }) => hasValue(frilanserInntektIPerioden),
    },
    [Field.frilanserHarHattInntektSomSelvstendigIPerioden]: {
        visibilityFilter: ({ frilanserInntektIPerioden }) => hasValue(frilanserInntektIPerioden),
        isIncluded: ({
            personligeForetak,
            søkerOmTaptInntektSomSelvstendigNæringsdrivende,
            erSelvstendigNæringsdrivende,
        }) => {
            if (personligeForetak === undefined) {
                return erSelvstendigNæringsdrivende === YesOrNo.YES;
            }
            return søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.NO;
        },
        isAnswered: ({ frilanserHarHattInntektSomSelvstendigIPerioden }) =>
            yesOrNoIsAnswered(frilanserHarHattInntektSomSelvstendigIPerioden),
    },
    [Field.frilanserInntektSomSelvstendigIPerioden]: {
        isIncluded: ({ frilanserHarHattInntektSomSelvstendigIPerioden }) =>
            frilanserHarHattInntektSomSelvstendigIPerioden === YesOrNo.YES,
        isAnswered: ({ frilanserInntektSomSelvstendigIPerioden }) => hasValue(frilanserInntektSomSelvstendigIPerioden),
    },
};

export const FrilanserFormQuestions = Questions<FrilanserFormPayload, ApplicationFormField>(FrilanserFormConfig);
