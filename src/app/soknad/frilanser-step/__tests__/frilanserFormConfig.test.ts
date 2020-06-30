import { SoknadFormField, FrilanserFormData } from '../../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate, DateRange } from '../../../utils/dateUtils';
import { SoknadEssentials, Person } from '../../../types/SoknadEssentials';
import { PersonligeForetakMock as pfm } from '../../../__mock__/personligeForetakMock';
import { getPeriodeForAvsluttaSelskaper } from '../../selvstendig-step/avsluttet-selskap/avsluttetSelskapUtils';
import { FrilanserAvslagStatus, FrilanserAvslagÅrsak } from '../frilanserAvslag';
import { FrilanserFormConfigPayload, FrilanserFormQuestions } from '../frilanserFormConfig';
import { SelvstendigNæringdsrivendeAvslagÅrsak } from '../../selvstendig-step/selvstendigAvslag';
import { getSøknadsperiodeinfo } from '../../../utils/søknadsperiodeUtils';

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
        harSøktSomSelvstendigNæringsdrivende: false,
        harSøktSomFrilanser: false,
    },
    isSelvstendigNæringsdrivende: true,
    avsluttetSelskapDateRange: getPeriodeForAvsluttaSelskaper(personligeForetak.tidligsteRegistreringsdato),
    søknadsperiodeinfo: getSøknadsperiodeinfo(søknadsperiode),
};

const initialFormData: FrilanserFormData = {
    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.NO,
    frilanserHarMottattUtbetalingTidligere: YesOrNo.UNANSWERED,
    søkerOmTaptInntektSomFrilanser: YesOrNo.YES,
    frilanserHarTaptInntektPgaKorona: YesOrNo.UNANSWERED,
    frilanserHarYtelseFraNavSomDekkerTapet: YesOrNo.UNANSWERED,
    frilanserInntektIPerioden: undefined as any,
    frilanserInntektstapStartetDato: undefined as any,
    frilanserBeregnetTilgjengeligSøknadsperiode: undefined,
    frilanserHarHattInntektSomSelvstendigIPerioden: YesOrNo.UNANSWERED,
    frilanserInntektSomSelvstendigIPerioden: undefined as any,
};

const avslag: FrilanserAvslagStatus = {
    [FrilanserAvslagÅrsak.harIkkeHattInntektstapPgaKorona]: false,
    [FrilanserAvslagÅrsak.søkerIkkeForGyldigTidsrom]: false,
    [FrilanserAvslagÅrsak.utebetalingFraNAVDekkerHeleInntektstapet]: false,
    [FrilanserAvslagÅrsak.ingenUttaksdager]: false,
};

