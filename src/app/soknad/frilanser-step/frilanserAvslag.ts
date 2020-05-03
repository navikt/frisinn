import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FrilanserFormData } from '../../types/SoknadFormData';

export enum FrilanserAvslagÅrsak {
    'harIkkeHattInntektstapPgaKorona' = 'harIkkeHattInntektstapPgaKorona',
    'søkerIkkeForGyldigTidsrom' = 'søkerIkkeForGyldigTidsrom',
    'utebetalingFraNAVDekkerHeleInntektstapet' = 'utebetalingFraNAVDekkerHeleInntektstapet',
}

export interface FrilanserAvslagStatus {
    [FrilanserAvslagÅrsak.harIkkeHattInntektstapPgaKorona]: boolean;
    [FrilanserAvslagÅrsak.søkerIkkeForGyldigTidsrom]: boolean;
    [FrilanserAvslagÅrsak.utebetalingFraNAVDekkerHeleInntektstapet]: boolean;
}

const harIkkeHattInntektstapPgaKorona = ({ frilanserHarTaptInntektPgaKorona }: FrilanserFormData) =>
    frilanserHarTaptInntektPgaKorona === YesOrNo.NO;

const søkerIkkeForGyldigTidsrom = ({ frilanserBeregnetTilgjengeligSønadsperiode }: FrilanserFormData) => {
    return frilanserBeregnetTilgjengeligSønadsperiode === undefined;
};

const utbetalingFraNAVDekkerHeleTapet = ({ frilanserHarYtelseFraNavSomDekkerTapet }: FrilanserFormData) => {
    return frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES;
};

export const kontrollerFrilanserSvar = (payload: FrilanserFormData) => ({
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    utebetalingFraNAVDekkerHeleInntektstapet: utbetalingFraNAVDekkerHeleTapet(payload),
});
