import { Locale } from 'common/types/Locale';

export interface ApplicationApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
}
