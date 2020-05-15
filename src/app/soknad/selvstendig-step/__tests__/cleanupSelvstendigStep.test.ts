import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SelvstendigFormData, SoknadFormField, SoknadFormData } from '../../../types/SoknadFormData';
import { apiStringDateToDate, DateRange } from '../../../utils/dateUtils';
import { cleanupSelvstendigStep } from '../cleanupSelvstendigStep';
import { SelvstendigNæringdsrivendeAvslagÅrsak, SelvstendigNæringsdrivendeAvslagStatus } from '../selvstendigAvslag';

const periode: DateRange = {
    from: apiStringDateToDate('2020-04-01'),
    to: apiStringDateToDate('2020-04-30'),
};

const selvstendigFormData: SelvstendigFormData = {
    selvstendigBeregnetInntektsårstall: 2019,
    søkerOmTaptInntektSomSelvstendigNæringsdrivende: YesOrNo.YES,
    selvstendigHarTaptInntektPgaKorona: YesOrNo.YES,
    selvstendigInntektstapStartetDato: apiStringDateToDate('2020-04-01'),
    selvstendigHarAvvikletSelskaper: YesOrNo.YES,
    selvstendigAvvikledeSelskaper: [
        {
            id: '123',
            navn: 'closed',
            avsluttetDato: apiStringDateToDate('2020-04-01'),
            opprettetDato: apiStringDateToDate('2010-02-31'),
        },
    ],
    selvstendigAlleAvvikledeSelskaperErRegistrert: YesOrNo.YES,
    selvstendigBeregnetTilgjengeligSøknadsperiode: periode,
    selvstendigInntektIPerioden: 0,
    selvstendigInntekt2019: 2000,
    selvstendigInntekt2020: 2001,
    selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.NO,
    selvstendigHarRevisor: YesOrNo.NO,
    selvstendigHarRegnskapsfører: YesOrNo.NO,
    selvstendigErFrilanser: YesOrNo.NO,
    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.NO,
    søkerOmTaptInntektSomFrilanser: YesOrNo.NO,
};

const formValues = selvstendigFormData as SoknadFormData;

const avslag: SelvstendigNæringsdrivendeAvslagStatus = {
    [SelvstendigNæringdsrivendeAvslagÅrsak.harIkkeHattInntektstapPgaKorona]: false,
    [SelvstendigNæringdsrivendeAvslagÅrsak.søkerIkkeForGyldigTidsrom]: false,
    [SelvstendigNæringdsrivendeAvslagÅrsak.harYtelseFraNavSomDekkerTapet]: false,
    [SelvstendigNæringdsrivendeAvslagÅrsak.oppgirNullHistoriskInntekt]: false,
};

const minValidPayload: SoknadFormData = {
    ...formValues,
    selvstendigHarTaptInntektPgaKorona: YesOrNo.YES,
    selvstendigInntektstapStartetDato: new Date(),
    selvstendigBeregnetInntektsårstall: 2019,
    selvstendigBeregnetTilgjengeligSøknadsperiode: periode,
    selvstendigInntekt2019: 0,
    selvstendigHarYtelseFraNavSomDekkerTapet: YesOrNo.NO,
};

