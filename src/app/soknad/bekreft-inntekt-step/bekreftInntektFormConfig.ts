import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { TidligerePerioder } from '../../types/SoknadEssentials';

type BekreftInntektFormData = SoknadFormData;

type BekreftInntektPayload = Partial<BekreftInntektFormData> & { apiValues: SoknadApiData } & {
    tidligerePerioder: TidligerePerioder;
};

const selvstendigOk = (values: BekreftInntektPayload): boolean => {
    const {
        apiValues: { selvstendigNæringsdrivende },
        tidligerePerioder: { harSøktSomSelvstendigNæringsdrivende },
        bekrefterSelvstendigInntektIPerioden,
        bekrefterSelvstendigInntektI2019,
        bekrefterSelvstendigInntektI2020,
    } = values;
    return (
        selvstendigNæringsdrivende === undefined ||
        (bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
            (bekrefterSelvstendigInntektI2019 === YesOrNo.YES ||
                bekrefterSelvstendigInntektI2020 === YesOrNo.YES ||
                harSøktSomSelvstendigNæringsdrivende))
    );
};

const frilanserIsOk = (values: BekreftInntektPayload): boolean => {
    const {
        apiValues: { frilanser },
        bekrefterFrilansinntektIPerioden,
        bekrefterFrilanserSelvstendigInntektIPerioden,
        frilanserHarHattInntektSomSelvstendigIPerioden,
    } = values;
    return (
        frilanser === undefined ||
        (bekrefterFrilansinntektIPerioden === YesOrNo.YES &&
            frilanserHarHattInntektSomSelvstendigIPerioden !== YesOrNo.YES) ||
        (frilanserHarHattInntektSomSelvstendigIPerioden === YesOrNo.YES &&
            bekrefterFrilanserSelvstendigInntektIPerioden === YesOrNo.YES)
    );
};

const bekreftInntektFormConfig: QuestionConfig<BekreftInntektPayload, SoknadFormField> = {
    [SoknadFormField.bekrefterSelvstendigInntektIPerioden]: {
        isIncluded: ({ apiValues: { selvstendigNæringsdrivende } }) => selvstendigNæringsdrivende !== undefined,
        isAnswered: ({ bekrefterSelvstendigInntektIPerioden }) =>
            yesOrNoIsAnswered(bekrefterSelvstendigInntektIPerioden),
    },
    [SoknadFormField.bekrefterSelvstendigInntektI2019]: {
        isIncluded: ({
            bekrefterSelvstendigInntektIPerioden,
            apiValues: { selvstendigNæringsdrivende },
            tidligerePerioder: { harSøktSomSelvstendigNæringsdrivende },
        }) =>
            bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
            selvstendigNæringsdrivende !== undefined &&
            (harSøktSomSelvstendigNæringsdrivende || selvstendigNæringsdrivende.inntekt2019 !== undefined),
        isAnswered: ({ bekrefterSelvstendigInntektI2019 }) => yesOrNoIsAnswered(bekrefterSelvstendigInntektI2019),
    },
    [SoknadFormField.bekrefterSelvstendigInntektI2020]: {
        isIncluded: ({
            bekrefterSelvstendigInntektIPerioden,
            apiValues: { selvstendigNæringsdrivende },
            tidligerePerioder: { harSøktSomSelvstendigNæringsdrivende },
        }) =>
            bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
            selvstendigNæringsdrivende !== undefined &&
            (harSøktSomSelvstendigNæringsdrivende || selvstendigNæringsdrivende.inntekt2019 !== undefined),
        isAnswered: ({ bekrefterSelvstendigInntektI2020 }) => yesOrNoIsAnswered(bekrefterSelvstendigInntektI2020),
    },
    [SoknadFormField.bekrefterSelvstendigFrilanserInntektIPerioden]: {
        isIncluded: ({
            bekrefterSelvstendigInntektIPerioden,
            bekrefterSelvstendigInntektI2019,
            bekrefterSelvstendigInntektI2020,
            apiValues: { selvstendigNæringsdrivende, frilanser },
            tidligerePerioder: { harSøktSomSelvstendigNæringsdrivende },
        }) =>
            frilanser === undefined &&
            selvstendigNæringsdrivende !== undefined &&
            bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
            (bekrefterSelvstendigInntektI2019 === YesOrNo.YES ||
                bekrefterSelvstendigInntektI2020 === YesOrNo.YES ||
                harSøktSomSelvstendigNæringsdrivende) &&
            selvstendigNæringsdrivende.inntektIPeriodenSomFrilanser !== undefined,
        isAnswered: ({ bekrefterSelvstendigFrilanserInntektIPerioden }) =>
            yesOrNoIsAnswered(bekrefterSelvstendigFrilanserInntektIPerioden),
    },
    [SoknadFormField.bekrefterFrilansinntektIPerioden]: {
        isIncluded: (payload) => selvstendigOk(payload) && payload.apiValues.frilanser !== undefined,
        isAnswered: ({ bekrefterFrilansinntektIPerioden }) => yesOrNoIsAnswered(bekrefterFrilansinntektIPerioden),
    },
    [SoknadFormField.bekrefterFrilanserSelvstendigInntektIPerioden]: {
        isIncluded: ({
            frilanserHarHattInntektSomSelvstendigIPerioden,
            bekrefterFrilansinntektIPerioden,
            apiValues: { selvstendigNæringsdrivende },
        }) =>
            frilanserHarHattInntektSomSelvstendigIPerioden === YesOrNo.YES &&
            selvstendigNæringsdrivende === undefined &&
            bekrefterFrilansinntektIPerioden === YesOrNo.YES,
        isAnswered: ({ bekrefterFrilanserSelvstendigInntektIPerioden }) =>
            yesOrNoIsAnswered(bekrefterFrilanserSelvstendigInntektIPerioden),
    },
    [SoknadFormField.bekrefterArbeidstakerinntektIPerioden]: {
        isIncluded: (payload) =>
            selvstendigOk(payload) &&
            frilanserIsOk(payload) &&
            isFeatureEnabled(Feature.ARBEIDSTAKERINNTEKT) &&
            payload.arbeidstakerHarHattInntektIPerioden === YesOrNo.YES,
        isAnswered: ({ bekrefterArbeidstakerinntektIPerioden }) =>
            yesOrNoIsAnswered(bekrefterArbeidstakerinntektIPerioden),
    },
};

export const BekreftInntektFormQuestions = Questions<BekreftInntektPayload, SoknadFormField>(bekreftInntektFormConfig);