describe('frilanserFormConfig', () => {
    const payload: FrilanserFormConfigPayload = {
        ...initialFormData,
        ...soknadEssentials,
        avslag,
    };
    describe('included questions', () => {
        describe('initial state - førstegang', () => {
            const { isIncluded } = FrilanserFormQuestions.getVisbility(payload);
            it(`includes all required and fixed questions`, () => {
                expect(isIncluded(SoknadFormField.frilanserHarTaptInntektPgaKorona)).toBeTruthy();
                expect(isIncluded(SoknadFormField.frilanserInntektstapStartetDato)).toBeTruthy();
                expect(isIncluded(SoknadFormField.frilanserInntektIPerioden)).toBeTruthy();
                expect(isIncluded(SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet)).toBeTruthy();
            });
            it(`does not include questions which depends on different payload states`, () => {
                expect(isIncluded(SoknadFormField.frilanserHarMottattUtbetalingTidligere)).toBeFalsy();
                expect(isIncluded(SoknadFormField.frilanserErSelvstendigNæringsdrivende)).toBeFalsy();
                expect(isIncluded(SoknadFormField.frilanserInntektSomSelvstendigIPerioden)).toBeFalsy();
            });
        });
        describe('initial state - andregang', () => {
            const { isIncluded } = FrilanserFormQuestions.getVisbility({
                ...payload,
                tidligerePerioder: { ...payload.tidligerePerioder, harSøktSomFrilanser: true },
            });
            it(`includes all required and fixed questions`, () => {
                expect(isIncluded(SoknadFormField.frilanserHarTaptInntektPgaKorona)).toBeTruthy();
                expect(isIncluded(SoknadFormField.frilanserHarMottattUtbetalingTidligere)).toBeTruthy();
                expect(isIncluded(SoknadFormField.frilanserInntektIPerioden)).toBeTruthy();
                expect(isIncluded(SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet)).toBeTruthy();
            });
            it(`does not include questions which depends on different payload states`, () => {
                expect(isIncluded(SoknadFormField.frilanserInntektstapStartetDato)).toBeFalsy();
                expect(isIncluded(SoknadFormField.frilanserErSelvstendigNæringsdrivende)).toBeFalsy();
                expect(isIncluded(SoknadFormField.frilanserInntektSomSelvstendigIPerioden)).toBeFalsy();
            });
        });
        describe('when forstegang', () => {
            it(`It does not show ${SoknadFormField.frilanserInntektstapStartetDato} when ${SoknadFormField.frilanserHarTaptInntektPgaKorona} is unanswered`, () => {
                const { isVisible } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                });
                expect(isVisible(SoknadFormField.frilanserInntektstapStartetDato)).toBeFalsy();
            });
            it(`It does not show ${SoknadFormField.frilanserInntektstapStartetDato} when ${SoknadFormField.frilanserHarTaptInntektPgaKorona} is NO`, () => {
                const { isVisible } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                    frilanserHarTaptInntektPgaKorona: YesOrNo.NO,
                });
                expect(isVisible(SoknadFormField.frilanserInntektstapStartetDato)).toBeFalsy();
            });
            it(`It shows ${SoknadFormField.frilanserInntektstapStartetDato} when ${SoknadFormField.frilanserHarTaptInntektPgaKorona} is YES`, () => {
                const { isVisible } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                    frilanserHarTaptInntektPgaKorona: YesOrNo.YES,
                });
                expect(isVisible(SoknadFormField.frilanserInntektstapStartetDato)).toBeTruthy();
            });
        }),
            describe('when andregang', () => {
                const andregangPayload = {
                    ...payload,
                    frilanserHarMottattUtbetalingTidligere: YesOrNo.UNANSWERED,
                    tidligerePerioder: { ...payload.tidligerePerioder, harSøktSomFrilanser: true },
                };

                it(`includes ${SoknadFormField.frilanserInntektstapStartetDato} when ${SoknadFormField.frilanserHarMottattUtbetalingTidligere} === NO`, () => {
                    const { isIncluded } = FrilanserFormQuestions.getVisbility({
                        ...andregangPayload,
                        frilanserHarMottattUtbetalingTidligere: YesOrNo.NO,
                    });
                    expect(isIncluded(SoknadFormField.frilanserInntektstapStartetDato)).toBeTruthy();
                });
                it(`does not include ${SoknadFormField.frilanserInntektstapStartetDato} when ${SoknadFormField.frilanserHarMottattUtbetalingTidligere} === YES`, () => {
                    const { isIncluded } = FrilanserFormQuestions.getVisbility({
                        ...andregangPayload,
                        frilanserHarMottattUtbetalingTidligere: YesOrNo.YES,
                    });
                    expect(isIncluded(SoknadFormField.frilanserInntektstapStartetDato)).toBeFalsy();
                });
            });
        describe('when user is onlyFrilanser', () => {
            it(`includes ${SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden}`, () => {
                const { isIncluded } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.NO,
                });
                expect(isIncluded(SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden)).toBeTruthy();
            });
            it(`does not include ${SoknadFormField.frilanserInntektSomSelvstendigIPerioden} when  ${SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden} = no`, () => {
                const { isIncluded } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.NO,
                    frilanserHarHattInntektSomSelvstendigIPerioden: YesOrNo.NO,
                });
                expect(isIncluded(SoknadFormField.frilanserInntektSomSelvstendigIPerioden)).toBeFalsy();
            });
            it(`does include ${SoknadFormField.frilanserInntektSomSelvstendigIPerioden} when ${SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden} = no`, () => {
                const { isIncluded } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.NO,
                    frilanserHarHattInntektSomSelvstendigIPerioden: YesOrNo.YES,
                });
                expect(isIncluded(SoknadFormField.frilanserInntektSomSelvstendigIPerioden)).toBeTruthy();
            });
        });
        describe(`when user is selvstendig and frilanser`, () => {
            it(`includes ${SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden} when ${SoknadFormField.selvstendigStopReason} is defined`, () => {
                const { isIncluded } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
                    selvstendigStopReason: SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona,
                });
                expect(isIncluded(SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden)).toBeTruthy();
            });
            it(`includes ${SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden} when ${soknadEssentials.tidligerePerioder.harSøktSomSelvstendigNæringsdrivende} === true`, () => {
                const { isIncluded } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.NO,
                    tidligerePerioder: { harSøktSomSelvstendigNæringsdrivende: true, harSøktSomFrilanser: true },
                });
                expect(isIncluded(SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden)).toBeTruthy();
            });
            it(`does not include ${SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden} when ${SoknadFormField.selvstendigStopReason} is undefined`, () => {
                const { isIncluded } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
                    selvstendigStopReason: undefined,
                });
                expect(isIncluded(SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden)).toBeFalsy();
            });
        });
    });
});