describe('cleanupSelvstendigStep', () => {
    it('runs', () => {
        expect(1).toBe(1);
    });
    it(`cleans everything if ${SoknadFormField.selvstendigHarTaptInntektPgaKorona} is NO`, () => {
        const payload: SoknadFormData = {
            ...formValues,
            selvstendigHarTaptInntektPgaKorona: YesOrNo.NO,
        };
        const result: SelvstendigFormData = cleanupSelvstendigStep(payload, avslag);
        expect(result.selvstendigInntektstapStartetDato).toBeUndefined();
        expect(result.selvstendigInntektIPerioden).toBeUndefined();
        expect(result.selvstendigHarAvvikletSelskaper).toEqual(YesOrNo.UNANSWERED);
        expect(result.selvstendigAvvikledeSelskaper).toBeUndefined();
        expect(result.selvstendigAlleAvvikledeSelskaperErRegistrert).toEqual(YesOrNo.UNANSWERED);
        expect(result.selvstendigInntekt2019).toBeUndefined();
        expect(result.selvstendigInntekt2020).toBeUndefined();
        expect(result.selvstendigBeregnetTilgjengeligSøknadsperiode).toBeUndefined();
        expect(result.selvstendigHarYtelseFraNavSomDekkerTapet).toEqual(YesOrNo.UNANSWERED);
        expect(result.selvstendigErFrilanser).toEqual(YesOrNo.UNANSWERED);
        expect(result.selvstendigHarHattInntektSomFrilanserIPerioden).toEqual(YesOrNo.UNANSWERED);
        expect(result.selvstendigInntektSomFrilanserIPerioden).toBeUndefined();
        expect(result.selvstendigHarRegnskapsfører).toEqual(YesOrNo.UNANSWERED);
        expect(result.selvstendigRegnskapsførerNavn).toBeUndefined();
        expect(result.selvstendigRegnskapsførerTelefon).toBeUndefined();
        expect(result.selvstendigHarRevisor).toEqual(YesOrNo.UNANSWERED);
        expect(result.selvstendigRevisorNavn).toBeUndefined();
        expect(result.selvstendigRevisorTelefon).toBeUndefined();
        expect(result.selvstendigRevisorNAVKanTaKontakt).toEqual(YesOrNo.UNANSWERED);
    });
    it(`does not clean more than necessary for normal data`, () => {
        const result: SelvstendigFormData = cleanupSelvstendigStep(minValidPayload, avslag);
        expect(result).toBeDefined();
        expect(result.selvstendigHarTaptInntektPgaKorona).toEqual(YesOrNo.YES);
        expect(result.selvstendigInntektstapStartetDato).toBeDefined();
        expect(result.selvstendigBeregnetInntektsårstall).toBeDefined();
        expect(result.selvstendigBeregnetTilgjengeligSøknadsperiode).toBeDefined();
        expect(result.selvstendigHarYtelseFraNavSomDekkerTapet).toEqual(YesOrNo.NO);
    });
    it(`does clean correct income when historsikt inntekt årstall === 2019`, () => {
        const result2019: SelvstendigFormData = cleanupSelvstendigStep(
            {
                ...minValidPayload,
                selvstendigBeregnetInntektsårstall: 2019,
                selvstendigInntekt2019: 1,
                selvstendigInntekt2020: 1,
            },
            avslag
        );
        expect(result2019.selvstendigInntekt2019).toBeDefined();
        expect(result2019.selvstendigInntekt2020).toBeUndefined();
    });
    it(`does clean correct income when historsikt inntekt årstall === 2020`, () => {
        const result2020: SelvstendigFormData = cleanupSelvstendigStep(
            {
                ...minValidPayload,
                selvstendigBeregnetInntektsårstall: 2020,
                selvstendigInntekt2019: 1,
                selvstendigInntekt2020: 1,
            },
            avslag
        );
        expect(result2020.selvstendigInntekt2019).toBeUndefined();
        expect(result2020.selvstendigInntekt2020).toBeDefined();
    });
    it(`does not clean avviklede selskaper if ${SoknadFormField.selvstendigHarAvvikletSelskaper} = YES`, () => {
        const result: SelvstendigFormData = cleanupSelvstendigStep(
            {
                ...formValues,
            },
            avslag
        );
        expect(result.selvstendigAvvikledeSelskaper?.length).toBe(1);
        expect(result.selvstendigAlleAvvikledeSelskaperErRegistrert).toEqual(YesOrNo.YES);
    });
    it(`does clean avviklede selskaper if ${SoknadFormField.selvstendigHarAvvikletSelskaper} = NO`, () => {
        const result: SelvstendigFormData = cleanupSelvstendigStep(
            {
                ...formValues,
                selvstendigHarAvvikletSelskaper: YesOrNo.NO,
            },
            avslag
        );
        expect(result.selvstendigAvvikledeSelskaper).toBeUndefined();
        expect(result.selvstendigAlleAvvikledeSelskaperErRegistrert).toEqual(YesOrNo.UNANSWERED);
    });
});
