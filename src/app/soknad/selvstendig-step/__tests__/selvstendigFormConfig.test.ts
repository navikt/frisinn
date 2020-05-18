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
        describe(`includes correct input for historisk inntekt when ${SoknadFormField.selvstendigBeregnetInntektsårstall} is 2019`, () => {
            const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                ...payload,
                selvstendigBeregnetInntektsårstall: 2019,
            });
            expect(isIncluded(SoknadFormField.selvstendigInntekt2019)).toBeTruthy();
            expect(isIncluded(SoknadFormField.selvstendigInntekt2020)).toBeFalsy();
        });
        describe(`includes correct input for historisk inntekt when ${SoknadFormField.selvstendigBeregnetInntektsårstall} is 2020`, () => {
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
            expect(isIncluded(SoknadFormField.selvstendigErFrilanser)).toBeTruthy();
            describe(`${SoknadFormField.selvstendigErFrilanser} is NO`, () => {
                const whenNo = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
                    selvstendigErFrilanser: YesOrNo.NO,
                });
                expect(whenNo.isIncluded(SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden)).toBeFalsy();
                expect(whenNo.isIncluded(SoknadFormField.selvstendigInntektSomFrilanserIPerioden)).toBeFalsy();
            });
            describe(`${SoknadFormField.selvstendigErFrilanser} is YES and ${SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden} is NO `, () => {
                const whenYes = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
                    selvstendigErFrilanser: YesOrNo.YES,
                    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.NO,
                });
                expect(whenYes.isIncluded(SoknadFormField.selvstendigInntektSomFrilanserIPerioden)).toBeFalsy();
            });
            describe(`${SoknadFormField.selvstendigErFrilanser} is YES and ${SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden} is NO `, () => {
                const whenYes = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
                    selvstendigErFrilanser: YesOrNo.YES,
                    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.NO,
                });
                expect(whenYes.isIncluded(SoknadFormField.selvstendigInntektSomFrilanserIPerioden)).toBeFalsy();
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
        describe(`includes inputs for regnskapsfører when ${SoknadFormField.selvstendigHarRegnskapsfører} is YES`, () => {
            const harRegnskapsfører = SelvstendigFormQuestions.getVisbility({
                ...payload,
                selvstendigHarRegnskapsfører: YesOrNo.YES,
            });
            expect(harRegnskapsfører.isIncluded(SoknadFormField.selvstendigRegnskapsførerNavn)).toBeTruthy();
            expect(harRegnskapsfører.isIncluded(SoknadFormField.selvstendigRegnskapsførerTelefon)).toBeTruthy();
            expect(harRegnskapsfører.isIncluded(SoknadFormField.selvstendigHarRevisor)).toBeFalsy();
        });
        describe(`includes inputs for revisor when ${SoknadFormField.selvstendigHarRevisor} is YES`, () => {
            const harRevisor = SelvstendigFormQuestions.getVisbility({
                ...payload,
                selvstendigHarRevisor: YesOrNo.YES,
            });
            expect(harRevisor.isIncluded(SoknadFormField.selvstendigRevisorNavn)).toBeTruthy();
            expect(harRevisor.isIncluded(SoknadFormField.selvstendigRevisorTelefon)).toBeTruthy();
            expect(harRevisor.isIncluded(SoknadFormField.selvstendigRevisorNAVKanTaKontakt)).toBeTruthy();
        });
        describe(`includes input for avslutta selskaper when skalSpørreOmAvsluttaSelskaper is true`, () => {
            const { isIncluded } = SelvstendigFormQuestions.getVisbility({
                ...payload,
                skalSpørreOmAvsluttaSelskaper: true,
            });
            expect(isIncluded(SoknadFormField.selvstendigHarAvsluttetSelskaper)).toBeTruthy();
            describe(`${SoknadFormField.selvstendigHarAvsluttetSelskaper} is NO`, () => {
                const whenNo = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    skalSpørreOmAvsluttaSelskaper: true,
                    selvstendigHarAvsluttetSelskaper: YesOrNo.NO,
                });
                expect(whenNo.isIncluded(SoknadFormField.selvstendigAvsluttaSelskaper)).toBeFalsy();
            });
            describe(`${SoknadFormField.selvstendigHarAvsluttetSelskaper} is YES`, () => {
                const whenYes = SelvstendigFormQuestions.getVisbility({
                    ...payload,
                    skalSpørreOmAvsluttaSelskaper: true,
                    selvstendigHarAvsluttetSelskaper: YesOrNo.YES,
                });
                expect(whenYes.isIncluded(SoknadFormField.selvstendigAvsluttaSelskaper)).toBeTruthy();
                expect(whenYes.isIncluded(SoknadFormField.selvstendigAlleAvsluttaSelskaperErRegistrert)).toBeTruthy();
            });
        });
    });
});
