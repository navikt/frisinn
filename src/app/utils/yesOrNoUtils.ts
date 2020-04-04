import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const yesOrNoIsAnswered = (answer?: YesOrNo): boolean => {
    return answer !== undefined && answer !== YesOrNo.UNANSWERED;
};
