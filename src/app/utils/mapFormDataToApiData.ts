import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Locale } from 'common/types/Locale';
import { ApplicationApiData } from '../types/ApplicationApiData';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { ApplicantProfile } from '../types/ApplicantProfile';

export const mapFormDataToApiData = (
    formData: ApplicationFormData,
    applicantProfile: ApplicantProfile,
    språk: Locale
): ApplicationApiData | undefined => {
    const {
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        selvstendigHarHattInntektstapHelePerioden,
        selvstendigInntekt2019,
        selvstendigInntekt2020,
        selvstendigInntektIPerioden,
        selvstendigInntektstapStartetDato,
    } = formData;

    const apiData: ApplicationApiData = {
        språk: (språk as any) === 'en' ? 'nn' : språk,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
    };

    if (applicantProfile.isSelvstendig) {
        if (selvstendigInntekt2020 !== undefined && selvstendigInntektIPerioden !== undefined) {
            apiData.selvstendigNæringsdrivende = {
                harHattInntektstapHelePeriode: selvstendigHarHattInntektstapHelePerioden === YesOrNo.YES,
                inntektstapStartetDato:
                    selvstendigHarHattInntektstapHelePerioden === YesOrNo.NO && selvstendigInntektstapStartetDato
                        ? formatDateToApiFormat(selvstendigInntektstapStartetDato)
                        : undefined,
                inntekt2019: selvstendigInntekt2019,
                inntekt2020: selvstendigInntekt2020,
                inntektIPerioden: selvstendigInntektIPerioden,
            };
        } else {
            return undefined;
        }
    }
    return apiData;
};
