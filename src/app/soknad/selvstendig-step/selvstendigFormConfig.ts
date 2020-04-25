import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormField, SelvstendigFormData } from '../../types/SoknadFormData';
import { selvstendigSkalOppgiInntekt2019, selvstendigSkalOppgiInntekt2020 } from '../../utils/selvstendigUtils';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';
import { AvailableDateRange, isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';

const Field = SoknadFormField;

export type SelvstendigFormPayload = SelvstendigFormData &
    SoknadEssentials & { availableDateRange: AvailableDateRange };

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
    [Field.selvstendigHarTaptInntektPgaKorona]: {
        isAnswered: ({ selvstendigHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(selvstendigHarTaptInntektPgaKorona),
    },
    [Field.selvstendigInntektstapStartetDato]: {
        isIncluded: ({ selvstendigHarTaptInntektPgaKorona }) => selvstendigHarTaptInntektPgaKorona === YesOrNo.YES,
        isAnswered: ({ selvstendigInntektstapStartetDato }) => hasValue(selvstendigInntektstapStartetDato),
    },
    [Field.selvstendigHarYtelseFraNavSomDekkerTapet]: {
        isIncluded: ({ availableDateRange }) => isValidDateRange(availableDateRange),
        visibilityFilter: ({ selvstendigInntektstapStartetDato }) => hasValue(selvstendigInntektstapStartetDato),
        isAnswered: ({ selvstendigHarYtelseFraNavSomDekkerTapet }) =>
            hasValue(selvstendigHarYtelseFraNavSomDekkerTapet),
    },
    [Field.selvstendigYtelseFraNavDekkerHeleTapet]: {
        isIncluded: ({ selvstendigHarYtelseFraNavSomDekkerTapet }) =>
            selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES,
        isAnswered: ({ selvstendigYtelseFraNavDekkerHeleTapet }) => hasValue(selvstendigYtelseFraNavDekkerHeleTapet),
    },

    [Field.selvstendigInntektIPerioden]: {
        isIncluded: ({ selvstendigYtelseFraNavDekkerHeleTapet }) =>
            selvstendigYtelseFraNavDekkerHeleTapet !== YesOrNo.YES,
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
        visibilityFilter: showHistoricIncomeQuestion,
        isIncluded: ({ personligeForetak }) => selvstendigSkalOppgiInntekt2019(personligeForetak),
        isAnswered: ({ selvstendigInntekt2019 }) => hasValue(selvstendigInntekt2019),
    },
    [Field.selvstendigInntekt2020]: {
        visibilityFilter: showHistoricIncomeQuestion,
        isIncluded: ({ personligeForetak }) => selvstendigSkalOppgiInntekt2020(personligeForetak),
        isAnswered: ({ selvstendigInntekt2020 }) => hasValue(selvstendigInntekt2020),
    },
    [Field.selvstendigHarRegnskapsfører]: {
        visibilityFilter: ({ selvstendigInntekt2020, selvstendigInntekt2019 }) =>
            hasValue(selvstendigInntekt2020) || hasValue(selvstendigInntekt2019),
        isAnswered: ({ selvstendigHarRegnskapsfører }) => yesOrNoIsAnswered(selvstendigHarRegnskapsfører),
    },
    [Field.selvstendigRegnskapsførerNavn]: {
        isIncluded: ({ selvstendigHarRegnskapsfører }) => selvstendigHarRegnskapsfører === YesOrNo.YES,
        isAnswered: ({ selvstendigRegnskapsførerNavn }) => hasValue(selvstendigRegnskapsførerNavn),
    },
    [Field.selvstendigRegnskapsførerTelefon]: {
        isIncluded: ({ selvstendigHarRegnskapsfører }) => selvstendigHarRegnskapsfører === YesOrNo.YES,
        isAnswered: ({ selvstendigRegnskapsførerTelefon }) => hasValue(selvstendigRegnskapsførerTelefon),
    },
    [Field.selvstendigHarRevisor]: {
        isIncluded: ({ selvstendigHarRegnskapsfører }) => selvstendigHarRegnskapsfører === YesOrNo.NO,
        isAnswered: ({ selvstendigHarRevisor }) => yesOrNoIsAnswered(selvstendigHarRevisor),
    },
    [Field.selvstendigRevisorNavn]: {
        isIncluded: ({ selvstendigHarRevisor }) => selvstendigHarRevisor === YesOrNo.YES,
        isAnswered: ({ selvstendigRevisorNavn }) => hasValue(selvstendigRevisorNavn),
    },
    [Field.selvstendigRevisorTelefon]: {
        isIncluded: ({ selvstendigHarRevisor }) => selvstendigHarRevisor === YesOrNo.YES,
        isAnswered: ({ selvstendigRevisorTelefon }) => hasValue(selvstendigRevisorTelefon),
    },
    [Field.selvstendigRevisorNAVKanTaKontakt]: {
        isIncluded: ({ selvstendigHarRevisor }) => selvstendigHarRevisor === YesOrNo.YES,
        isAnswered: ({ selvstendigRevisorNAVKanTaKontakt }) => yesOrNoIsAnswered(selvstendigRevisorNAVKanTaKontakt),
    },
};

export const SelvstendigFormQuestions = Questions<SelvstendigFormPayload, SoknadFormField>(SelvstendigFormConfig);
