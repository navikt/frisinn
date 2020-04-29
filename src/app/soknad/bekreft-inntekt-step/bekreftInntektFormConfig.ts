import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';
import { SoknadApiData } from '../../types/SoknadApiData';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

type BekreftInntektFormData = SoknadFormData;

type BekreftInntektPayload = Partial<BekreftInntektFormData> & { apiValues: SoknadApiData };

const selvstendigOk = (values: BekreftInntektPayload): boolean => {
    const {
        apiValues: { selvstendigNæringsdrivende },
        bekrefterSelvstendigInntektIPerioden,
        bekrefterSelvstendigInntektI2019,
        bekrefterSelvstendigInntektI2020,
    } = values;
    return (
        selvstendigNæringsdrivende === undefined ||
        (bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
            (bekrefterSelvstendigInntektI2019 === YesOrNo.YES || bekrefterSelvstendigInntektI2020 === YesOrNo.YES))
    );
};

const bekreftInntektFormConfig: QuestionConfig<BekreftInntektPayload, SoknadFormField> = {
    [SoknadFormField.bekrefterSelvstendigInntektIPerioden]: {
        isIncluded: ({ apiValues: { selvstendigNæringsdrivende } }) => selvstendigNæringsdrivende !== undefined,
        isAnswered: ({ bekrefterSelvstendigInntektIPerioden }) =>
            yesOrNoIsAnswered(bekrefterSelvstendigInntektIPerioden),
    },
    [SoknadFormField.bekrefterSelvstendigInntektI2019]: {
        isIncluded: ({ bekrefterSelvstendigInntektIPerioden, apiValues: { selvstendigNæringsdrivende } }) =>
            bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
            selvstendigNæringsdrivende !== undefined &&
            selvstendigNæringsdrivende.inntekt2019 !== undefined,
        isAnswered: ({ bekrefterSelvstendigInntektI2019 }) => yesOrNoIsAnswered(bekrefterSelvstendigInntektI2019),
    },
    [SoknadFormField.bekrefterSelvstendigInntektI2020]: {
        isIncluded: ({ bekrefterSelvstendigInntektIPerioden, apiValues: { selvstendigNæringsdrivende } }) =>
            bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
            selvstendigNæringsdrivende !== undefined &&
            selvstendigNæringsdrivende.inntekt2020 !== undefined,
        isAnswered: ({ bekrefterSelvstendigInntektI2020 }) => yesOrNoIsAnswered(bekrefterSelvstendigInntektI2020),
    },
    [SoknadFormField.bekrefterSelvstendigFrilanserInntektIPerioden]: {
        isIncluded: ({
            bekrefterSelvstendigInntektIPerioden,
            bekrefterSelvstendigInntektI2019,
            bekrefterSelvstendigInntektI2020,
            apiValues: { selvstendigNæringsdrivende, frilanser },
        }) =>
            frilanser === undefined &&
            selvstendigNæringsdrivende !== undefined &&
            bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
            (bekrefterSelvstendigInntektI2019 === YesOrNo.YES || bekrefterSelvstendigInntektI2020 === YesOrNo.YES) &&
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
};

export const BekreftInntektFormQuestions = Questions<BekreftInntektPayload, SoknadFormField>(bekreftInntektFormConfig);
