import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';
import introFormUtils from './introFormUtils';
import { hasValue } from '../../../validation/fieldValidations';
import { DateRange } from '../../../utils/dateUtils';

export enum IntroFormField {
    'fødselsdato' = 'fødselsdato',
    'erSelvstendigNæringsdrivende' = 'erSelvstendigNæringsdrivende',
    'selvstendigHarTattUtInntektFraSelskap' = 'selvstendigHarTattUtInntektFraSelskap',
    'selvstendigHarTaptInntektPgaKorona' = 'selvstendigHarTaptInntektPgaKorona',
    'selvstendigInntektstapStartetFørFrist' = 'selvstendigInntektstapStartetFørFrist',
    'selvstendigFårDekketTapet' = 'selvstendigFårDekketTapet',
    'selvstendigHarAlleredeSøkt' = 'selvstendigHarAlleredeSøkt',
    'selvstendigVilFortsetteTilSøknad' = 'selvstendigVilFortsetteTilSøknad',
    'erFrilanser' = 'erFrilanser',
    'frilanserHarTaptInntektPgaKorona' = 'frilanserHarTaptInntektPgaKorona',
    'frilanserInntektstapStartetFørFrist' = 'frilanserInntektstapStartetFørFrist',
    'frilanserFårDekketTapet' = 'frilanserFårDekketTapet',
    'frilansHarAlleredeSøkt' = 'frilansHarAlleredeSøkt',
    'frilansVilFortsetteTilSøknad' = 'frilansVilFortsetteTilSøknad',
}

export interface IntroFormData {
    [IntroFormField.fødselsdato]: Date;
    [IntroFormField.erSelvstendigNæringsdrivende]: YesOrNo;
    [IntroFormField.selvstendigHarTattUtInntektFraSelskap]: YesOrNo;
    [IntroFormField.selvstendigHarTaptInntektPgaKorona]: YesOrNo;
    [IntroFormField.selvstendigInntektstapStartetFørFrist]: YesOrNo;
    [IntroFormField.selvstendigFårDekketTapet]: YesOrNo;
    [IntroFormField.selvstendigHarAlleredeSøkt]: YesOrNo;
    [IntroFormField.erFrilanser]: YesOrNo;
    [IntroFormField.frilanserHarTaptInntektPgaKorona]: YesOrNo;
    [IntroFormField.frilanserInntektstapStartetFørFrist]: YesOrNo;
    [IntroFormField.frilanserFårDekketTapet]: YesOrNo;
    [IntroFormField.frilansHarAlleredeSøkt]: YesOrNo;
    [IntroFormField.selvstendigVilFortsetteTilSøknad]: YesOrNo;
    [IntroFormField.frilansVilFortsetteTilSøknad]: YesOrNo;
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
    [Q.selvstendigHarTattUtInntektFraSelskap]: {
        isIncluded: ({ erSelvstendigNæringsdrivende }) => erSelvstendigNæringsdrivende === YesOrNo.YES,
        isAnswered: ({ selvstendigHarTattUtInntektFraSelskap }) =>
            yesOrNoIsAnswered(selvstendigHarTattUtInntektFraSelskap),
    },
    [Q.selvstendigHarTaptInntektPgaKorona]: {
        parentQuestion: Q.selvstendigHarTattUtInntektFraSelskap,
        isIncluded: ({ selvstendigHarTattUtInntektFraSelskap }) =>
            selvstendigHarTattUtInntektFraSelskap === YesOrNo.YES,
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
    [Q.selvstendigHarAlleredeSøkt]: {
        parentQuestion: Q.selvstendigFårDekketTapet,
        isIncluded: ({ erSelvstendigNæringsdrivende, selvstendigFårDekketTapet }) =>
            erSelvstendigNæringsdrivende === YesOrNo.YES && selvstendigFårDekketTapet === YesOrNo.NO,
        isAnswered: ({ selvstendigHarAlleredeSøkt }) => yesOrNoIsAnswered(selvstendigHarAlleredeSøkt),
    },
    [Q.selvstendigVilFortsetteTilSøknad]: {
        parentQuestion: Q.selvstendigHarAlleredeSøkt,
        isIncluded: ({ erSelvstendigNæringsdrivende, selvstendigHarAlleredeSøkt }) =>
            erSelvstendigNæringsdrivende === YesOrNo.YES && selvstendigHarAlleredeSøkt === YesOrNo.YES,
        isAnswered: ({ selvstendigVilFortsetteTilSøknad }) => yesOrNoIsAnswered(selvstendigVilFortsetteTilSøknad),
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
    [Q.frilansHarAlleredeSøkt]: {
        parentQuestion: Q.frilanserFårDekketTapet,
        isIncluded: ({ erFrilanser, frilanserFårDekketTapet }) =>
            erFrilanser === YesOrNo.YES && frilanserFårDekketTapet === YesOrNo.NO,
        isAnswered: ({ frilanserFårDekketTapet }) => yesOrNoIsAnswered(frilanserFårDekketTapet),
    },
    [Q.frilansVilFortsetteTilSøknad]: {
        parentQuestion: Q.frilansHarAlleredeSøkt,
        isIncluded: ({ erFrilanser, frilansHarAlleredeSøkt }) =>
            erFrilanser === YesOrNo.YES && frilansHarAlleredeSøkt === YesOrNo.YES,
        isAnswered: ({ frilansVilFortsetteTilSøknad }) => yesOrNoIsAnswered(frilansVilFortsetteTilSøknad),
    },
    // [Q.selvstendigHarAlleredeSøkt]: {
    //     isIncluded: (payload) =>
    //         introFormUtils.selvstendigIsAnswered(payload) &&
    //         introFormUtils.frilanserIsAnswered(payload) &&
    //         (introFormUtils.canApplyAsFrilanser(payload) || introFormUtils.canApplyAsSelvstendig(payload)),
    //     isAnswered: ({ harAlleredeSøkt }) => yesOrNoIsAnswered(harAlleredeSøkt),
    // },
    // [Q.vilFortsetteTilSøknad]: {
    //     parentQuestion: Q.harAlleredeSøkt,
    //     visibilityFilter: ({ harAlleredeSøkt }) => harAlleredeSøkt === YesOrNo.YES,
    //     isAnswered: ({ vilFortsetteTilSøknad }) => yesOrNoIsAnswered(vilFortsetteTilSøknad),
    // },
};

export const IntroFormQuestions = Questions<IntroFormQuestionsPayload, IntroFormField>(IntroFormConfig);
