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
};

describe('frilanserFormConfig', () => {
    const payload: FrilanserFormConfigPayload = {
        ...initialFormData,
        ...soknadEssentials,
        avslag,
    };
    describe('included questions', () => {
        describe('initial state', () => {
            const { isIncluded } = FrilanserFormQuestions.getVisbility(payload);
            it(`includes all required and fixed questions`, () => {
                expect(isIncluded(SoknadFormField.frilanserHarTaptInntektPgaKorona)).toBeTruthy();
                expect(isIncluded(SoknadFormField.frilanserInntektstapStartetDato)).toBeTruthy();
                expect(isIncluded(SoknadFormField.frilanserInntektIPerioden)).toBeTruthy();
                expect(isIncluded(SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet)).toBeTruthy();
            });
            it(`does not include questions which depends on different payload states`, () => {
                expect(isIncluded(SoknadFormField.frilanserErSelvstendigNæringsdrivende)).toBeFalsy();
                expect(isIncluded(SoknadFormField.frilanserInntektSomSelvstendigIPerioden)).toBeFalsy();
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
