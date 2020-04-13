import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';

export enum IntroFormField {
    'erSelvstendigNæringsdrivendeEllerFrilanser' = 'erSelvstendigNæringsdrivendeEllerFrilanser',
    'harHattInntaktstapPgaKorona' = 'harHattInntaktstapPgaKorona',
}

export interface IntroFormData {
    [IntroFormField.erSelvstendigNæringsdrivendeEllerFrilanser]: YesOrNo;
    [IntroFormField.harHattInntaktstapPgaKorona]: YesOrNo;
}

const Q = IntroFormField;

const IntroFormConfig: QuestionConfig<IntroFormData, IntroFormField> = {
    [Q.erSelvstendigNæringsdrivendeEllerFrilanser]: {
        isAnswered: ({ erSelvstendigNæringsdrivendeEllerFrilanser }) =>
            yesOrNoIsAnswered(erSelvstendigNæringsdrivendeEllerFrilanser),
    },
    [Q.harHattInntaktstapPgaKorona]: {
        parentQuestion: IntroFormField.erSelvstendigNæringsdrivendeEllerFrilanser,
        isIncluded: ({ erSelvstendigNæringsdrivendeEllerFrilanser }) =>
            erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.YES,
        isAnswered: ({ harHattInntaktstapPgaKorona }) => yesOrNoIsAnswered(harHattInntaktstapPgaKorona),
    },
};

export const IntroFormQuestions = Questions<IntroFormData, IntroFormField>(IntroFormConfig);
