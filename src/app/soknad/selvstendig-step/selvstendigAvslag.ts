import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
import { hasValue } from '../../validation/fieldValidations';
import { SelvstendigFormData } from '../../types/SoknadFormData';

export enum SelvstendigNæringdsrivendeAvslagÅrsak {
    'erIkkeSelvstendigNæringsdrivende' = 'erIkkeSelvstendigNæringsdrivende',
    'harIkkeHattInntektstapPgaKorona' = 'harIkkeHattInntektstapPgaKorona',
    'søkerIkkeForGyldigTidsrom' = 'søkerIkkeForGyldigTidsrom',
    'harYtelseFraNavSomDekkerTapet' = 'harYtelseFraNavSomDekkerTapet',
    'harIkkeHattHistoriskInntekt' = 'harIkkeHattHistoriskInntekt',
}

export interface SelvstendigNæringsdrivendeAvslagStatus {
    [SelvstendigNæringdsrivendeAvslagÅrsak.erIkkeSelvstendigNæringsdrivende]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.harYtelseFraNavSomDekkerTapet]: boolean;
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
}: KontrollerSelvstendigSvarPayload) => {
    const gyldig =
        hasValue(selvstendigInntektstapStartetDato) && selvstendigBeregnetTilgjengeligSøknadsperiode !== undefined;
    return !gyldig;
};

const utbetalingFraNAVDekkerHeleTapet = ({
    selvstendigHarYtelseFraNavSomDekkerTapet,
}: KontrollerSelvstendigSvarPayload) => {
    return selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES;
};

export const kontrollerSelvstendigSvar = (
    payload: KontrollerSelvstendigSvarPayload
): SelvstendigNæringsdrivendeAvslagStatus => ({
    erIkkeSelvstendigNæringsdrivende: erIkkeSelvstendigNæringsdrivende(payload),
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    harYtelseFraNavSomDekkerTapet: utbetalingFraNAVDekkerHeleTapet(payload),
    harIkkeHattHistoriskInntekt: harIkkeHattHistoriskInntekt(payload),
});
