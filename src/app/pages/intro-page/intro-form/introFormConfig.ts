import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';
import introFormUtils from './introFormUtils';

export enum IntroFormField {
    'erMellom18og67år' = 'erMellom18og67år',
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
    [IntroFormField.erMellom18og67år]: YesOrNo;
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

type IntroFormQuestionsPayload = IntroFormData;

const IntroFormConfig: QuestionConfig<IntroFormQuestionsPayload, IntroFormField> = {
    [Q.erMellom18og67år]: {
        isAnswered: ({ erMellom18og67år }) => yesOrNoIsAnswered(erMellom18og67år),
    },
    [Q.erSelvstendigNæringsdrivende]: {
        isIncluded: ({ erMellom18og67år }) => erMellom18og67år === YesOrNo.YES,
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
        isIncluded: ({ erMellom18og67år }) => erMellom18og67år === YesOrNo.YES,
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
