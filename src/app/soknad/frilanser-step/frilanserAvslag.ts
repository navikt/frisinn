import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FrilanserFormData } from '../../types/SoknadFormData';
import { getAntallUttaksdagerITidsperiode } from '../../utils/uttaksdagerUtils';

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

const ingenUttaksdagerIPeriode = ({ frilanserBeregnetTilgjengeligSøknadsperiode }: FrilanserFormData) => {
    if (frilanserBeregnetTilgjengeligSøknadsperiode === undefined) {
        return false;
    }
    const antallUttaksdagerIPeriode = getAntallUttaksdagerITidsperiode({
        from: frilanserBeregnetTilgjengeligSøknadsperiode.from,
        to: frilanserBeregnetTilgjengeligSøknadsperiode.to,
    });
    return antallUttaksdagerIPeriode === 0;
};

export const kontrollerFrilanserSvar = (payload: FrilanserFormData) => ({
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    utebetalingFraNAVDekkerHeleInntektstapet: utbetalingFraNAVDekkerHeleTapet(payload),
    ingenUttaksdager: ingenUttaksdagerIPeriode(payload),
});
