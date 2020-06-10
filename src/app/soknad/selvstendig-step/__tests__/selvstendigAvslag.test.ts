import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate, DateRange } from '../../../utils/dateUtils';
import { kontrollerSelvstendigSvar, SelvstendigNæringsdrivendeAvslagStatus } from '../selvstendigAvslag';
import { SelvstendigFormData } from '../../../types/SoknadFormData';

const periode: DateRange = {
    from: apiStringDateToDate('2020-04-01'),
    to: apiStringDateToDate('2020-04-30'),
};

describe('selvstendigAvslag', () => {
    const payload: SelvstendigFormData = {
        selvstendigBeregnetInntektsårstall: 2019,
        søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
        selvstendigHarAvsluttetSelskaper: YesOrNo.NO,
        selvstendigAvsluttaSelskaper: [],
        selvstendigBeregnetTilgjengeligSøknadsperiode: periode,
        selvstendigHarTaptInntektPgaKorona: YesOrNo.YES,
        selvstendigInntektstapStartetDato: apiStringDateToDate('2020-04-01'),
        selvstendigInntektIPerioden: 0,
        selvstendigInntekt2019: 2000,
        selvstendigErFrilanser: YesOrNo.NO,
        selvstendigHarRevisor: YesOrNo.NO,
        selvstendigHarRegnskapsfører: YesOrNo.NO,
        selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.NO,
        selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.NO,
        selvstendigInntekt2020: undefined,
        søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
    };
    describe('selvstendigHarTaptInntektPgaKorona', () => {
        it('returns error when selvstendigHarTaptInntektPgaKorona === NO', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigHarTaptInntektPgaKorona: YesOrNo.NO,
            });
            expect(status.harIkkeHattInntektstapPgaKorona).toBeTruthy();
        });
        it('returns no error when selvstendigHarTaptInntektPgaKorona === YES', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigHarTaptInntektPgaKorona: YesOrNo.YES,
            });
            expect(status.harIkkeHattInntektstapPgaKorona).toBeFalsy();
        });
    });
    describe('oppgirNullHistoriskInntekt - 2019', () => {
        it('returns error if 2019 inntekt is undefined', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigBeregnetInntektsårstall: 2019,
                selvstendigInntekt2019: undefined,
            });
            expect(status.oppgirNullHistoriskInntekt).toBeTruthy();
        });
        it('returns error if 2019 inntekt is 0', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigBeregnetInntektsårstall: 2019,
                selvstendigInntekt2019: 0,
            });
            expect(status.oppgirNullHistoriskInntekt).toBeTruthy();
        });
        it('returns no error if 2019 inntekt is undefined', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigBeregnetInntektsårstall: 2019,
                selvstendigInntekt2019: 1,
            });
            expect(status.oppgirNullHistoriskInntekt).toBeFalsy();
        });
    });
    describe('oppgirNullHistoriskInntekt - 2020', () => {
        it('returns error if 2020 inntekt is undefined', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigBeregnetInntektsårstall: 2020,
                selvstendigInntekt2020: undefined,
            });
            expect(status.oppgirNullHistoriskInntekt).toBeTruthy();
        });
        it('returns no error if 2020 inntekt is undefined', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigBeregnetInntektsårstall: 2020,
                selvstendigInntekt2020: 1,
            });
            expect(status.oppgirNullHistoriskInntekt).toBeFalsy();
        });
        it('returns error if 2020 inntekt is 0', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigBeregnetInntektsårstall: 2020,
                selvstendigInntekt2020: 0,
            });
            expect(status.oppgirNullHistoriskInntekt).toBeTruthy();
        });
    });

    describe('søkerIkkeForGyldigTidsrom', () => {
        it('returns error when tilgjengelig søknadsperiode is undefined', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigInntektstapStartetDato: new Date(),
                selvstendigBeregnetTilgjengeligSøknadsperiode: undefined,
            });
            expect(status.søkerIkkeForGyldigTidsrom).toBeTruthy();
        });
        it('returns error when selvstendigInntektstapStartetDato is not set', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigInntektstapStartetDato: undefined as any,
                selvstendigBeregnetTilgjengeligSøknadsperiode: undefined,
            });
            expect(status.søkerIkkeForGyldigTidsrom).toBeTruthy();
        });
        it('returns error when selvstendigInntektstapStartetDato is not set, but selvstendigBeregnetTilgjengeligSøknadsperiode is set ', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigInntektstapStartetDato: undefined as any,
                selvstendigBeregnetTilgjengeligSøknadsperiode: periode,
            });
            expect(status.søkerIkkeForGyldigTidsrom).toBeTruthy();
        });
        it('returns no error when selvstendigInntektstapStartetDato is  set and selvstendigBeregnetTilgjengeligSøknadsperiode is set ', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigInntektstapStartetDato: new Date(),
                selvstendigBeregnetTilgjengeligSøknadsperiode: periode,
            });
            expect(status.søkerIkkeForGyldigTidsrom).toBeFalsy();
        });
    });

    describe('utbetalingFraNAVDekkerHeleTapet', () => {
        it('returns error when utbetalingFraNAVDekkerHeleTapet === yes', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.YES,
            });
            expect(status.harYtelseFraNavSomDekkerTapet).toBeTruthy();
        });
        it('returns no error when utbetalingFraNAVDekkerHeleTapet === no', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.NO,
            });
            expect(status.harYtelseFraNavSomDekkerTapet).toBeFalsy();
        });
    });
    describe('ingenUttaksdager', () => {
        it('returns error when ingenUttaksdager i tilgjegeligSøkeperiode', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigBeregnetTilgjengeligSøknadsperiode: {
                    from: apiStringDateToDate('2020-05-30'),
                    to: apiStringDateToDate('2020-05-31'),
                },
            });
            expect(status.ingenUttaksdager).toBeTruthy();
        });
        it('returns no error when there are uttaksdager i tilgjegeligSøkeperiode', () => {
            const status: SelvstendigNæringsdrivendeAvslagStatus = kontrollerSelvstendigSvar({
                ...payload,
                selvstendigBeregnetTilgjengeligSøknadsperiode: {
                    from: apiStringDateToDate('2020-05-29'),
                    to: apiStringDateToDate('2020-05-31'),
                },
            });
            expect(status.ingenUttaksdager).toBeFalsy();
        });
    });
});
