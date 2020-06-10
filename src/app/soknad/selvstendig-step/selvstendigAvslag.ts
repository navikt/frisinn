import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
import { hasValue } from '../../validation/fieldValidations';
import { SelvstendigFormData } from '../../types/SoknadFormData';
import { getAntallUttaksdagerITidsperiode } from '../../utils/uttaksdagerUtils';

export enum SelvstendigNæringdsrivendeAvslagÅrsak {
    'oppgirHarIkkeHattInntektFraForetak' = 'oppgirHarIkkeHattInntektFraForetak',
    'harIkkeHattInntektstapPgaKorona' = 'harIkkeHattInntektstapPgaKorona',
    'søkerIkkeForGyldigTidsrom' = 'søkerIkkeForGyldigTidsrom',
    'harYtelseFraNavSomDekkerTapet' = 'harYtelseFraNavSomDekkerTapet',
    'oppgirNullHistoriskInntekt' = 'oppgirNullHistoriskInntekt',
    'ikkeAlleAvsluttaSelskaperErRegistrert' = 'ikkeAlleAvsluttaSelskaperErRegistrert',
    'ingenUttaksdager' = 'ingenUttaksdager',
}

export interface SelvstendigNæringsdrivendeAvslagStatus {
    [SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.harYtelseFraNavSomDekkerTapet]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.oppgirNullHistoriskInntekt]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.ikkeAlleAvsluttaSelskaperErRegistrert]: boolean;
    [SelvstendigNæringdsrivendeAvslagÅrsak.ingenUttaksdager]: boolean;
}

const harIkkeHattInntektstapPgaKorona = ({ selvstendigHarTaptInntektPgaKorona }: SelvstendigFormData) =>
    selvstendigHarTaptInntektPgaKorona === YesOrNo.NO;

const oppgirNullHistoriskInntekt = ({
    selvstendigInntekt2019,
    selvstendigInntekt2020,
    selvstendigBeregnetInntektsårstall,
}: SelvstendigFormData): boolean => {
    return (
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

const valgtIkkeAlleSelskaperErRegistrert = ({ selvstendigAlleAvsluttaSelskaperErRegistrert }: SelvstendigFormData) => {
    return selvstendigAlleAvsluttaSelskaperErRegistrert === YesOrNo.NO;
};

const ingenUttaksdagerIPeriode = ({ selvstendigBeregnetTilgjengeligSøknadsperiode }: SelvstendigFormData) => {
    if (selvstendigBeregnetTilgjengeligSøknadsperiode === undefined) {
        return false;
    }
    const antallUttaksdagerIPeriode = getAntallUttaksdagerITidsperiode({
        from: selvstendigBeregnetTilgjengeligSøknadsperiode.from,
        to: selvstendigBeregnetTilgjengeligSøknadsperiode.to,
    });
    return antallUttaksdagerIPeriode === 0;
};

export const kontrollerSelvstendigSvar = (payload: SelvstendigFormData): SelvstendigNæringsdrivendeAvslagStatus => ({
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    ingenUttaksdager: ingenUttaksdagerIPeriode(payload),
    harYtelseFraNavSomDekkerTapet: utbetalingFraNAVDekkerHeleTapet(payload),
    oppgirNullHistoriskInntekt: oppgirNullHistoriskInntekt(payload),
    ikkeAlleAvsluttaSelskaperErRegistrert: valgtIkkeAlleSelskaperErRegistrert(payload),
});

export const kontrollerSelvstendigAndregangsSvar = (
    payload: SelvstendigFormData
): Partial<SelvstendigNæringsdrivendeAvslagStatus> => ({
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    ingenUttaksdager: ingenUttaksdagerIPeriode(payload),
    harYtelseFraNavSomDekkerTapet: utbetalingFraNAVDekkerHeleTapet(payload),
});

export const getAvslagÅrsak = (
    status: Partial<SelvstendigNæringsdrivendeAvslagStatus>
): SelvstendigNæringdsrivendeAvslagÅrsak | undefined => {
    const feil = Object.keys(status).filter((key) => status[key] === true);
    return feil ? (feil[0] as SelvstendigNæringdsrivendeAvslagÅrsak) : undefined;
};
