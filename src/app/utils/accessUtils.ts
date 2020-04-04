import { ApplicantData } from '../types/ApplicantData';
import { IntroFormData } from '../pages/intro-page/intro-form/introFormConfig';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const canUserContinueToApplication = (values: IntroFormData): boolean => {
    return values.erSelvstendigNæringsdrivende === YesOrNo.YES || values.erFrilanser === YesOrNo.YES;
};
export const isApplicationAvailableForApplicant = (applicant: ApplicantData): boolean => {
    return applicant.person.myndig === true;
};
