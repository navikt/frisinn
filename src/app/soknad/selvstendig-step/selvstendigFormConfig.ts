import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormField, SelvstendigFormData } from '../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';
import { SelvstendigNæringsdrivendeAvslagStatus } from './selvstendigAvslag';

const Field = SoknadFormField;

interface PayloadExtraInfo {
    skalSpørreOmAvsluttaSelskaper: boolean;
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
    selvstendigHarAvsluttetSelskaper,
    selvstendigAvsluttaSelskaper,
    skalSpørreOmAvsluttaSelskaper,
    selvstendigAlleAvsluttaSelskaperErRegistrert,
}: SelvstendigFormConfigPayload): boolean => {
    if (skalSpørreOmAvsluttaSelskaper === false) {
        return true;
    }
    if (yesOrNoIsAnswered(selvstendigHarAvsluttetSelskaper) === false) {
        return false;
    }
    return selvstendigHarAvsluttetSelskaper === YesOrNo.YES
        ? (selvstendigAvsluttaSelskaper || []).length > 0 &&
              selvstendigAlleAvsluttaSelskaperErRegistrert === YesOrNo.YES
        : selvstendigHarAvsluttetSelskaper === YesOrNo.NO;
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
        isIncluded: ({ avslag: { harIkkeHattInntektstapPgaKorona, søkerIkkeForGyldigTidsrom } }) =>
            harIkkeHattInntektstapPgaKorona === false && søkerIkkeForGyldigTidsrom === false,
        isAnswered: ({ selvstendigInntektIPerioden }) => hasValue(selvstendigInntektIPerioden),
    },

    [Field.selvstendigHarAvsluttetSelskaper]: {
        parentQuestion: Field.selvstendigInntektIPerioden,
        isIncluded: ({ skalSpørreOmAvsluttaSelskaper, avslag: { søkerIkkeForGyldigTidsrom } }) =>
            skalSpørreOmAvsluttaSelskaper && søkerIkkeForGyldigTidsrom === false,
        isAnswered: ({ selvstendigHarAvsluttetSelskaper }) => yesOrNoIsAnswered(selvstendigHarAvsluttetSelskaper),
    },
    [Field.selvstendigAvsluttaSelskaper]: {
        parentQuestion: Field.selvstendigHarAvsluttetSelskaper,
        isIncluded: ({ selvstendigHarAvsluttetSelskaper }) => selvstendigHarAvsluttetSelskaper === YesOrNo.YES,
        isAnswered: ({ selvstendigAvsluttaSelskaper }) => (selvstendigAvsluttaSelskaper || []).length > 0,
    },
    [Field.selvstendigAlleAvsluttaSelskaperErRegistrert]: {
        parentQuestion: Field.selvstendigHarAvsluttetSelskaper,
        visibilityFilter: ({ selvstendigAvsluttaSelskaper = [] }) => selvstendigAvsluttaSelskaper.length > 0,
        isIncluded: ({ selvstendigHarAvsluttetSelskaper = [] }) => selvstendigHarAvsluttetSelskaper === YesOrNo.YES,
        isAnswered: ({ selvstendigAlleAvsluttaSelskaperErRegistrert }) =>
            yesOrNoIsAnswered(selvstendigAlleAvsluttaSelskaperErRegistrert),
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
        isIncluded: ({
            avslag: { oppgirNullHistoriskInntekt, harIkkeHattInntektstapPgaKorona, søkerIkkeForGyldigTidsrom },
        }) =>
            oppgirNullHistoriskInntekt === false &&
            harIkkeHattInntektstapPgaKorona === false &&
            søkerIkkeForGyldigTidsrom === false,
        visibilityFilter: (payload) => {
            const { selvstendigBeregnetInntektsårstall, selvstendigInntekt2019, selvstendigInntekt2020 } = payload;
            return andreSelskaperIsAnswered(payload) && selvstendigBeregnetInntektsårstall === 2019
                ? hasValue(selvstendigInntekt2019)
                : hasValue(selvstendigInntekt2020);
        },
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
        isIncluded: ({
            avslag: {
                oppgirNullHistoriskInntekt,
                harYtelseFraNavSomDekkerTapet,
                harIkkeHattInntektstapPgaKorona,
                søkerIkkeForGyldigTidsrom,
            },
        }) =>
            oppgirNullHistoriskInntekt === false &&
            harYtelseFraNavSomDekkerTapet === false &&
            søkerIkkeForGyldigTidsrom === false &&
            harIkkeHattInntektstapPgaKorona === false,
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
