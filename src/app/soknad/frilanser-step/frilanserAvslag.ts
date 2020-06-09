import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FrilanserFormData } from '../../types/SoknadFormData';
import { DateRange } from '../../utils/dateUtils';
import { getAntallUttaksdagerITidsperiode } from '../../utils/uttaksdagerUtils';

export type FrilanserAvslagPayload = FrilanserFormData & { søknadsperiode: DateRange };

export enum FrilanserAvslagÅrsak {
    'harIkkeHattInntektstapPgaKorona' = 'harIkkeHattInntektstapPgaKorona',
    'søkerIkkeForGyldigTidsrom' = 'søkerIkkeForGyldigTidsrom',
    'utebetalingFraNAVDekkerHeleInntektstapet' = 'utebetalingFraNAVDekkerHeleInntektstapet',
    'ingenUttaksdager' = 'ingenUttaksdager',
}

export interface FrilanserAvslagStatus {
    [FrilanserAvslagÅrsak.harIkkeHattInntektstapPgaKorona]: boolean;
    [FrilanserAvslagÅrsak.søkerIkkeForGyldigTidsrom]: boolean;
    [FrilanserAvslagÅrsak.utebetalingFraNAVDekkerHeleInntektstapet]: boolean;
    [FrilanserAvslagÅrsak.ingenUttaksdager]: boolean;
}

const harIkkeHattInntektstapPgaKorona = ({ frilanserHarTaptInntektPgaKorona }: FrilanserFormData) =>
    frilanserHarTaptInntektPgaKorona === YesOrNo.NO;

const søkerIkkeForGyldigTidsrom = ({ frilanserBeregnetTilgjengeligSøknadsperiode }: FrilanserFormData) => {
    return frilanserBeregnetTilgjengeligSøknadsperiode === undefined;
};

const utbetalingFraNAVDekkerHeleTapet = ({ frilanserHarYtelseFraNavSomDekkerTapet }: FrilanserFormData) => {
    return frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES;
};

const ingenUttaksdagerIPeriode = ({ frilanserInntektstapStartetDato, søknadsperiode }: FrilanserAvslagPayload) => {
    if (frilanserInntektstapStartetDato === undefined) {
        return false;
    }
    const antallUttaksdagerIPeriode = getAntallUttaksdagerITidsperiode({
        from: frilanserInntektstapStartetDato,
        to: søknadsperiode.to,
    });
    return antallUttaksdagerIPeriode === 0;
};

export const kontrollerFrilanserSvar = (payload: FrilanserAvslagPayload) => ({
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    utebetalingFraNAVDekkerHeleInntektstapet: utbetalingFraNAVDekkerHeleTapet(payload),
    ingenUttaksdager: ingenUttaksdagerIPeriode(payload),
});
