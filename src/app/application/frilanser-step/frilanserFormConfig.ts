import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { ApplicationEssentials } from '../../types/ApplicationEssentials';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';

const Field = ApplicationFormField;

type FrilanserFormData = Pick<
    ApplicationFormData,
    | ApplicationFormField.erSelvstendigNæringsdrivende
    | ApplicationFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende
    | ApplicationFormField.frilanserHarTaptInntektPgaKorona
    | ApplicationFormField.frilanserTapHeltEllerDelvisDekketAvNAV
    | ApplicationFormField.frilanserTapHeltDekketAvNAV
    | ApplicationFormField.frilanserInntektstapStartetDato
    | ApplicationFormField.frilanserInntektIPerioden
    | ApplicationFormField.frilanserHarHattInntektSomSelvstendigIPerioden
    | ApplicationFormField.frilanserInntektSomSelvstendigIPerioden
>;

type FrilanserFormPayload = Partial<FrilanserFormData> & ApplicationEssentials;

const FrilanserFormConfig: QuestionConfig<FrilanserFormPayload, ApplicationFormField> = {
    [Field.frilanserHarTaptInntektPgaKorona]: {
        isAnswered: ({ frilanserHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(frilanserHarTaptInntektPgaKorona),
    },
    [Field.frilanserInntektstapStartetDato]: {
        isIncluded: ({ frilanserHarTaptInntektPgaKorona }) => frilanserHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: ({ frilanserInntektstapStartetDato }) => hasValue(frilanserInntektstapStartetDato),
    },
    [Field.frilanserTapHeltEllerDelvisDekketAvNAV]: {
        visibilityFilter: ({ frilanserInntektstapStartetDato }) => hasValue(frilanserInntektstapStartetDato),
        isAnswered: ({ frilanserTapHeltEllerDelvisDekketAvNAV }) => hasValue(frilanserTapHeltEllerDelvisDekketAvNAV),
    },
    [Field.frilanserTapHeltDekketAvNAV]: {
        isIncluded: ({ frilanserTapHeltEllerDelvisDekketAvNAV }) =>
            frilanserTapHeltEllerDelvisDekketAvNAV === YesOrNo.YES,
        isAnswered: ({ frilanserTapHeltDekketAvNAV }) => hasValue(frilanserTapHeltDekketAvNAV),
    },
    [Field.frilanserInntektIPerioden]: {
        visibilityFilter: ({ frilanserTapHeltEllerDelvisDekketAvNAV, frilanserTapHeltDekketAvNAV }) =>
            frilanserTapHeltEllerDelvisDekketAvNAV === YesOrNo.NO || yesOrNoIsAnswered(frilanserTapHeltDekketAvNAV),
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
