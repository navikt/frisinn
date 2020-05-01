import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormField, SelvstendigFormData } from '../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';
import { SelvstendigNæringsdrivendeAvslagStatus } from './selvstendigAvslag';

const Field = SoknadFormField;

export type SelvstendigFormConfigPayload = SelvstendigFormData &
    SoknadEssentials & { inntektÅrstall: number } & { avslag: SelvstendigNæringsdrivendeAvslagStatus };

const andreUtbetalingErBesvart = ({
    selvstendigHarYtelseFraNavSomDekkerTapet,
    selvstendigYtelseFraNavDekkerHeleTapet,
}: SelvstendigFormConfigPayload): boolean => {
    return (
        selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.NO ||
        yesOrNoIsAnswered(selvstendigYtelseFraNavDekkerHeleTapet)
    );
};
const showRegnskapsfører = (payload: SelvstendigFormConfigPayload): boolean => {
    const {
        selvstendigErFrilanser,
        selvstendigHarHattInntektSomFrilanserIPerioden,
        selvstendigInntektSomFrilanserIPerioden,
        selvstendigYtelseFraNavDekkerHeleTapet,
        selvstendigHarYtelseFraNavSomDekkerTapet,
        søkerOmTaptInntektSomFrilanser,
    } = payload;
    if (selvstendigErFrilanser === YesOrNo.YES) {
        if (selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES) {
            return hasValue(selvstendigInntektSomFrilanserIPerioden);
        }
        return yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden);
    }
    if (selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES) {
        return selvstendigYtelseFraNavDekkerHeleTapet === YesOrNo.NO;
    }
    if (selvstendigErFrilanser === YesOrNo.NO) {
        return true;
    }
    if (søkerOmTaptInntektSomFrilanser === YesOrNo.YES) {
        return andreUtbetalingErBesvart(payload);
    }
    return false;
};

