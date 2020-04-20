import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ApplicationEssentials, Person } from '../../../types/ApplicationEssentials';
import { ApplicationFormField, initialApplicationValues } from '../../../types/ApplicationFormData';
import { apiStringDateToDate } from '../../../utils/dateUtils';
import { SelvstendigFormPayload, SelvstendigFormQuestions } from '../selvstendigFormConfig';

const person: Person = {
    fornavn: 'Test',
    mellomnavn: undefined,
    etternavn: 'Testesen',
    fødselsnummer: '22075944547',
    kontonummer: '45431224877',
    kjønn: 'm',
};

const appEssentials: ApplicationEssentials = {
    currentSøknadsperiode: {
        from: apiStringDateToDate('2020-04-01'),
        to: apiStringDateToDate('2020-04-30'),
    },
    person,
    personligeForetak: {
        foretak: [],
        tidligsteRegistreringsdato: apiStringDateToDate('2001-04-30'),
    },
};
const emptyPayload: SelvstendigFormPayload = {
    ...initialApplicationValues,
    selvstendigHarTaptInntektPgaKorona: YesOrNo.YES,
    selvstendigErFrilanser: YesOrNo.UNANSWERED,
    selvstendigHarHattInntektSomFrilanserIPerioden: YesOrNo.UNANSWERED,
    ...appEssentials,
};

describe('selvstendigFormConfig', () => {
    let values: SelvstendigFormPayload;
    beforeEach(() => {
        values = {
            ...emptyPayload,
            søkerOmTaptInntektSomFrilanser: YesOrNo.YES,
        } as SelvstendigFormPayload;
    });
    it('Søker både selvstendig og frilanser', () => {
        const { isVisible } = SelvstendigFormQuestions.getVisbility(values);
        expect(isVisible(ApplicationFormField.selvstendigHarTaptInntektPgaKorona)).toBeTruthy();
    });
});
