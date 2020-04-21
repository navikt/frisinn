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
    birthdateIsValid,
};

export default introFormUtils;
