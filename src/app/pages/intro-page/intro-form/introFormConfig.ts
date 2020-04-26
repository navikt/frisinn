import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';
import introFormUtils from './introFormUtils';
import { hasValue } from '../../../validation/fieldValidations';
import { DateRange } from '../../../utils/dateUtils';

export enum IntroFormField {
    'fødselsdato' = 'fødselsdato',
    'erSelvstendigNæringsdrivende' = 'erSelvstendigNæringsdrivende',
    'selvstendigHarTattUtLønn' = 'selvstendigHarTattUtLønn',
    'selvstendigHarTaptInntektPgaKorona' = 'selvstendigHarTaptInntektPgaKorona',
    'selvstendigInntektstapStartetFørFrist' = 'selvstendigInntektstapStartetFørFrist',
    'selvstendigFårDekketTapet' = 'selvstendigFårDekketTapet',
    'erFrilanser' = 'erFrilanser',
    'frilanserHarTaptInntektPgaKorona' = 'frilanserHarTaptInntektPgaKorona',
    'frilanserInntektstapStartetFørFrist' = 'frilanserInntektstapStartetFørFrist',
    'frilanserFårDekketTapet' = 'frilanserFårDekketTapet',
    'harAlleredeSøkt' = 'harAlleredeSøkt',
    'vilFortsetteTilSøknad' = 'vilFortsetteTilSøknad',
}

export interface IntroFormData {
    [IntroFormField.fødselsdato]: Date;
    [IntroFormField.erSelvstendigNæringsdrivende]: YesOrNo;
    [IntroFormField.selvstendigHarTattUtLønn]: YesOrNo;
    [IntroFormField.selvstendigHarTaptInntektPgaKorona]: YesOrNo;
    [IntroFormField.selvstendigInntektstapStartetFørFrist]: YesOrNo;
    [IntroFormField.selvstendigFårDekketTapet]: YesOrNo;
    [IntroFormField.erFrilanser]: YesOrNo;
    [IntroFormField.frilanserHarTaptInntektPgaKorona]: YesOrNo;
    [IntroFormField.frilanserInntektstapStartetFørFrist]: YesOrNo;
    [IntroFormField.frilanserFårDekketTapet]: YesOrNo;
    [IntroFormField.harAlleredeSøkt]: YesOrNo;
    [IntroFormField.vilFortsetteTilSøknad]: YesOrNo;
}

const Q = IntroFormField;

type IntroFormQuestionsPayload = IntroFormData & { soknadsperiode: DateRange };

const IntroFormConfig: QuestionConfig<IntroFormQuestionsPayload, IntroFormField> = {
    [Q.fødselsdato]: {
        isAnswered: ({ fødselsdato }) => hasValue(fødselsdato),
    },
    [Q.erSelvstendigNæringsdrivende]: {
        isIncluded: ({ fødselsdato, soknadsperiode }) => introFormUtils.birthdateIsValid(fødselsdato, soknadsperiode),
        isAnswered: ({ erSelvstendigNæringsdrivende }) => yesOrNoIsAnswered(erSelvstendigNæringsdrivende),
    },
    [Q.selvstendigHarTattUtLønn]: {
        isIncluded: ({ erSelvstendigNæringsdrivende }) => erSelvstendigNæringsdrivende === YesOrNo.YES,
        isAnswered: ({ selvstendigHarTattUtLønn }) => yesOrNoIsAnswered(selvstendigHarTattUtLønn),
    },
    [Q.selvstendigHarTaptInntektPgaKorona]: {
        parentQuestion: Q.selvstendigHarTattUtLønn,
        isIncluded: ({ selvstendigHarTattUtLønn }) => selvstendigHarTattUtLønn === YesOrNo.YES,
        isAnswered: ({ selvstendigHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(selvstendigHarTaptInntektPgaKorona),
    },
    [Q.selvstendigInntektstapStartetFørFrist]: {
        parentQuestion: Q.selvstendigHarTaptInntektPgaKorona,
        isIncluded: ({ erSelvstendigNæringsdrivende, selvstendigHarTaptInntektPgaKorona }) =>
            erSelvstendigNæringsdrivende === YesOrNo.YES && selvstendigHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: ({ selvstendigInntektstapStartetFørFrist }) =>
            yesOrNoIsAnswered(selvstendigInntektstapStartetFørFrist),
    },
    [Q.selvstendigFårDekketTapet]: {
        parentQuestion: Q.selvstendigInntektstapStartetFørFrist,
        isIncluded: ({ erSelvstendigNæringsdrivende, selvstendigInntektstapStartetFørFrist }) =>
            erSelvstendigNæringsdrivende === YesOrNo.YES && selvstendigInntektstapStartetFørFrist === YesOrNo.YES,
        isAnswered: ({ selvstendigFårDekketTapet }) => yesOrNoIsAnswered(selvstendigFårDekketTapet),
    },
    [Q.erFrilanser]: {
        visibilityFilter: (payload) =>
            introFormUtils.selvstendigIsAnswered(payload) || yesOrNoIsAnswered(payload.erFrilanser),
        isIncluded: ({ fødselsdato, soknadsperiode }) => introFormUtils.birthdateIsValid(fødselsdato, soknadsperiode),
        isAnswered: ({ erFrilanser }) => yesOrNoIsAnswered(erFrilanser),
    },
    [Q.frilanserHarTaptInntektPgaKorona]: {
        parentQuestion: Q.erFrilanser,
        isIncluded: ({ erFrilanser }) => erFrilanser === YesOrNo.YES,
        isAnswered: ({ frilanserHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(frilanserHarTaptInntektPgaKorona),
    },
    [Q.frilanserInntektstapStartetFørFrist]: {
        parentQuestion: Q.frilanserHarTaptInntektPgaKorona,
        isIncluded: ({ frilanserHarTaptInntektPgaKorona }) => frilanserHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: ({ frilanserInntektstapStartetFørFrist }) => yesOrNoIsAnswered(frilanserInntektstapStartetFørFrist),
    },
    [Q.frilanserFårDekketTapet]: {
        parentQuestion: Q.frilanserInntektstapStartetFørFrist,
        isIncluded: ({ frilanserInntektstapStartetFørFrist }) => frilanserInntektstapStartetFørFrist === YesOrNo.YES,
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
