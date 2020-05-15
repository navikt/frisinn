import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormField, SelvstendigFormData } from '../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';
import { SelvstendigNæringsdrivendeAvslagStatus } from './selvstendigAvslag';

const Field = SoknadFormField;

interface PayloadExtraInfo {
    skalSpørreOmAvvikledeSelskaper: boolean;
    avslag: SelvstendigNæringsdrivendeAvslagStatus;
}

export type SelvstendigFormConfigPayload = SelvstendigFormData & SoknadEssentials & PayloadExtraInfo;

const showRegnskapsfører = (payload: SelvstendigFormConfigPayload): boolean => {
    const {
        selvstendigErFrilanser,
        selvstendigHarHattInntektSomFrilanserIPerioden,
        selvstendigInntektSomFrilanserIPerioden,
        søkerOmTaptInntektSomFrilanser,
        selvstendigHarYtelseFraNavSomDekkerTapet,
    } = payload;
    if (søkerOmTaptInntektSomFrilanser === YesOrNo.YES) {
        return yesOrNoIsAnswered(selvstendigHarYtelseFraNavSomDekkerTapet);
    } else {
        if (selvstendigErFrilanser === YesOrNo.YES) {
            if (selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES) {
                return hasValue(selvstendigInntektSomFrilanserIPerioden);
            }
            return yesOrNoIsAnswered(selvstendigHarHattInntektSomFrilanserIPerioden);
        }
        if (selvstendigErFrilanser === YesOrNo.NO) {
            return true;
        }
    }
    return false;
};

const andreSelskaperIsAnswered = ({
    selvstendigHarAvvikletSelskaper,
    selvstendigAvvikledeSelskaper,
    skalSpørreOmAvvikledeSelskaper,
    selvstendigAlleAvvikledeSelskaperErRegistrert,
}: SelvstendigFormConfigPayload): boolean => {
    if (skalSpørreOmAvvikledeSelskaper === false) {
        return true;
    }
    if (yesOrNoIsAnswered(selvstendigHarAvvikletSelskaper) === false) {
        return false;
    }
    return selvstendigHarAvvikletSelskaper === YesOrNo.YES
        ? (selvstendigAvvikledeSelskaper || []).length > 0 &&
              selvstendigAlleAvvikledeSelskaperErRegistrert === YesOrNo.YES
        : selvstendigHarAvvikletSelskaper === YesOrNo.NO;
};

const SelvstendigFormConfig: QuestionConfig<SelvstendigFormConfigPayload, SoknadFormField> = {
    [Field.selvstendigHarTaptInntektPgaKorona]: {
        isAnswered: ({ selvstendigHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(selvstendigHarTaptInntektPgaKorona),
    },
    [Field.selvstendigInntektstapStartetDato]: {
        parentQuestion: Field.selvstendigHarTaptInntektPgaKorona,
        isIncluded: ({ avslag: { harIkkeHattInntektstapPgaKorona } }) => harIkkeHattInntektstapPgaKorona === false,
        isAnswered: ({ selvstendigInntektstapStartetDato }) => hasValue(selvstendigInntektstapStartetDato),
    },
    [Field.selvstendigInntektIPerioden]: {
        parentQuestion: Field.selvstendigInntektstapStartetDato,
        isIncluded: ({ avslag: { harIkkeHattInntektstapPgaKorona } }) => harIkkeHattInntektstapPgaKorona === false,
        isAnswered: ({ selvstendigInntektIPerioden }) => hasValue(selvstendigInntektIPerioden),
    },

    [Field.selvstendigHarAvvikletSelskaper]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ skalSpørreOmAvvikledeSelskaper, avslag: { søkerIkkeForGyldigTidsrom } }) =>
            skalSpørreOmAvvikledeSelskaper && søkerIkkeForGyldigTidsrom === false,
        isAnswered: ({ selvstendigHarAvvikletSelskaper }) => yesOrNoIsAnswered(selvstendigHarAvvikletSelskaper),
    },
    [Field.selvstendigAvvikledeSelskaper]: {
        parentQuestion: Field.selvstendigHarAvvikletSelskaper,
        isIncluded: ({ selvstendigHarAvvikletSelskaper }) => selvstendigHarAvvikletSelskaper === YesOrNo.YES,
        isAnswered: ({ selvstendigAvvikledeSelskaper }) => (selvstendigAvvikledeSelskaper || []).length > 0,
    },
    [Field.selvstendigAlleAvvikledeSelskaperErRegistrert]: {
        parentQuestion: Field.selvstendigHarAvvikletSelskaper,
        visibilityFilter: ({ selvstendigAvvikledeSelskaper = [] }) => selvstendigAvvikledeSelskaper.length > 0,
        isIncluded: ({ selvstendigHarAvvikletSelskaper = [] }) => selvstendigHarAvvikletSelskaper === YesOrNo.YES,
        isAnswered: ({ selvstendigAlleAvvikledeSelskaperErRegistrert }) =>
            yesOrNoIsAnswered(selvstendigAlleAvvikledeSelskaperErRegistrert),
    },
    [Field.selvstendigInntekt2019]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        visibilityFilter: (payload) =>
            andreSelskaperIsAnswered(payload) && hasValue(payload.selvstendigInntektIPerioden),
        isIncluded: ({ selvstendigBeregnetInntektsårstall }) => selvstendigBeregnetInntektsårstall === 2019,
        isAnswered: ({ selvstendigInntekt2019 }) => hasValue(selvstendigInntekt2019),
    },
    [Field.selvstendigInntekt2020]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        visibilityFilter: (payload) =>
            andreSelskaperIsAnswered(payload) && hasValue(payload.selvstendigInntektIPerioden),
        isIncluded: ({ selvstendigBeregnetInntektsårstall }) => selvstendigBeregnetInntektsårstall === 2020,
        isAnswered: ({ selvstendigInntekt2020 }) => hasValue(selvstendigInntekt2020),
    },
    [Field.selvstendigHarYtelseFraNavSomDekkerTapet]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ avslag: { oppgirNullHistoriskInntekt } }) => oppgirNullHistoriskInntekt === false,
        visibilityFilter: ({ selvstendigBeregnetInntektsårstall, selvstendigInntekt2019, selvstendigInntekt2020 }) =>
            selvstendigBeregnetInntektsårstall === 2019
                ? hasValue(selvstendigInntekt2019)
                : hasValue(selvstendigInntekt2020),
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
    [Field.selvstendigHarRegnskapsfører]: {
        parentQuestion: Field.selvstendigHarYtelseFraNavSomDekkerTapet,
        visibilityFilter: showRegnskapsfører,
        isIncluded: ({ avslag: { oppgirNullHistoriskInntekt, harYtelseFraNavSomDekkerTapet } }) =>
            oppgirNullHistoriskInntekt === false && harYtelseFraNavSomDekkerTapet === false,
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
