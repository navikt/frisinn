import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
import { hasValue } from '../../validation/fieldValidations';
import { SelvstendigFormData } from '../../types/SoknadFormData';

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

export type KontrollerSelvstendigSvarPayload = SelvstendigFormData & { inntektÅrstall: number };

const erIkkeSelvstendigNæringsdrivende = ({ selvstendigHarHattInntektFraForetak }: KontrollerSelvstendigSvarPayload) =>
    selvstendigHarHattInntektFraForetak === YesOrNo.NO;

const harIkkeHattInntektstapPgaKorona = ({ selvstendigHarTaptInntektPgaKorona }: KontrollerSelvstendigSvarPayload) =>
    selvstendigHarTaptInntektPgaKorona === YesOrNo.NO;

const harIkkeHattHistoriskInntekt = ({
    selvstendigHarHattInntektFraForetak,
    selvstendigInntekt2019,
    selvstendigInntekt2020,
    inntektÅrstall,
}: KontrollerSelvstendigSvarPayload): boolean => {
    return (
        selvstendigHarHattInntektFraForetak === YesOrNo.NO ||
        hasValidHistoriskInntekt({ selvstendigInntekt2019, selvstendigInntekt2020 }, inntektÅrstall) === false
    );
};

const søkerIkkeForGyldigTidsrom = ({
    selvstendigBeregnetTilgjengeligSøknadsperiode,
    selvstendigInntektstapStartetDato,
}: KontrollerSelvstendigSvarPayload) =>
    hasValue(selvstendigInntektstapStartetDato) && selvstendigBeregnetTilgjengeligSøknadsperiode === undefined;

const utbetalingFraNAVDekkerHeleTapet = ({
    selvstendigHarYtelseFraNavSomDekkerTapet,
    selvstendigYtelseFraNavDekkerHeleTapet,
}: KontrollerSelvstendigSvarPayload) => {
    return (
        selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES &&
        selvstendigYtelseFraNavDekkerHeleTapet === YesOrNo.YES
    );
};

export const kontrollerSelvstendigSvar = (
    payload: KontrollerSelvstendigSvarPayload
): SelvstendigNæringsdrivendeAvslagStatus => ({
    erIkkeSelvstendigNæringsdrivende: erIkkeSelvstendigNæringsdrivende(payload),
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    utebetalingFraNAVDekkerHeleInntektstapet: utbetalingFraNAVDekkerHeleTapet(payload),
    harIkkeHattHistoriskInntekt: harIkkeHattHistoriskInntekt(payload),
});
