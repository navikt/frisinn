import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { PersonligeForetakMock as pfm } from '../../../../__mock__/personligeForetakMock';
import { Person, SoknadEssentials } from '../../../../types/SoknadEssentials';
import { SelvstendigFormData, SoknadFormField } from '../../../../types/SoknadFormData';
import { apiStringDateToDate, DateRange } from '../../../../utils/dateUtils';
import { getSøknadsperiodeinfo } from '../../../../utils/søknadsperiodeUtils';
import { getPeriodeForAvsluttaSelskaper } from '../../avsluttet-selskap/avsluttetSelskapUtils';
import { SelvstendigNæringdsrivendeAvslagÅrsak, SelvstendigNæringsdrivendeAvslagStatus } from '../../selvstendigAvslag';
import { SelvstendigAndregangFormConfigPayload, SelvstendigFormQuestions } from '../selvstendigAndregangFormConfig';

const person: Person = {
    fornavn: 'a',
    etternavn: 'b',
    fødselsnummer: '12345678901',
    kjønn: 'M',
    kontonummer: '123',
};

const personligeForetak = pfm.personligeFortak2019;

const søknadsperiode: DateRange = {
    from: apiStringDateToDate('2020-04-01'),
    to: apiStringDateToDate('2020-04-30'),
};

const soknadEssentials: SoknadEssentials = {
    person,
    personligeForetak,
    søknadsperiode: søknadsperiode,
    tidligerePerioder: {
        harSøktSomFrilanser: false,
        harSøktSomSelvstendigNæringsdrivende: false,
    },
    isSelvstendigNæringsdrivende: true,
    avsluttetSelskapDateRange: getPeriodeForAvsluttaSelskaper(personligeForetak.tidligsteRegistreringsdato),
    søknadsperiodeinfo: getSøknadsperiodeinfo(søknadsperiode),
};

const initialFormData: SelvstendigFormData = {
    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
    selvstendigBeregnetTilgjengeligSøknadsperiode: undefined,
    selvstendigBeregnetInntektsårstall: undefined,
    selvstendigHarAvsluttetSelskaper: YesOrNo.UNANSWERED,
    selvstendigAvsluttaSelskaper: [],
    selvstendigHarTaptInntektPgaKorona: YesOrNo.UNANSWERED,
    selvstendigHarMottattUtbetalingTidligere: YesOrNo.UNANSWERED,
    selvstendigInntektstapStartetDato: undefined as any,
    selvstendigInntektIPerioden: undefined as any,
    selvstendigInntekt2019: undefined,
    selvstendigInntekt2020: undefined,
    selvstendigErFrilanser: YesOrNo.NO,
    selvstendigHarRevisor: YesOrNo.UNANSWERED,
    selvstendigHarRegnskapsfører: YesOrNo.UNANSWERED,
    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.UNANSWERED,
    selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.UNANSWERED,
};

const avslag: SelvstendigNæringsdrivendeAvslagStatus = {
    [SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona]: false,
    [SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom]: false,
    [SelvstendigNæringdsrivendeAvslagÅrsak.harYtelseFraNavSomDekkerTapet]: false,
    [SelvstendigNæringdsrivendeAvslagÅrsak.oppgirNullHistoriskInntekt]: false,
    [SelvstendigNæringdsrivendeAvslagÅrsak.ikkeAlleAvsluttaSelskaperErRegistrert]: false,
    [SelvstendigNæringdsrivendeAvslagÅrsak.ingenUttaksdager]: false,
};

