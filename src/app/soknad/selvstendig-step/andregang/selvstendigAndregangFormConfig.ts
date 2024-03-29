import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../../types/SoknadEssentials';
import { SoknadFormField, SelvstendigFormData } from '../../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';
import { hasValue } from '../../../validation/fieldValidations';
import { SelvstendigNæringsdrivendeAvslagStatus } from '../selvstendigAvslag';

const Field = SoknadFormField;

export type SelvstendigAndregangFormConfigPayload = SelvstendigFormData &
    SoknadEssentials & { avslag: Partial<SelvstendigNæringsdrivendeAvslagStatus> };

const SelvstendigFormConfig: QuestionConfig<SelvstendigAndregangFormConfigPayload, SoknadFormField> = {
    [Field.selvstendigHarTaptInntektPgaKorona]: {
        isAnswered: ({ selvstendigHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(selvstendigHarTaptInntektPgaKorona),
    },
    [Field.selvstendigHarMottattUtbetalingTidligere]: {
        parentQuestion: Field.selvstendigHarTaptInntektPgaKorona,
        isIncluded: ({ avslag: { harIkkeHattInntektstapPgaKorona } }) => harIkkeHattInntektstapPgaKorona === false,
        isAnswered: ({ selvstendigHarMottattUtbetalingTidligere }) =>
            yesOrNoIsAnswered(selvstendigHarMottattUtbetalingTidligere),
    },
    [Field.selvstendigInntektstapStartetDato]: {
        isIncluded: ({ selvstendigHarMottattUtbetalingTidligere }) =>
            selvstendigHarMottattUtbetalingTidligere === YesOrNo.NO,
        isAnswered: ({ selvstendigInntektstapStartetDato }) => hasValue(selvstendigInntektstapStartetDato),
    },
    [Field.selvstendigInntektIPerioden]: {
        isIncluded: ({ avslag: { harIkkeHattInntektstapPgaKorona, søkerIkkeForGyldigTidsrom, ingenUttaksdager } }) =>
            harIkkeHattInntektstapPgaKorona === false &&
            søkerIkkeForGyldigTidsrom === false &&
            ingenUttaksdager === false,
        isAnswered: ({ selvstendigInntektIPerioden }) => hasValue(selvstendigInntektIPerioden),
    },
    [Field.selvstendigHarYtelseFraNavSomDekkerTapet]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ avslag: { harIkkeHattInntektstapPgaKorona, søkerIkkeForGyldigTidsrom, ingenUttaksdager } }) =>
            harIkkeHattInntektstapPgaKorona === false &&
            søkerIkkeForGyldigTidsrom === false &&
            ingenUttaksdager === false,
        isAnswered: ({ selvstendigHarYtelseFraNavSomDekkerTapet }) =>
            yesOrNoIsAnswered(selvstendigHarYtelseFraNavSomDekkerTapet),
    },
    [Field.selvstendigErFrilanser]: {
        parentQuestion: Field.selvstendigHarYtelseFraNavSomDekkerTapet,
        isIncluded: ({ avslag: { harYtelseFraNavSomDekkerTapet }, søkerOmTaptInntektSomFrilanser }) =>
            harYtelseFraNavSomDekkerTapet === false && søkerOmTaptInntektSomFrilanser === YesOrNo.NO,
        isAnswered: ({ selvstendigErFrilanser }) => yesOrNoIsAnswered(selvstendigErFrilanser),
    },
    [Field.selvstendigHarHattInntektSomFrilanserIPerioden]: {
        parentQuestion: Field.selvstendigErFrilanser,
        isIncluded: ({ selvstendigErFrilanser }) => selvstendigErFrilanser === YesOrNo.YES,
        isAnswered: ({ selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden),
    },
    [Field.selvstendigInntektSomFrilanserIPerioden]: {
        parentQuestion: Field.selvstendigErFrilanser,
        isIncluded: ({ selvstendigErFrilanser, selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            selvstendigErFrilanser === YesOrNo.YES && selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES,
        isAnswered: ({ selvstendigInntektSomFrilanserIPerioden }) => hasValue(selvstendigInntektSomFrilanserIPerioden),
    },
};

export const SelvstendigFormQuestions = Questions<SelvstendigAndregangFormConfigPayload, SoknadFormField>(
    SelvstendigFormConfig
);
