import { IntroFormData } from './introFormConfig';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';

const canApplyAsSelvstendig = ({
    erSelvstendigNæringsdrivende,
    selvstendigHarTaptInntektPgaKorona,
    selvstendigFårDekketTapet,
}: IntroFormData): boolean => {
    return (
        erSelvstendigNæringsdrivende === YesOrNo.YES &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
        selvstendigFårDekketTapet === YesOrNo.NO
    );
};

const canApplyAsFrilanser = ({
    erFrilanser,
    frilanserHarTaptInntektPgaKorona,
    frilanserFårDekketTapet,
}: IntroFormData): boolean => {
    return (
        erFrilanser === YesOrNo.YES &&
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserFårDekketTapet === YesOrNo.NO
    );
};

const frilanserIsAnswered = ({
    erFrilanser,
    frilanserHarTaptInntektPgaKorona,
    frilanserFårDekketTapet,
}: IntroFormData): boolean => {
    return (
        erFrilanser === YesOrNo.NO ||
        frilanserHarTaptInntektPgaKorona === YesOrNo.NO ||
        yesOrNoIsAnswered(frilanserFårDekketTapet)
    );
};
const selvstendigIsAnswered = ({
    erSelvstendigNæringsdrivende,
    selvstendigHarTaptInntektPgaKorona,
    selvstendigFårDekketTapet,
}: IntroFormData): boolean => {
    return (
        erSelvstendigNæringsdrivende === YesOrNo.NO ||
        selvstendigHarTaptInntektPgaKorona === YesOrNo.NO ||
        yesOrNoIsAnswered(selvstendigFårDekketTapet)
    );
};

const introFormUtils = {
    canApplyAsFrilanser,
    canApplyAsSelvstendig,
    frilanserIsAnswered,
    selvstendigIsAnswered,
};

export default introFormUtils;