const SelvstendigFormConfig: QuestionConfig<SelvstendigFormConfigPayload, SoknadFormField> = {
    [Field.selvstendigHarHattInntektFraForetak]: {
        isAnswered: ({ selvstendigHarHattInntektFraForetak }) => yesOrNoIsAnswered(selvstendigHarHattInntektFraForetak),
    },
    [Field.selvstendigHarTaptInntektPgaKorona]: {
        parentQuestion: Field.selvstendigHarHattInntektFraForetak,
        isIncluded: ({ avslag: { erIkkeSelvstendigNæringsdrivende } }) => erIkkeSelvstendigNæringsdrivende === false,
        isAnswered: ({ selvstendigHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(selvstendigHarTaptInntektPgaKorona),
    },
    [Field.selvstendigInntektstapStartetDato]: {
        parentQuestion: Field.selvstendigHarTaptInntektPgaKorona,
        isIncluded: ({ avslag: { harIkkeHattInntektstapPgaKorona } }) => harIkkeHattInntektstapPgaKorona === false,
        isAnswered: ({ selvstendigInntektstapStartetDato }) => hasValue(selvstendigInntektstapStartetDato),
    },
    [Field.selvstendigInntektIPerioden]: {
        parentQuestion: Field.selvstendigInntektstapStartetDato,
        isIncluded: ({ avslag: { søkerIkkeForGyldigTidsrom } }) => søkerIkkeForGyldigTidsrom === false,
        isAnswered: ({ selvstendigInntektIPerioden }) => hasValue(selvstendigInntektIPerioden),
    },
    [Field.selvstendigInntekt2019]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ inntektÅrstall }) => inntektÅrstall === 2019,
        isAnswered: ({ selvstendigInntekt2019 }) => hasValue(selvstendigInntekt2019),
    },
    [Field.selvstendigInntekt2020]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ inntektÅrstall }) => inntektÅrstall === 2020,
        isAnswered: ({ selvstendigInntekt2020 }) => hasValue(selvstendigInntekt2020),
    },
    [Field.selvstendigHarYtelseFraNavSomDekkerTapet]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ avslag: { harIkkeHattHistoriskInntekt } }) => harIkkeHattHistoriskInntekt === false,
        visibilityFilter: ({ inntektÅrstall, selvstendigInntekt2019, selvstendigInntekt2020 }) =>
            inntektÅrstall === 2019 ? hasValue(selvstendigInntekt2019) : hasValue(selvstendigInntekt2020),
        isAnswered: ({ selvstendigHarYtelseFraNavSomDekkerTapet }) =>
            yesOrNoIsAnswered(selvstendigHarYtelseFraNavSomDekkerTapet),
    },
    [Field.selvstendigYtelseFraNavDekkerHeleTapet]: {
        parentQuestion: Field.selvstendigHarYtelseFraNavSomDekkerTapet,
        isIncluded: ({ selvstendigHarYtelseFraNavSomDekkerTapet }) =>
            selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES,
        isAnswered: ({ selvstendigYtelseFraNavDekkerHeleTapet }) =>
            yesOrNoIsAnswered(selvstendigYtelseFraNavDekkerHeleTapet),
    },
    [Field.selvstendigErFrilanser]: {
        parentQuestion: Field.selvstendigHarYtelseFraNavSomDekkerTapet,
        visibilityFilter: andreUtbetalingErBesvart,
        isIncluded: ({ avslag: { utebetalingFraNAVDekkerHeleInntektstapet }, søkerOmTaptInntektSomFrilanser }) =>
            utebetalingFraNAVDekkerHeleInntektstapet === false && søkerOmTaptInntektSomFrilanser === YesOrNo.NO,
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
    [Field.selvstendigHarRegnskapsfører]: {
        parentQuestion: Field.selvstendigHarYtelseFraNavSomDekkerTapet,
        visibilityFilter: showRegnskapsfører,
        isIncluded: ({ avslag: { harIkkeHattHistoriskInntekt, utebetalingFraNAVDekkerHeleInntektstapet } }) =>
            harIkkeHattHistoriskInntekt === false && utebetalingFraNAVDekkerHeleInntektstapet === false,
        isAnswered: ({ selvstendigHarRegnskapsfører }) => yesOrNoIsAnswered(selvstendigHarRegnskapsfører),
    },
    [Field.selvstendigRegnskapsførerNavn]: {
        parentQuestion: Field.selvstendigHarRegnskapsfører,
        isIncluded: ({ selvstendigHarRegnskapsfører }) => selvstendigHarRegnskapsfører === YesOrNo.YES,
        isAnswered: ({ selvstendigRegnskapsførerNavn }) => hasValue(selvstendigRegnskapsførerNavn),
        isOptional: () => true, // enable submit button before these are filled
    },
    [Field.selvstendigRegnskapsførerTelefon]: {
        parentQuestion: Field.selvstendigHarRegnskapsfører,
        isIncluded: ({ selvstendigHarRegnskapsfører }) => selvstendigHarRegnskapsfører === YesOrNo.YES,
        isAnswered: ({ selvstendigRegnskapsførerTelefon }) => hasValue(selvstendigRegnskapsførerTelefon),
        isOptional: () => true, // enable submit button before these are filled
    },
    [Field.selvstendigHarRevisor]: {
        parentQuestion: Field.selvstendigHarRegnskapsfører,
        isIncluded: ({ selvstendigHarRegnskapsfører }) => selvstendigHarRegnskapsfører === YesOrNo.NO,
        isAnswered: ({ selvstendigHarRevisor }) => yesOrNoIsAnswered(selvstendigHarRevisor),
    },
    [Field.selvstendigRevisorNavn]: {
        parentQuestion: Field.selvstendigHarRevisor,
        isIncluded: ({ selvstendigHarRevisor }) => selvstendigHarRevisor === YesOrNo.YES,
        isAnswered: ({ selvstendigRevisorNavn }) => hasValue(selvstendigRevisorNavn),
        isOptional: () => true, // enable submit button before these are filled
    },
    [Field.selvstendigRevisorTelefon]: {
        parentQuestion: Field.selvstendigHarRevisor,
        isIncluded: ({ selvstendigHarRevisor }) => selvstendigHarRevisor === YesOrNo.YES,
        isAnswered: ({ selvstendigRevisorTelefon }) => hasValue(selvstendigRevisorTelefon),
        isOptional: () => true, // enable submit button before these are filled
    },
    [Field.selvstendigRevisorNAVKanTaKontakt]: {
        parentQuestion: Field.selvstendigHarRevisor,
        isIncluded: ({ selvstendigHarRevisor }) => selvstendigHarRevisor === YesOrNo.YES,
        isAnswered: ({ selvstendigRevisorNAVKanTaKontakt }) => yesOrNoIsAnswered(selvstendigRevisorNAVKanTaKontakt),
        isOptional: () => true, // enable submit button before these are filled
    },
};

export const SelvstendigFormQuestions = Questions<SelvstendigFormConfigPayload, SoknadFormField>(SelvstendigFormConfig);
