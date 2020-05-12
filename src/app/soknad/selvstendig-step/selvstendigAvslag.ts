import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
import { hasValue } from '../../validation/fieldValidations';
import { SelvstendigFormData } from '../../types/SoknadFormData';

export enum SelvstendigNæringdsrivendeAvslagÅrsak {
    'oppgirHarIkkeHattInntektFraForetak' = 'oppgirHarIkkeHattInntektFraForetak',
    'harIkkeHattInntektstapPgaKorona' = 'harIkkeHattInntektstapPgaKorona',
    'søkerIkkeForGyldigTidsrom' = 'søkerIkkeForGyldigTidsrom',
    'harYtelseFraNavSomDekkerTapet' = 'harYtelseFraNavSomDekkerTapet',
    'oppgirNullHistoriskInntekt' = 'oppgirNullHistoriskInntekt',
}

export interface SelvstendigNæringsdrivendeAvslagStatus {
    [SelvstendigNæringdsrivendeAvslagÅrsak.oppgirHarIkkeHattInntektFraForetak]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.harYtelseFraNavSomDekkerTapet]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.oppgirNullHistoriskInntekt]: boolean;
}

const oppgirHarIkkeHattInntektFraForetak = ({ selvstendigHarHattInntektFraForetak }: SelvstendigFormData) =>
    selvstendigHarHattInntektFraForetak === YesOrNo.NO;

const harIkkeHattInntektstapPgaKorona = ({ selvstendigHarTaptInntektPgaKorona }: SelvstendigFormData) =>
    selvstendigHarTaptInntektPgaKorona === YesOrNo.NO;

const oppgirNullHistoriskInntekt = ({
    selvstendigHarHattInntektFraForetak,
    selvstendigInntekt2019,
    selvstendigInntekt2020,
    selvstendigBeregnetInntektsårstall,
}: SelvstendigFormData): boolean => {
    return (
        selvstendigHarHattInntektFraForetak === YesOrNo.NO ||
        hasValidHistoriskInntekt({
            selvstendigInntekt2019,
            selvstendigInntekt2020,
            selvstendigBeregnetInntektsårstall,
        }) === false
    );
};

const søkerIkkeForGyldigTidsrom = ({
    selvstendigBeregnetTilgjengeligSøknadsperiode,
    selvstendigInntektstapStartetDato,
}: SelvstendigFormData) => {
    const gyldig =
        hasValue(selvstendigInntektstapStartetDato) && selvstendigBeregnetTilgjengeligSøknadsperiode !== undefined;
    return !gyldig;
};

const utbetalingFraNAVDekkerHeleTapet = ({ selvstendigHarYtelseFraNavSomDekkerTapet }: SelvstendigFormData) => {
    return selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES;
};

export const kontrollerSelvstendigSvar = (payload: SelvstendigFormData): SelvstendigNæringsdrivendeAvslagStatus => ({
    oppgirHarIkkeHattInntektFraForetak: oppgirHarIkkeHattInntektFraForetak(payload),
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    harYtelseFraNavSomDekkerTapet: utbetalingFraNAVDekkerHeleTapet(payload),
    oppgirNullHistoriskInntekt: oppgirNullHistoriskInntekt(payload),
});
