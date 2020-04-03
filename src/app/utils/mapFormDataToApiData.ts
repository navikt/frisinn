import { Locale } from 'common/types/Locale';
import { ApplicationApiData } from '../types/ApplicationApiData';
import { ApplicationFormData } from '../types/ApplicationFormData';

export const mapFormDataToApiData = (
    { harBekreftetOpplysninger, harForståttRettigheterOgPlikter }: ApplicationFormData,
    språk: Locale
): ApplicationApiData => {
    const apiData: ApplicationApiData = {
        språk: (språk as any) === 'en' ? 'nn' : språk,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter
    };

    return apiData;
};
