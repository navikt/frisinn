import { SelvstendigFormConfigPayload, SelvstendigFormQuestions } from '../selvstendigFormConfig';
import { SelvstendigFormData, SoknadFormField } from '../../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate } from '../../../utils/dateUtils';
import { SoknadEssentials, Person } from '../../../types/SoknadEssentials';
import { PersonligeForetakMock as pfm } from '../../../__mock__/personligeForetakMock';
import { SelvstendigNæringsdrivendeAvslagStatus, SelvstendigNæringdsrivendeAvslagÅrsak } from '../selvstendigAvslag';
import { getPeriodeForAvsluttaSelskaper } from '../avsluttet-selskap/avsluttetSelskapUtils';

const person: Person = {
    fornavn: 'a',
    etternavn: 'b',
    fødselsnummer: '12345678901',
    kjønn: 'M',
    kontonummer: '123',
};

const personligeForetak = pfm.personligeFortak2019;

const soknadEssentials: SoknadEssentials = {
    person,
    personligeForetak,
    currentSøknadsperiode: {
        from: apiStringDateToDate('2020-04-01'),
        to: apiStringDateToDate('2020-04-30'),
    },
    avsluttetSelskapDateRange: getPeriodeForAvsluttaSelskaper(personligeForetak.tidligsteRegistreringsdato),
};

const initialFormData: SelvstendigFormData = {
    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
    selvstendigBeregnetTilgjengeligSøknadsperiode: undefined,
    selvstendigBeregnetInntektsårstall: undefined,
    selvstendigHarAvsluttetSelskaper: YesOrNo.UNANSWERED,
    selvstendigAvsluttaSelskaper: [],
    selvstendigHarTaptInntektPgaKorona: YesOrNo.UNANSWERED,
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
};

describe('selvstendigFormConfig', () => {
    const payload: SelvstendigFormConfigPayload = {
        ...initialFormData,
        ...soknadEssentials,
        skalSpørreOmAvsluttaSelskaper: false,
        avslag,
    };
    describe('included questions', () => {
        describe('initial state', () => {
            const { isIncluded } = SelvstendigFormQuestions.getVisbility(payload);
            it(`includes all required and fixed questions`, () => {
                expect(isIncluded(SoknadFormField.selvstendigHarTaptInntektPgaKorona)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigInntektstapStartetDato)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigInntektIPerioden)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet)).toBeTruthy();
                expect(isIncluded(SoknadFormField.selvstendigHarRegnskapsfører)).toBeTruthy();
            });
            it(`does not include questions which depends on different payload states`, () => {
                expect(isIncluded(SoknadFormField.selvstendigInntekt2019)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigInntekt2020)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigInntektSomFrilanserIPerioden)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigHarAvsluttetSelskaper)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigAvsluttaSelskaper)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigAlleAvsluttaSelskaperErRegistrert)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigRegnskapsførerNavn)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigRegnskapsførerTelefon)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigHarRevisor)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigRevisorNavn)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigRevisorTelefon)).toBeFalsy();
                expect(isIncluded(SoknadFormField.selvstendigRevisorNAVKanTaKontakt)).toBeFalsy();
            });
        });
        it(`includes correct input for historisk inntekt when ${SoknadFormField.selvstendigBeregnetInntektsårstall} is 2019`, () => {
            const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                ...payload,
                selvstendigBeregnetInntektsårstall: 2019,
            });
            expect(isIncluded(SoknadFormField.selvstendigInntekt2019)).toBeTruthy();
            expect(isIncluded(SoknadFormField.selvstendigInntekt2020)).toBeFalsy();
        });
        it(`includes correct input for historisk inntekt when ${SoknadFormField.selvstendigBeregnetInntektsårstall} is 2020`, () => {
            const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                ...payload,
                selvstendigBeregnetInntektsårstall: 2020,
            });
            expect(isIncluded(SoknadFormField.selvstendigInntekt2019)).toBeFalsy();
            expect(isIncluded(SoknadFormField.selvstendigInntekt2020)).toBeTruthy();
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
        describe(`when ${SoknadFormField.selvstendigHarRegnskapsfører} is YES`, () => {
            const harRegnskapsfører = SelvstendigFormQuestions.getVisbility({
                ...payload,
                selvstendigHarRegnskapsfører: YesOrNo.YES,
            });
            it('includes detail questions', () => {
                expect(harRegnskapsfører.isIncluded(SoknadFormField.selvstendigRegnskapsførerNavn)).toBeTruthy();
                expect(harRegnskapsfører.isIncluded(SoknadFormField.selvstendigRegnskapsførerTelefon)).toBeTruthy();
                expect(harRegnskapsfører.isIncluded(SoknadFormField.selvstendigHarRevisor)).toBeFalsy();
            });
        });
        describe(`when ${SoknadFormField.selvstendigHarRevisor} is YES`, () => {
            const harRevisor = SelvstendigFormQuestions.getVisbility({
                ...payload,
                selvstendigHarRevisor: YesOrNo.YES,
            });
            it('includes detail questions', () => {
                expect(harRevisor.isIncluded(SoknadFormField.selvstendigRevisorNavn)).toBeTruthy();
                expect(harRevisor.isIncluded(SoknadFormField.selvstendigRevisorTelefon)).toBeTruthy();
                expect(harRevisor.isIncluded(SoknadFormField.selvstendigRevisorNAVKanTaKontakt)).toBeTruthy();
            });
        });
        describe(`when skalSpørreOmAvsluttaSelskaper is true`, () => {
            const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                ...payload,
                skalSpørreOmAvsluttaSelskaper: true,
            });
            it(`includes ${SoknadFormField.selvstendigHarAvsluttetSelskaper}`, () => {
                expect(isIncluded(SoknadFormField.selvstendigHarAvsluttetSelskaper)).toBeTruthy();
            });
            describe(`when ${SoknadFormField.selvstendigHarAvsluttetSelskaper} is NO`, () => {
                const whenNo = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    skalSpørreOmAvsluttaSelskaper: true,
                    selvstendigHarAvsluttetSelskaper: YesOrNo.NO,
                });
                it(`does not include ${SoknadFormField.selvstendigAvsluttaSelskaper}`, () => {
                    expect(whenNo.isIncluded(SoknadFormField.selvstendigAvsluttaSelskaper)).toBeFalsy();
                });
            });
            describe(`when ${SoknadFormField.selvstendigHarAvsluttetSelskaper} is YES`, () => {
                const whenYes = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    skalSpørreOmAvsluttaSelskaper: true,
                    selvstendigHarAvsluttetSelskaper: YesOrNo.YES,
                });
                it('includes detail questions', () => {
                    expect(whenYes.isIncluded(SoknadFormField.selvstendigAvsluttaSelskaper)).toBeTruthy();
                    expect(
                        whenYes.isIncluded(SoknadFormField.selvstendigAlleAvsluttaSelskaperErRegistrert)
                    ).toBeTruthy();
                });
            });
        });
    });
});
