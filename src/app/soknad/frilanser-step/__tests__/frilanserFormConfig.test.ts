import { SoknadFormField, FrilanserFormData } from '../../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate } from '../../../utils/dateUtils';
import { SoknadEssentials, Person } from '../../../types/SoknadEssentials';
import { PersonligeForetakMock as pfm } from '../../../__mock__/personligeForetakMock';
import { getPeriodeForAvsluttaSelskaper } from '../../selvstendig-step/avsluttet-selskap/avsluttetSelskapUtils';
import { FrilanserAvslagStatus, FrilanserAvslagÅrsak } from '../frilanserAvslag';
import { FrilanserFormConfigPayload, FrilanserFormQuestions } from '../frilanserFormConfig';

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
        describe('onlyFrilanser', () => {
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
            it(`does include ${SoknadFormField.frilanserInntektSomSelvstendigIPerioden} when  ${SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden} = no`, () => {
                const { isIncluded } = FrilanserFormQuestions.getVisbility({
                    ...payload,
                    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.NO,
                    frilanserHarHattInntektSomSelvstendigIPerioden: YesOrNo.YES,
                });
                expect(isIncluded(SoknadFormField.frilanserInntektSomSelvstendigIPerioden)).toBeTruthy();
            });
        });
    });
});
