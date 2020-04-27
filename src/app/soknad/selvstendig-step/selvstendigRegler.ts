import { Regel, RegelType, RegelTestresultat, RegelStatus } from '../../utils/regler/regelTypes';
import { SelvstendigFormPayload } from './selvstendigFormConfig';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';

enum SelvstendigNæringdsrivendeRegler {
    'harHattTapPgaKorona' = 'harHattTapPgaKorona',
    'harHattHistoriskInntekt' = 'harHattHistoriskInntekt',
}

export type SelvstendigRegel = Regel<SelvstendigNæringdsrivendeRegler, SelvstendigFormPayload>;
export type SelvstendigRegelStatus = RegelStatus<SelvstendigNæringdsrivendeRegler, SelvstendigFormPayload>;

const harHattTapPgaKorona = ({ selvstendigHarTaptInntektPgaKorona }: SelvstendigFormPayload): RegelTestresultat => {
    const passerer = selvstendigHarTaptInntektPgaKorona === YesOrNo.YES;
    return {
        passerer,
    };
};

const harHattHistoriskInntekt = ({
    selvstendigHarHattInntektFraForetak,
    selvstendigInntekt2019,
    selvstendigInntekt2020,
    inntektÅrstall,
}: SelvstendigFormPayload): RegelTestresultat => {
    const passerer =
        selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
        hasValidHistoriskInntekt({ selvstendigInntekt2019, selvstendigInntekt2020 }, inntektÅrstall);
    return {
        passerer,
        info: passerer
            ? undefined
            : {
                  values: { inntektÅrstall },
              },
    };
};

const selvstendigRegler: Regel<SelvstendigNæringdsrivendeRegler, SelvstendigFormPayload>[] = [
    {
        key: SelvstendigNæringdsrivendeRegler.harHattTapPgaKorona,
        type: RegelType.FEIL,
        test: harHattTapPgaKorona,
    },
    {
        key: SelvstendigNæringdsrivendeRegler.harHattHistoriskInntekt,
        type: RegelType.FEIL,
        test: harHattHistoriskInntekt,
    },
];

export const SelvstendigChecks = {
    [SelvstendigNæringdsrivendeRegler.harHattHistoriskInntekt]: {
        key: SelvstendigNæringdsrivendeRegler.harHattTapPgaKorona,
        type: RegelType.FEIL,
        test: harHattTapPgaKorona,
    },
    [SelvstendigNæringdsrivendeRegler.harHattTapPgaKorona]: {
        key: SelvstendigNæringdsrivendeRegler.harHattHistoriskInntekt,
        type: RegelType.FEIL,
        test: harHattHistoriskInntekt,
    },
};

export default selvstendigRegler;
