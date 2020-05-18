import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';
import { FrilanserAvslagStatus } from './frilanserAvslag';

const Field = SoknadFormField;

type FrilanserFormData = Pick<
    SoknadFormData,
    | SoknadFormField.frilanserBeregnetTilgjengeligSøknadsperiode
    | SoknadFormField.frilanserHarTaptInntektPgaKorona
    | SoknadFormField.frilanserErNyetablert
    | SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende
    | SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet
    | SoknadFormField.frilanserInntektstapStartetDato
    | SoknadFormField.frilanserInntektIPerioden
    | SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden
    | SoknadFormField.frilanserInntektSomSelvstendigIPerioden
    | SoknadFormField.erSelvstendigNæringsdrivende
>;

export type FrilanserFormConfigPayload = Partial<FrilanserFormData> &
    SoknadEssentials & { avslag: FrilanserAvslagStatus };

const FrilanserFormConfig: QuestionConfig<FrilanserFormConfigPayload, SoknadFormField> = {
    [Field.frilanserErNyetablert]: {
        isAnswered: ({ frilanserErNyetablert }) => yesOrNoIsAnswered(frilanserErNyetablert),
    },
    [Field.frilanserHarTaptInntektPgaKorona]: {
        isIncluded: ({ frilanserErNyetablert }) => yesOrNoIsAnswered(frilanserErNyetablert),
        isAnswered: ({ frilanserHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(frilanserHarTaptInntektPgaKorona),
    },
    [Field.frilanserInntektstapStartetDato]: {
        isIncluded: ({ frilanserHarTaptInntektPgaKorona }) => frilanserHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: ({ frilanserInntektstapStartetDato }) => hasValue(frilanserInntektstapStartetDato),
    },
    [Field.frilanserInntektIPerioden]: {
        isIncluded: ({ frilanserInntektstapStartetDato }) => hasValue(frilanserInntektstapStartetDato),
        isAnswered: ({ frilanserInntektIPerioden }) => hasValue(frilanserInntektIPerioden),
    },
    [Field.frilanserHarYtelseFraNavSomDekkerTapet]: {
        parentQuestion: Field.frilanserInntektIPerioden,
        isIncluded: ({ frilanserInntektstapStartetDato }) => hasValue(frilanserInntektstapStartetDato),
        isAnswered: ({ frilanserHarYtelseFraNavSomDekkerTapet }) =>
            yesOrNoIsAnswered(frilanserHarYtelseFraNavSomDekkerTapet),
    },
    [Field.frilanserHarHattInntektSomSelvstendigIPerioden]: {
        visibilityFilter: ({ frilanserHarYtelseFraNavSomDekkerTapet }) =>
            frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.NO,
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

export const FrilanserFormQuestions = Questions<FrilanserFormConfigPayload, SoknadFormField>(FrilanserFormConfig);
