import { IntroFormData } from './introFormConfig';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';

const canApplyAsSelvstendig = ({
    erSelvstendigNæringsdrivende,
    selvstendigHarTaptInntektPgaKorona,
    selvstendigFårDekketTapet,
    selvstendigInntektstapStartetFørFrist,
    selvstendigHarAlleredeSøkt,
    selvstendigHarTattUtInntektFraSelskap,
    selvstendigVilFortsetteTilSøknad,
}: IntroFormData): boolean => {
    return (
        erSelvstendigNæringsdrivende === YesOrNo.YES &&
        selvstendigHarTattUtInntektFraSelskap === YesOrNo.YES &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
        selvstendigInntektstapStartetFørFrist === YesOrNo.YES &&
        selvstendigFårDekketTapet === YesOrNo.NO &&
        (selvstendigHarAlleredeSøkt === YesOrNo.NO || selvstendigVilFortsetteTilSøknad === YesOrNo.YES)
    );
};

const canApplyAsFrilanser = ({
    erFrilanser,
    frilanserHarTaptInntektPgaKorona,
    frilanserFårDekketTapet,
    frilanserInntektstapStartetFørFrist,
    frilansHarAlleredeSøkt,
    frilansVilFortsetteTilSøknad,
}: IntroFormData): boolean => {
    return (
        erFrilanser === YesOrNo.YES &&
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserFårDekketTapet === YesOrNo.NO &&
        frilanserInntektstapStartetFørFrist === YesOrNo.YES &&
        (frilansHarAlleredeSøkt === YesOrNo.NO || frilansVilFortsetteTilSøknad === YesOrNo.YES)
    );
};

const frilanserIsAnswered = ({
    erFrilanser,
    frilanserHarTaptInntektPgaKorona,
    frilanserFårDekketTapet,
    frilanserInntektstapStartetFørFrist,
    frilansHarAlleredeSøkt,
    frilansVilFortsetteTilSøknad,
}: IntroFormData): boolean => {
    return (
        erFrilanser === YesOrNo.NO ||
        frilanserHarTaptInntektPgaKorona === YesOrNo.NO ||
        frilanserFårDekketTapet === YesOrNo.NO ||
        frilansHarAlleredeSøkt === YesOrNo.NO ||
        frilansVilFortsetteTilSøknad === YesOrNo.YES ||
        yesOrNoIsAnswered(frilanserInntektstapStartetFørFrist)
    );
};
const selvstendigIsAnswered = ({
    erSelvstendigNæringsdrivende,
    selvstendigHarTattUtInntektFraSelskap,
    selvstendigHarTaptInntektPgaKorona,
    selvstendigFårDekketTapet,
    selvstendigInntektstapStartetFørFrist,
    selvstendigHarAlleredeSøkt,
    selvstendigVilFortsetteTilSøknad,
}: IntroFormData): boolean => {
    return (
        erSelvstendigNæringsdrivende === YesOrNo.NO ||
        selvstendigHarTattUtInntektFraSelskap === YesOrNo.NO ||
        selvstendigHarTaptInntektPgaKorona === YesOrNo.NO ||
        selvstendigInntektstapStartetFørFrist === YesOrNo.NO ||
        selvstendigFårDekketTapet === YesOrNo.YES ||
        selvstendigHarAlleredeSøkt === YesOrNo.NO ||
        (selvstendigHarAlleredeSøkt === YesOrNo.YES && yesOrNoIsAnswered(selvstendigVilFortsetteTilSøknad))
    );
};

const introFormUtils = {
    canApplyAsFrilanser,
    canApplyAsSelvstendig,
    frilanserIsAnswered,
    selvstendigIsAnswered,
};

export default introFormUtils;
