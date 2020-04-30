import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import { hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
import { SelvstendigFormPayload } from './selvstendigFormConfig';

export enum SelvstendigNæringdsrivendeAvslagÅrsak {
    'erIkkeSelvstendigNæringsdrivende' = 'erIkkeSelvstendigNæringsdrivende',
    'harIkkeHattInntektstapPgaKorona' = 'harIkkeHattInntektstapPgaKorona',
    'søkerIkkeForGyldigTidsrom' = 'søkerIkkeForGyldigTidsrom',
    'utebetalingFraNAVDekkerHeleInntektstapet' = 'utebetalingFraNAVDekkerHeleInntektstapet',
    'harIkkeHattHistoriskInntekt' = 'harIkkeHattHistoriskInntekt',
}

export interface SelvstendigNæringsdrivendeAvslagStatus {
    [SelvstendigNæringdsrivendeAvslagÅrsak.erIkkeSelvstendigNæringsdrivende]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.utebetalingFraNAVDekkerHeleInntektstapet]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattHistoriskInntekt]: boolean;
}

const erIkkeSelvstendigNæringsdrivende = ({ selvstendigHarHattInntektFraForetak }: SelvstendigFormPayload) =>
    selvstendigHarHattInntektFraForetak === YesOrNo.NO;

const harIkkeHattInntektstapPgaKorona = ({ selvstendigHarTaptInntektPgaKorona }: SelvstendigFormPayload) =>
    selvstendigHarTaptInntektPgaKorona === YesOrNo.NO;

const harIKkeHattHistoriskInntekt = ({
    selvstendigHarHattInntektFraForetak,
    selvstendigInntekt2019,
    selvstendigInntekt2020,
    inntektÅrstall,
}: SelvstendigFormPayload): boolean => {
    return (
        selvstendigHarHattInntektFraForetak === YesOrNo.NO ||
        hasValidHistoriskInntekt({ selvstendigInntekt2019, selvstendigInntekt2020 }, inntektÅrstall) === false
    );
};

const søkerIkkeForGyldigTidsrom = ({ availableDateRange }: SelvstendigFormPayload) => {
    return isValidDateRange(availableDateRange) === false;
};

const utbetalingFraNAVDekkerHeleTapet = ({
    selvstendigHarYtelseFraNavSomDekkerTapet,
    selvstendigYtelseFraNavDekkerHeleTapet,
}: SelvstendigFormPayload) => {
    return (
        selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES &&
        selvstendigYtelseFraNavDekkerHeleTapet === YesOrNo.YES
    );
};

export const kontrollerSelvstendigAvslag = (payload: SelvstendigFormPayload) => ({
    erIkkeSelvstendigNæringsdrivende: erIkkeSelvstendigNæringsdrivende(payload),
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    utebetalingFraNAVDekkerHeleInntektstapet: utbetalingFraNAVDekkerHeleTapet(payload),
    harIkkeHattHistoriskInntekt: harIKkeHattHistoriskInntekt(payload),
});
