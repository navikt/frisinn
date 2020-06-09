import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
import { hasValue } from '../../validation/fieldValidations';
import { SelvstendigFormData } from '../../types/SoknadFormData';
import { DateRange } from '../../utils/dateUtils';
import { getAntallUttaksdagerITidsperiode } from '../../utils/uttaksdagerUtils';

export type SelvstendigAvslagPayload = SelvstendigFormData & { søknadsperiode: DateRange };

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

const harIkkeHattInntektstapPgaKorona = ({ selvstendigHarTaptInntektPgaKorona }: SelvstendigAvslagPayload) =>
    selvstendigHarTaptInntektPgaKorona === YesOrNo.NO;

const oppgirNullHistoriskInntekt = ({
    selvstendigInntekt2019,
    selvstendigInntekt2020,
    selvstendigBeregnetInntektsårstall,
}: SelvstendigAvslagPayload): boolean => {
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
}: SelvstendigAvslagPayload) => {
    const gyldig =
        hasValue(selvstendigInntektstapStartetDato) && selvstendigBeregnetTilgjengeligSøknadsperiode !== undefined;
    return !gyldig;
};

const utbetalingFraNAVDekkerHeleTapet = ({ selvstendigHarYtelseFraNavSomDekkerTapet }: SelvstendigAvslagPayload) => {
    return selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES;
};

const valgtIkkeAlleSelskaperErRegistrert = ({
    selvstendigAlleAvsluttaSelskaperErRegistrert,
}: SelvstendigAvslagPayload) => {
    return selvstendigAlleAvsluttaSelskaperErRegistrert === YesOrNo.NO;
};

const ingenUttaksdagerIPeriode = ({ selvstendigInntektstapStartetDato, søknadsperiode }: SelvstendigAvslagPayload) => {
    if (selvstendigInntektstapStartetDato === undefined) {
        return false;
    }
    const antallUttaksdagerIPeriode = getAntallUttaksdagerITidsperiode({
        from: selvstendigInntektstapStartetDato,
        to: søknadsperiode.to,
    });
    return antallUttaksdagerIPeriode === 0;
};

export const kontrollerSelvstendigSvar = (
    payload: SelvstendigAvslagPayload
): SelvstendigNæringsdrivendeAvslagStatus => ({
    harIkkeHattInntektstapPgaKorona: harIkkeHattInntektstapPgaKorona(payload),
    søkerIkkeForGyldigTidsrom: søkerIkkeForGyldigTidsrom(payload),
    ingenUttaksdager: ingenUttaksdagerIPeriode(payload),
    harYtelseFraNavSomDekkerTapet: utbetalingFraNAVDekkerHeleTapet(payload),
    oppgirNullHistoriskInntekt: oppgirNullHistoriskInntekt(payload),
    ikkeAlleAvsluttaSelskaperErRegistrert: valgtIkkeAlleSelskaperErRegistrert(payload),
});

export const kontrollerSelvstendigAndregangsSvar = (
    payload: SelvstendigAvslagPayload
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
