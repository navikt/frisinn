import { YesOrNo } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { DateRange } from '../../utils/dateUtils';

export type GetInntektsperiodeForArbeidsinntektPayload = Pick<
    SoknadFormData,
    | SoknadFormField.selvstendigSoknadIsOk
    | SoknadFormField.frilanserSoknadIsOk
    | SoknadFormField.selvstendigBeregnetTilgjengeligSøknadsperiode
    | SoknadFormField.frilanserBeregnetTilgjengeligSøknadsperiode
>;

export const getInntektsperiodeForArbeidsinntekt = (
    values: GetInntektsperiodeForArbeidsinntektPayload
): DateRange | undefined => {
    const {
        selvstendigSoknadIsOk,
        frilanserSoknadIsOk,
        selvstendigBeregnetTilgjengeligSøknadsperiode,
        frilanserBeregnetTilgjengeligSøknadsperiode,
    } = values;

    const includeSelvstendig: boolean =
        selvstendigSoknadIsOk === true && selvstendigBeregnetTilgjengeligSøknadsperiode !== undefined;
    const includeFrilans: boolean =
        frilanserSoknadIsOk === true && frilanserBeregnetTilgjengeligSøknadsperiode !== undefined;

    if (includeSelvstendig === false && includeFrilans === false) {
        return undefined;
    }

    if (
        includeFrilans &&
        includeSelvstendig &&
        selvstendigBeregnetTilgjengeligSøknadsperiode &&
        frilanserBeregnetTilgjengeligSøknadsperiode
    ) {
        return {
            from: moment
                .min(
                    moment(selvstendigBeregnetTilgjengeligSøknadsperiode.from),
                    moment(frilanserBeregnetTilgjengeligSøknadsperiode.from)
                )
                .toDate(),
            to: moment
                .max(
                    moment(selvstendigBeregnetTilgjengeligSøknadsperiode.to),
                    moment(frilanserBeregnetTilgjengeligSøknadsperiode.to)
                )
                .toDate(),
        };
    } else if (includeSelvstendig && selvstendigBeregnetTilgjengeligSøknadsperiode) {
        return selvstendigBeregnetTilgjengeligSøknadsperiode;
    } else if (includeFrilans && frilanserBeregnetTilgjengeligSøknadsperiode) {
        return frilanserBeregnetTilgjengeligSøknadsperiode;
    }
    return undefined;
};

export const cleanupArbeidstakerStep = (values: SoknadFormData) => {
    const v = { ...values };
    const { arbeidstakerHarHattInntektIPerioden, arbeidstakerErArbeidstaker } = values;
    if (arbeidstakerErArbeidstaker === YesOrNo.NO) {
        v.arbeidstakerHarHattInntektIPerioden = undefined;
    }
    if (arbeidstakerHarHattInntektIPerioden === YesOrNo.NO) {
        v.arbeidstakerInntektIPerioden = undefined;
    }
    return v;
};
