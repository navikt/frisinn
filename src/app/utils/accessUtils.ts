import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { IntroFormData } from '../pages/intro-page/intro-form/introFormConfig';

export const canUserContinueToApplication = (values: IntroFormData): boolean => {
    return (
        values.erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.YES &&
        values.harHattInntaktstapPgaKorona === YesOrNo.YES
    );
};
