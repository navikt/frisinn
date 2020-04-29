import { IntroFormData } from './introFormConfig';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';
import { DateRange } from '../../../utils/dateUtils';
import moment from 'moment';

const birthdateIsValid = (date: Date, currentPeriode: DateRange): boolean => {
    const min = moment(currentPeriode.from).subtract(67, 'years').toDate();
    const max = moment(currentPeriode.to).subtract(18, 'years').toDate();
    const isValid = moment(date).isBetween(min, max, 'day', '[]');
    return isValid;
};

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
    frilansHarAlleredeSøkt,
    frilansVilFortsetteTilSøknad,
}: IntroFormData): boolean => {
    return (
        erFrilanser === YesOrNo.YES &&
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserFårDekketTapet === YesOrNo.NO &&
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
}: IntroFormData): boolean => {
    return (
        erSelvstendigNæringsdrivende === YesOrNo.NO ||
        selvstendigHarTattUtInntektFraSelskap === YesOrNo.NO ||
        selvstendigHarTaptInntektPgaKorona === YesOrNo.NO ||
        selvstendigInntektstapStartetFørFrist === YesOrNo.NO ||
        selvstendigHarAlleredeSøkt === YesOrNo.NO ||
        yesOrNoIsAnswered(selvstendigFårDekketTapet)
    );
};

const introFormUtils = {
    canApplyAsFrilanser,
    canApplyAsSelvstendig,
    frilanserIsAnswered,
    selvstendigIsAnswered,
    birthdateIsValid,
};

export default introFormUtils;
