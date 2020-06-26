import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadEssentials } from '../../types/SoknadEssentials';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { hasValue } from '../../validation/fieldValidations';
import { FrilanserAvslagStatus } from './frilanserAvslag';

const Field = SoknadFormField;

type FrilanserFormData = Pick<
    SoknadFormData,
    | SoknadFormField.frilanserBeregnetTilgjengeligSøknadsperiode
    | SoknadFormField.frilanserHarMottattUtbetalingTidligere
    | SoknadFormField.frilanserHarTaptInntektPgaKorona
    | SoknadFormField.søkerOmTaptInntektSomSelvstendigNæringsdrivende
    | SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet
    | SoknadFormField.frilanserInntektstapStartetDato
    | SoknadFormField.frilanserInntektIPerioden
    | SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden
    | SoknadFormField.frilanserInntektSomSelvstendigIPerioden
    | SoknadFormField.erSelvstendigNæringsdrivende
>;

export type FrilanserFormConfigPayload = Partial<FrilanserFormData> &
    Pick<SoknadFormData, SoknadFormField.selvstendigStopReason> &
    SoknadEssentials & { avslag: FrilanserAvslagStatus };

const skalSpørreOmSelvstendig = ({
    personligeForetak,
    søkerOmTaptInntektSomSelvstendigNæringsdrivende,
    erSelvstendigNæringsdrivende,
    selvstendigStopReason,
    tidligerePerioder: { harSøktSomSelvstendigNæringsdrivende },
    avslag,
}: FrilanserFormConfigPayload) => {
    if (avslag.utebetalingFraNAVDekkerHeleInntektstapet === true) {
        return false;
    }
    if (
        (personligeForetak === undefined || personligeForetak.foretak.length === 0) &&
        harSøktSomSelvstendigNæringsdrivende === false
    ) {
        return erSelvstendigNæringsdrivende === YesOrNo.YES;
    }
    if (
        harSøktSomSelvstendigNæringsdrivende === true &&
        søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.NO
    ) {
        return true;
    }
    return søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.NO || selvstendigStopReason !== undefined;
};

const FrilanserFormConfig: QuestionConfig<FrilanserFormConfigPayload, SoknadFormField> = {
    [Field.frilanserHarTaptInntektPgaKorona]: {
        isAnswered: ({ frilanserHarTaptInntektPgaKorona }) => yesOrNoIsAnswered(frilanserHarTaptInntektPgaKorona),
    },
    [Field.frilanserHarMottattUtbetalingTidligere]: {
        visibilityFilter: ({ frilanserHarTaptInntektPgaKorona }) => frilanserHarTaptInntektPgaKorona === YesOrNo.YES,
        isIncluded: ({ tidligerePerioder: { harSøktSomFrilanser } }) => harSøktSomFrilanser === true,
        isAnswered: ({ frilanserHarMottattUtbetalingTidligere }) =>
            yesOrNoIsAnswered(frilanserHarMottattUtbetalingTidligere),
    },
    [Field.frilanserInntektstapStartetDato]: {
        visibilityFilter: ({
            tidligerePerioder: { harSøktSomFrilanser },
            frilanserHarMottattUtbetalingTidligere,
            frilanserHarTaptInntektPgaKorona,
        }) =>
            (harSøktSomFrilanser && frilanserHarMottattUtbetalingTidligere === YesOrNo.NO) ||
            frilanserHarTaptInntektPgaKorona === YesOrNo.YES,
        isIncluded: ({
            avslag: { harIkkeHattInntektstapPgaKorona },
            frilanserHarMottattUtbetalingTidligere,
            tidligerePerioder: { harSøktSomFrilanser },
        }) =>
            harIkkeHattInntektstapPgaKorona === false &&
            (harSøktSomFrilanser === false || frilanserHarMottattUtbetalingTidligere === YesOrNo.NO),
        isAnswered: ({ frilanserInntektstapStartetDato }) => hasValue(frilanserInntektstapStartetDato),
    },
    [Field.frilanserInntektIPerioden]: {
        isIncluded: ({
            avslag: { harIkkeHattInntektstapPgaKorona, søkerIkkeForGyldigTidsrom, ingenUttaksdager },
            tidligerePerioder: { harSøktSomFrilanser },
            frilanserHarMottattUtbetalingTidligere,
        }) =>
            (harIkkeHattInntektstapPgaKorona === false &&
                søkerIkkeForGyldigTidsrom === false &&
                ingenUttaksdager === false) ||
            (harSøktSomFrilanser && frilanserHarMottattUtbetalingTidligere === YesOrNo.YES),
        isAnswered: ({ frilanserInntektIPerioden }) => hasValue(frilanserInntektIPerioden),
    },
    [Field.frilanserHarYtelseFraNavSomDekkerTapet]: {
        parentQuestion: Field.frilanserInntektIPerioden,
        visibilityFilter: ({ frilanserInntektIPerioden }) => hasValue(frilanserInntektIPerioden),
        isIncluded: ({ avslag: { harIkkeHattInntektstapPgaKorona, søkerIkkeForGyldigTidsrom } }) =>
            harIkkeHattInntektstapPgaKorona === false && søkerIkkeForGyldigTidsrom === false,

        isAnswered: ({ frilanserHarYtelseFraNavSomDekkerTapet }) =>
            yesOrNoIsAnswered(frilanserHarYtelseFraNavSomDekkerTapet),
    },
    [Field.frilanserHarHattInntektSomSelvstendigIPerioden]: {
        parentQuestion: Field.frilanserHarYtelseFraNavSomDekkerTapet,
        isIncluded: skalSpørreOmSelvstendig,
        isAnswered: ({ frilanserHarHattInntektSomSelvstendigIPerioden }) =>
            yesOrNoIsAnswered(frilanserHarHattInntektSomSelvstendigIPerioden),
    },
    [Field.frilanserInntektSomSelvstendigIPerioden]: {
        isIncluded: (payload) =>
            skalSpørreOmSelvstendig(payload) && payload.frilanserHarHattInntektSomSelvstendigIPerioden === YesOrNo.YES,
        isAnswered: ({ frilanserInntektSomSelvstendigIPerioden }) => hasValue(frilanserInntektSomSelvstendigIPerioden),
    },
};

export const FrilanserFormQuestions = Questions<FrilanserFormConfigPayload, SoknadFormField>(FrilanserFormConfig);
