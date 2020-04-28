import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormField, SelvstendigFormData } from '../../types/SoknadFormData';
import { hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';
import { AvailableDateRange, isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';

const Field = SoknadFormField;

export type SelvstendigFormPayload = SelvstendigFormData &
    SoknadEssentials & { availableDateRange: AvailableDateRange; inntektÅrstall: number };

const showHistoricIncomeQuestion = ({
    søkerOmTaptInntektSomFrilanser,
    selvstendigInntektIPerioden,
    selvstendigErFrilanser,
    selvstendigHarHattInntektSomFrilanserIPerioden,
    selvstendigInntektSomFrilanserIPerioden,
}: SelvstendigFormPayload): boolean => {
    if (søkerOmTaptInntektSomFrilanser === YesOrNo.YES) {
        return hasValue(selvstendigInntektIPerioden);
    }
    if (selvstendigErFrilanser === YesOrNo.YES) {
        if (selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES) {
            return hasValue(selvstendigInntektSomFrilanserIPerioden);
        }
        return yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden);
    }
    if (selvstendigErFrilanser === YesOrNo.NO) {
        return true;
    }
    return false;
};

const SelvstendigFormConfig: QuestionConfig<SelvstendigFormPayload, SoknadFormField> = {
    [Field.selvstendigHarHattInntektFraForetak]: {
        isAnswered: ({ selvstendigHarHattInntektFraForetak }) => yesOrNoIsAnswered(selvstendigHarHattInntektFraForetak),
    },
    [Field.selvstendigHarTaptInntektPgaKorona]: {
        parentQuestion: Field.selvstendigHarHattInntektFraForetak,
        isIncluded: ({ selvstendigHarHattInntektFraForetak }) => selvstendigHarHattInntektFraForetak === YesOrNo.YES,
        isAnswered: ({ selvstendigHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(selvstendigHarTaptInntektPgaKorona),
    },
    [Field.selvstendigInntektstapStartetDato]: {
        parentQuestion: Field.selvstendigHarTaptInntektPgaKorona,
        isIncluded: ({ selvstendigHarTaptInntektPgaKorona, selvstendigHarHattInntektFraForetak }) =>
            selvstendigHarTaptInntektPgaKorona === YesOrNo.YES && selvstendigHarHattInntektFraForetak === YesOrNo.YES,
        isAnswered: ({ selvstendigInntektstapStartetDato }) => hasValue(selvstendigInntektstapStartetDato),
    },
    [Field.selvstendigHarYtelseFraNavSomDekkerTapet]: {
        parentQuestion: Field.selvstendigHarTaptInntektPgaKorona,
        isIncluded: ({ availableDateRange, selvstendigHarTaptInntektPgaKorona, selvstendigHarHattInntektFraForetak }) =>
            isValidDateRange(availableDateRange) &&
            selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
            selvstendigHarHattInntektFraForetak === YesOrNo.YES,
        isAnswered: ({ selvstendigHarYtelseFraNavSomDekkerTapet }) =>
            hasValue(selvstendigHarYtelseFraNavSomDekkerTapet),
    },
    [Field.selvstendigYtelseFraNavDekkerHeleTapet]: {
        parentQuestion: Field.selvstendigHarYtelseFraNavSomDekkerTapet,
        isIncluded: ({ selvstendigHarYtelseFraNavSomDekkerTapet }) =>
            selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES,
        isAnswered: ({ selvstendigYtelseFraNavDekkerHeleTapet }) => hasValue(selvstendigYtelseFraNavDekkerHeleTapet),
    },

    [Field.selvstendigInntektIPerioden]: {
        parentQuestion: Field.selvstendigInntektstapStartetDato,
        isIncluded: ({ selvstendigYtelseFraNavDekkerHeleTapet, selvstendigHarYtelseFraNavSomDekkerTapet }) =>
            selvstendigYtelseFraNavDekkerHeleTapet !== YesOrNo.YES ||
            selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.NO,
        visibilityFilter: ({ selvstendigHarYtelseFraNavSomDekkerTapet, selvstendigYtelseFraNavDekkerHeleTapet }) =>
            selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.NO ||
            yesOrNoIsAnswered(selvstendigYtelseFraNavDekkerHeleTapet),
        isAnswered: ({ selvstendigInntektIPerioden }) => hasValue(selvstendigInntektIPerioden),
    },
    [Field.selvstendigErFrilanser]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ søkerOmTaptInntektSomFrilanser }) => søkerOmTaptInntektSomFrilanser === YesOrNo.NO,
        isAnswered: ({ selvstendigErFrilanser }) => yesOrNoIsAnswered(selvstendigErFrilanser),
    },
    [Field.selvstendigHarHattInntektSomFrilanserIPerioden]: {
        isIncluded: ({ selvstendigErFrilanser }) => selvstendigErFrilanser === YesOrNo.YES,
        isAnswered: ({ selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden),
    },
    [Field.selvstendigInntektSomFrilanserIPerioden]: {
        isIncluded: ({ selvstendigErFrilanser, selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            selvstendigErFrilanser === YesOrNo.YES && selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES,
        visibilityFilter: ({ selvstendigHarHattInntektSomFrilanserIPerioden }) =>
            yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden),
        isAnswered: ({ selvstendigInntektSomFrilanserIPerioden }) => hasValue(selvstendigInntektSomFrilanserIPerioden),
    },
    [Field.selvstendigInntekt2019]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        visibilityFilter: showHistoricIncomeQuestion,
        isIncluded: ({ inntektÅrstall }) => inntektÅrstall === 2019,
        isAnswered: ({ selvstendigInntekt2019 }) => hasValue(selvstendigInntekt2019),
    },
    [Field.selvstendigInntekt2020]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        visibilityFilter: showHistoricIncomeQuestion,
        isIncluded: ({ inntektÅrstall }) => inntektÅrstall === 2020,
        isAnswered: ({ selvstendigInntekt2020 }) => hasValue(selvstendigInntekt2020),
    },
    [Field.selvstendigHarRegnskapsfører]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ selvstendigInntekt2019, selvstendigInntekt2020, inntektÅrstall }) =>
            hasValidHistoriskInntekt({ selvstendigInntekt2019, selvstendigInntekt2020 }, inntektÅrstall),
        visibilityFilter: ({ selvstendigInntekt2020, selvstendigInntekt2019 }) =>
            hasValue(selvstendigInntekt2020) || hasValue(selvstendigInntekt2019),
        isAnswered: ({ selvstendigHarRegnskapsfører }) => yesOrNoIsAnswered(selvstendigHarRegnskapsfører),
    },
    [Field.selvstendigRegnskapsførerNavn]: {
        isIncluded: ({ selvstendigHarRegnskapsfører }) => selvstendigHarRegnskapsfører === YesOrNo.YES,
        isAnswered: ({ selvstendigRegnskapsførerNavn }) => hasValue(selvstendigRegnskapsførerNavn),
        isOptional: () => true, // enable submit button before these are filled
    },
    [Field.selvstendigRegnskapsførerTelefon]: {
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
        isIncluded: ({ selvstendigHarRevisor }) => selvstendigHarRevisor === YesOrNo.YES,
        isAnswered: ({ selvstendigRevisorNavn }) => hasValue(selvstendigRevisorNavn),
        isOptional: () => true, // enable submit button before these are filled
    },
    [Field.selvstendigRevisorTelefon]: {
        isIncluded: ({ selvstendigHarRevisor }) => selvstendigHarRevisor === YesOrNo.YES,
        isAnswered: ({ selvstendigRevisorTelefon }) => hasValue(selvstendigRevisorTelefon),
        isOptional: () => true, // enable submit button before these are filled
    },
    [Field.selvstendigRevisorNAVKanTaKontakt]: {
        isIncluded: ({ selvstendigHarRevisor }) => selvstendigHarRevisor === YesOrNo.YES,
        isAnswered: ({ selvstendigRevisorNAVKanTaKontakt }) => yesOrNoIsAnswered(selvstendigRevisorNAVKanTaKontakt),
        isOptional: () => true, // enable submit button before these are filled
    },
};

export const SelvstendigFormQuestions = Questions<SelvstendigFormPayload, SoknadFormField>(SelvstendigFormConfig);
