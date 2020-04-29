import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';

const Field = SoknadFormField;

type FrilanserFormData = Pick<
    SoknadFormData,
    | SoknadFormField.frilanserHarTaptInntektPgaKorona
    | SoknadFormField.frilanserErNyetablert
    | SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende
    | SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet
    | SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet
    | SoknadFormField.frilanserInntektstapStartetDato
    | SoknadFormField.frilanserInntektIPerioden
    | SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden
    | SoknadFormField.frilanserInntektSomSelvstendigIPerioden
    | SoknadFormField.erSelvstendigNæringsdrivende
>;

type FrilanserFormPayload = Partial<FrilanserFormData> & SoknadEssentials;

const FrilanserFormConfig: QuestionConfig<FrilanserFormPayload, SoknadFormField> = {
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
        isIncluded: ({ frilanserHarYtelseFraNavSomDekkerTapet, frilanserYtelseFraNavDekkerHeleTapet }) =>
            frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.NO ||
            frilanserYtelseFraNavDekkerHeleTapet === YesOrNo.NO,
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

export const FrilanserFormQuestions = Questions<FrilanserFormPayload, SoknadFormField>(FrilanserFormConfig);
