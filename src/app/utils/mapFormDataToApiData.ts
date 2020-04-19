import { Locale } from 'common/types/Locale';
import { ApplicationApiData, SelvstendigNæringsdrivendeApiData } from '../types/ApplicationApiData';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { selvstendigSkalOppgiInntekt2019, selvstendigSkalOppgiInntekt2020 } from './selvstendigUtils';
import { ApplicationEssentials } from '../types/ApplicationEssentials';

const mapSelvstendigNæringsdrivendeFormDataToApiData = (
    { personligeForetak }: ApplicationEssentials,
    {
        søkerOmTaptInntektSomSelvstendigNæringsdrivende,
        selvstendigHarTaptInntektPgaKorona,
        selvstendigInntektstapStartetDato,
        selvstendigInntektIPerioden,
        selvstendigInntekt2019,
        selvstendigInntekt2020,
        selvstendigErFrilanser,
        selvstendigHarHattInntektSomFrilanserIPerioden,
        selvstendigInntektSomFrilanserIPerioden,
    }: ApplicationFormData
): SelvstendigNæringsdrivendeApiData | undefined => {
    if (
        (søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES &&
            selvstendigHarTaptInntektPgaKorona === YesOrNo.YES,
        selvstendigInntektstapStartetDato && selvstendigInntektIPerioden !== undefined)
    ) {
        const harFrilanserInntekt =
            selvstendigErFrilanser === YesOrNo.YES && selvstendigHarHattInntektSomFrilanserIPerioden === YesOrNo.YES;

        return {
            inntektstapStartet: formatDateToApiFormat(selvstendigInntektstapStartetDato),
            inntektIPerioden: selvstendigInntektIPerioden,
            inntekt2019: selvstendigSkalOppgiInntekt2019(personligeForetak) ? selvstendigInntekt2019 : undefined,
            inntekt2020: selvstendigSkalOppgiInntekt2020(personligeForetak) ? selvstendigInntekt2020 : undefined,
            inntektSomFrilanserIPeriode: harFrilanserInntekt ? selvstendigInntektSomFrilanserIPerioden : undefined,
        };
    }
    return undefined;
};

export const mapFormDataToApiData = (
    appEssentials: ApplicationEssentials,
    formData: ApplicationFormData,
    språk: Locale
): ApplicationApiData | undefined => {
    const { harBekreftetOpplysninger, harForståttRettigheterOgPlikter } = formData;

    const apiData: ApplicationApiData = {
        språk: (språk as any) === 'en' ? 'nn' : språk,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        selvstendigNæringsdrivende: mapSelvstendigNæringsdrivendeFormDataToApiData(appEssentials, formData),
    };

    return apiData;
};
