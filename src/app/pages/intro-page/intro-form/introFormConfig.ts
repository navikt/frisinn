import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';
import { RejectReason } from '../../../utils/accessUtils';

export enum IntroFormField {
    'erMellom18og67år' = 'erMellom18og67år',
    'erSelvstendigNæringsdrivende' = 'erSelvstendigNæringsdrivende',
    'erFrilanser' = 'erFrilanser',
    'erArbeidstaker' = 'erArbeidstaker',
    'harFullUtbetalingFraNAV' = 'harFullUtbetalingFraNAV',
    'harTaptInntektPgaKorona' = 'harTaptInntektPgaKorona',
    'harInntektUnder6g' = 'harInntektUnder6g',
    'harSøktAndreYtelserFraNAV' = 'harSøktAndreYtelserFraNAV',
}

export interface IntroFormData {
    [IntroFormField.erMellom18og67år]: YesOrNo;
    [IntroFormField.erSelvstendigNæringsdrivende]: YesOrNo;
    [IntroFormField.erFrilanser]: YesOrNo;
    [IntroFormField.erArbeidstaker]: YesOrNo;
    [IntroFormField.harFullUtbetalingFraNAV]: YesOrNo;
    [IntroFormField.harTaptInntektPgaKorona]: YesOrNo;
    [IntroFormField.harInntektUnder6g]: YesOrNo;
    [IntroFormField.harSøktAndreYtelserFraNAV]: YesOrNo;
}

const Q = IntroFormField;

type IntroFormQuestionsPayload = IntroFormData & { rejectionReason: RejectReason | undefined };

const IntroFormConfig: QuestionConfig<IntroFormQuestionsPayload, IntroFormField> = {
    [Q.erMellom18og67år]: {
        isAnswered: ({ erMellom18og67år }) => yesOrNoIsAnswered(erMellom18og67år),
    },
    [Q.erSelvstendigNæringsdrivende]: {
        parentQuestion: Q.erMellom18og67år,
        isIncluded: ({ erMellom18og67år }) => erMellom18og67år === YesOrNo.YES,
        isAnswered: ({ erSelvstendigNæringsdrivende }) => yesOrNoIsAnswered(erSelvstendigNæringsdrivende),
    },
    [Q.erFrilanser]: {
        parentQuestion: Q.erSelvstendigNæringsdrivende,
        isAnswered: ({ erFrilanser }) => yesOrNoIsAnswered(erFrilanser),
    },
    [Q.erArbeidstaker]: {
        parentQuestion: Q.erFrilanser,
        isIncluded: ({ rejectionReason }) => rejectionReason !== RejectReason.erIkkeSelvstendigEllerFrilanser,
        isAnswered: ({ erArbeidstaker }) => yesOrNoIsAnswered(erArbeidstaker),
    },
    [Q.harFullUtbetalingFraNAV]: {
        parentQuestion: Q.erArbeidstaker,
        isAnswered: ({ harFullUtbetalingFraNAV }) => yesOrNoIsAnswered(harFullUtbetalingFraNAV),
    },
    [Q.harTaptInntektPgaKorona]: {
        parentQuestion: IntroFormField.harFullUtbetalingFraNAV,
        isIncluded: ({ rejectionReason }) => rejectionReason !== RejectReason.harFullUtbetalingFraNAV,
        isAnswered: ({ harTaptInntektPgaKorona }) => yesOrNoIsAnswered(harTaptInntektPgaKorona),
    },
    [Q.harInntektUnder6g]: {
        parentQuestion: Q.harTaptInntektPgaKorona,
        isIncluded: ({ rejectionReason }) => rejectionReason !== RejectReason.harIkkeTaptInntektPgaKorona,
        isAnswered: ({ harInntektUnder6g }) => yesOrNoIsAnswered(harInntektUnder6g),
    },
    [Q.harSøktAndreYtelserFraNAV]: {
        parentQuestion: Q.harInntektUnder6g,
        isIncluded: ({ rejectionReason }) => rejectionReason !== RejectReason.harIkkeTaptInntektPgaKorona,
        isAnswered: ({ harSøktAndreYtelserFraNAV }) => yesOrNoIsAnswered(harSøktAndreYtelserFraNAV),
    },
};

export const IntroFormQuestions = Questions<IntroFormQuestionsPayload, IntroFormField>(IntroFormConfig);