describe('selvstendigFormConfig', () => {
    const payload: SelvstendigAndregangFormConfigPayload = {
        ...initialFormData,
        ...soknadEssentials,
        avslag,
    };
    describe('included questions', () => {
        describe('initial state', () => {
            const { isIncluded } = SelvstendigFormQuestions.getVisbility(payload);
            it(`includes all required and fixed questions`, () => {
                expect(isIncluded(SoknadFormField.selvstendigHarTaptInntektPgaKorona)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigHarMottattUtbetalingTidligere)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigInntektIPerioden)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet)).toBeTruthy();
            });
            it(`does not include questions which depends on different payload states`, () => {
                expect(isIncluded(SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigInntektSomFrilanserIPerioden)).toBeFalsy();
            });
        });
        describe(`includes inputs depending on ${SoknadFormField.selvstendigHarMottattUtbetalingTidligere}`, () => {
            const F = SoknadFormField.selvstendigHarMottattUtbetalingTidligere;
            it(`does not include ${SoknadFormField.selvstendigInntektstapStartetDato} when ${F} is UNANSWERED`, () => {
                const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    selvstendigHarMottattUtbetalingTidligere: YesOrNo.UNANSWERED,
                });
                expect(isIncluded(SoknadFormField.selvstendigInntektstapStartetDato)).toBeFalsy();
            });
            it(`does not include ${SoknadFormField.selvstendigInntektstapStartetDato} when ${F} is YES`, () => {
                const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    selvstendigHarMottattUtbetalingTidligere: YesOrNo.YES,
                });
                expect(isIncluded(SoknadFormField.selvstendigInntektstapStartetDato)).toBeFalsy();
            });
            it(`does include ${SoknadFormField.selvstendigInntektstapStartetDato} when ${F} is NO`, () => {
                const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    selvstendigHarMottattUtbetalingTidligere: YesOrNo.NO,
                });
                expect(isIncluded(SoknadFormField.selvstendigInntektstapStartetDato)).toBeTruthy();
            });
        });
        describe(`includes inputs for frilanserinntekt when ${SoknadFormField.søkerOmTaptInntektSomFrilanser} is NO`, () => {
            const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                ...payload,
                søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
            });
            it(`includes ${SoknadFormField.selvstendigErFrilanser}`, () => {
                expect(isIncluded(SoknadFormField.selvstendigErFrilanser)).toBeTruthy();
            });
            it(`does include frilanser detail questions ${SoknadFormField.selvstendigErFrilanser} is NO`, () => {
                const whenNo = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
                    selvstendigErFrilanser: YesOrNo.NO,
                });
                expect(whenNo.isIncluded(SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden)).toBeFalsy();
                expect(whenNo.isIncluded(SoknadFormField.selvstendigInntektSomFrilanserIPerioden)).toBeFalsy();
            });
            describe(`when ${SoknadFormField.selvstendigErFrilanser} is YES and ${SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden} is NO `, () => {
                const whenYes = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
                    selvstendigErFrilanser: YesOrNo.YES,
                    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.NO,
                });
                it(`does not include ${SoknadFormField.selvstendigInntektSomFrilanserIPerioden}`, () => {
                    expect(whenYes.isIncluded(SoknadFormField.selvstendigInntektSomFrilanserIPerioden)).toBeFalsy();
                });
            });
            describe(`when ${SoknadFormField.selvstendigErFrilanser} is YES and ${SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden} is NO `, () => {
                const whenYes = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
                    selvstendigErFrilanser: YesOrNo.YES,
                    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.NO,
                });
                it(`does not include ${SoknadFormField.selvstendigInntektSomFrilanserIPerioden}`, () => {
                    expect(whenYes.isIncluded(SoknadFormField.selvstendigInntektSomFrilanserIPerioden)).toBeFalsy();
                });
            });
            describe(`${SoknadFormField.selvstendigErFrilanser} is YES and ${SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden} is YES `, () => {
                const whenYes = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
                    selvstendigErFrilanser: YesOrNo.YES,
                    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.YES,
                });
                expect(whenYes.isIncluded(SoknadFormField.selvstendigInntektSomFrilanserIPerioden)).toBeTruthy();
            });
        });
        describe('when avslag', () => {
            it(`does not include default following questions when ${SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona} === true`, () => {
                const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    avslag: { ...payload.avslag, harIkkeHattInntektstapPgaKorona: true },
                });
                expect(isIncluded(SoknadFormField.selvstendigHarTaptInntektPgaKorona)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigInntektstapStartetDato)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigInntektIPerioden)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet)).toBeFalsy();
            });
            it(`does not include default following questions when ${SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom} === true`, () => {
                const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    selvstendigHarMottattUtbetalingTidligere: YesOrNo.NO,
                    avslag: { ...payload.avslag, søkerIkkeForGyldigTidsrom: true },
                });
                expect(isIncluded(SoknadFormField.selvstendigHarTaptInntektPgaKorona)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigInntektstapStartetDato)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigInntektIPerioden)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet)).toBeFalsy();
            });
            it(`does not include default following questions when ${SelvstendigNæringdsrivendeAvslagÅrsak.ingenUttaksdager} === true`, () => {
                const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    selvstendigHarMottattUtbetalingTidligere: YesOrNo.NO,
                    avslag: { ...payload.avslag, ingenUttaksdager: true },
                });
                expect(isIncluded(SoknadFormField.selvstendigHarTaptInntektPgaKorona)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigInntektstapStartetDato)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigInntektIPerioden)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet)).toBeFalsy();
            });
        });
    });
});
