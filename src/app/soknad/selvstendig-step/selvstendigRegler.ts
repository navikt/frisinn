import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import { hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
import { SelvstendigFormPayload } from './selvstendigFormConfig';

export enum SelvstendigNæringdsrivendeRegel {
    'erSelvstendigNæringsdrivende' = 'erSelvstendigNæringsdrivende',
    'harHattInntektstapPgaKorona' = 'harHattInntektstapPgaKorona',
    'søkerIGyldigTidsrom' = 'søkerIGyldigTidsrom',
    'utebetalingFraNAVDekkerIkkeHeleInntektstapet' = 'utebetalingFraNAVDekkerIkkeHeleInntektstapet',
    'harHattHistoriskInntekt' = 'harHattHistoriskInntekt',
}

const erSelvstendigNæringsdrivende = ({ selvstendigHarHattInntektFraForetak }: SelvstendigFormPayload) =>
    selvstendigHarHattInntektFraForetak === YesOrNo.YES;

const harHattTapPgaKorona = ({ selvstendigHarTaptInntektPgaKorona }: SelvstendigFormPayload): boolean => {
    return selvstendigHarTaptInntektPgaKorona === YesOrNo.YES;
};

const harHattHistoriskInntekt = ({
    selvstendigHarHattInntektFraForetak,
    selvstendigInntekt2019,
    selvstendigInntekt2020,
    inntektÅrstall,
}: SelvstendigFormPayload): boolean => {
    return (
        selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
        hasValidHistoriskInntekt({ selvstendigInntekt2019, selvstendigInntekt2020 }, inntektÅrstall)
    );
};

const søkerIGyldigTidsrom = ({ availableDateRange }: SelvstendigFormPayload) => {
    return isValidDateRange(availableDateRange);
};

const utbetalingFraNAVDekkerIkkeHeleTapet = ({
    selvstendigHarYtelseFraNavSomDekkerTapet,
    selvstendigYtelseFraNavDekkerHeleTapet,
}: SelvstendigFormPayload) => {
    return (
        selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.NO ||
        (selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES &&
            selvstendigYtelseFraNavDekkerHeleTapet !== YesOrNo.YES)
    );
};

export interface KontrollResultat {
    [key: string]: boolean;
}

export const kontrollerSelvstendigRegler = (payload: SelvstendigFormPayload): KontrollResultat => ({
    [SelvstendigNæringdsrivendeRegel.erSelvstendigNæringsdrivende]: erSelvstendigNæringsdrivende(payload),
    [SelvstendigNæringdsrivendeRegel.harHattInntektstapPgaKorona]: harHattTapPgaKorona(payload),
    [SelvstendigNæringdsrivendeRegel.søkerIGyldigTidsrom]: søkerIGyldigTidsrom(payload),
    [SelvstendigNæringdsrivendeRegel.utebetalingFraNAVDekkerIkkeHeleInntektstapet]: utbetalingFraNAVDekkerIkkeHeleTapet(
        payload
    ),
    [SelvstendigNæringdsrivendeRegel.harHattHistoriskInntekt]: harHattHistoriskInntekt(payload),
});
