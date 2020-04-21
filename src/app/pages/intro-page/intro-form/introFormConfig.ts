import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';
import introFormUtils from './introFormUtils';
import { hasValue } from '../../../validation/fieldValidations';
import { DateRange } from '../../../utils/dateUtils';

export enum IntroFormField {
    'fødselsdato' = 'fødselsdato',
    'erSelvstendigNæringsdrivende' = 'erSelvstendigNæringsdrivende',
    'selvstendigHarTaptInntektPgaKorona' = 'selvstendigHarTaptInntektPgaKorona',
    'selvstendigFårDekketTapet' = 'selvstendigFårDekketTapet',
    'erFrilanser' = 'erFrilanser',
    'frilanserHarTaptInntektPgaKorona' = 'frilanserHarTaptInntektPgaKorona',
    'frilanserFårDekketTapet' = 'frilanserFårDekketTapet',
    'harAlleredeSøkt' = 'harAlleredeSøkt',
    'vilFortsetteTilSøknad' = 'vilFortsetteTilSøknad',
}

export interface IntroFormData {
    [IntroFormField.fødselsdato]: Date;
    [IntroFormField.erSelvstendigNæringsdrivende]: YesOrNo;
    [IntroFormField.selvstendigHarTaptInntektPgaKorona]: YesOrNo;
    [IntroFormField.selvstendigFårDekketTapet]: YesOrNo;
    [IntroFormField.erFrilanser]: YesOrNo;
    [IntroFormField.frilanserHarTaptInntektPgaKorona]: YesOrNo;
    [IntroFormField.frilanserFårDekketTapet]: YesOrNo;
    [IntroFormField.harAlleredeSøkt]: YesOrNo;
    [IntroFormField.vilFortsetteTilSøknad]: YesOrNo;
}

const Q = IntroFormField;

type IntroFormQuestionsPayload = IntroFormData & { currentPeriode: DateRange };

const IntroFormConfig: QuestionConfig<IntroFormQuestionsPayload, IntroFormField> = {
    [Q.fødselsdato]: {
        isAnswered: ({ fødselsdato }) => hasValue(fødselsdato),
    },
    [Q.erSelvstendigNæringsdrivende]: {
        isIncluded: ({ fødselsdato, currentPeriode }) => introFormUtils.birthdateIsValid(fødselsdato, currentPeriode),
        isAnswered: ({ erSelvstendigNæringsdrivende }) => yesOrNoIsAnswered(erSelvstendigNæringsdrivende),
    },
    [Q.selvstendigHarTaptInntektPgaKorona]: {
        parentQuestion: Q.erSelvstendigNæringsdrivende,
        isIncluded: ({ erSelvstendigNæringsdrivende }) => erSelvstendigNæringsdrivende === YesOrNo.YES,
        isAnswered: ({ selvstendigHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(selvstendigHarTaptInntektPgaKorona),
    },
    [Q.selvstendigFårDekketTapet]: {
        parentQuestion: Q.erSelvstendigNæringsdrivende,
        isIncluded: ({ erSelvstendigNæringsdrivende, selvstendigHarTaptInntektPgaKorona }) =>
            erSelvstendigNæringsdrivende === YesOrNo.YES && selvstendigHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: ({ selvstendigFårDekketTapet }) => yesOrNoIsAnswered(selvstendigFårDekketTapet),
    },
    [Q.erFrilanser]: {
        visibilityFilter: (payload) => introFormUtils.selvstendigIsAnswered(payload),
        isIncluded: ({ fødselsdato, currentPeriode }) => introFormUtils.birthdateIsValid(fødselsdato, currentPeriode),
        isAnswered: ({ erFrilanser }) => yesOrNoIsAnswered(erFrilanser),
    },
    [Q.frilanserHarTaptInntektPgaKorona]: {
        parentQuestion: Q.erFrilanser,
        isIncluded: ({ erFrilanser }) => erFrilanser === YesOrNo.YES,
        isAnswered: ({ frilanserHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(frilanserHarTaptInntektPgaKorona),
    },
    [Q.frilanserFårDekketTapet]: {
        parentQuestion: Q.erFrilanser,
        isIncluded: ({ erFrilanser, frilanserHarTaptInntektPgaKorona }) =>
            erFrilanser === YesOrNo.YES && frilanserHarTaptInntektPgaKorona === YesOrNo.YES,
        visibilityFilter: ({ frilanserHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(frilanserHarTaptInntektPgaKorona),
        isAnswered: ({ frilanserFårDekketTapet }) => yesOrNoIsAnswered(frilanserFårDekketTapet),
    },
    [Q.harAlleredeSøkt]: {
        isIncluded: (payload) =>
            introFormUtils.selvstendigIsAnswered(payload) &&
            introFormUtils.frilanserIsAnswered(payload) &&
            (introFormUtils.canApplyAsFrilanser(payload) || introFormUtils.canApplyAsSelvstendig(payload)),
        isAnswered: ({ harAlleredeSøkt }) => yesOrNoIsAnswered(harAlleredeSøkt),
    },
    [Q.vilFortsetteTilSøknad]: {
        parentQuestion: Q.harAlleredeSøkt,
        visibilityFilter: ({ harAlleredeSøkt }) => harAlleredeSøkt === YesOrNo.YES,
        isAnswered: ({ vilFortsetteTilSøknad }) => yesOrNoIsAnswered(vilFortsetteTilSøknad),
    },
};

export const IntroFormQuestions = Questions<IntroFormQuestionsPayload, IntroFormField>(IntroFormConfig);
