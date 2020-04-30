import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FrilanserFormPayload } from './frilanserFormConfig';

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

const harIkkeHattInntektstapPgaKorona = ({ frilanserHarTaptInntektPgaKorona }: FrilanserFormPayload) =>
    frilanserHarTaptInntektPgaKorona === YesOrNo.NO;

const søkerIkkeForGyldigTidsrom = ({ frilanserBeregnetTilgjengeligSønadsperiode }: FrilanserFormPayload) => {
    return frilanserBeregnetTilgjengeligSønadsperiode === undefined;
};

const utbetalingFraNAVDekkerHeleTapet = ({
    frilanserHarYtelseFraNavSomDekkerTapet,
    frilanserYtelseFraNavDekkerHeleTapet,
}: FrilanserFormPayload) => {
    return (
        frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.YES && frilanserYtelseFraNavDekkerHeleTapet === YesOrNo.YES
    );
};

export const kontrollerFrilanserSvar = (payload: FrilanserFormPayload) => ({
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    utebetalingFraNAVDekkerHeleInntektstapet: utbetalingFraNAVDekkerHeleTapet(payload),
});
