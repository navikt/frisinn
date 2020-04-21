// import { YesOrNo } from '@navikt/sif-common-formik/lib';
// import { IntroFormData } from '../pages/intro-page/intro-form/introFormConfig';

// export enum RejectReason {
//     'erIkkeMellom18og66' = 'erIkkeMellom18og66',
//     'erIkkeSelvstendigEllerFrilanser' = 'erIkkeSelvstendigEllerFrilanser',
// }

// export const shouldUserBeStoppedFormUsingApplication = (values: IntroFormData): RejectReason | undefined => {
//     const { erMellom18og67år, erSelvstendigNæringsdrivende, erFrilanser } = values;

//     if (erMellom18og67år === YesOrNo.NO) {
//         return RejectReason.erIkkeMellom18og66;
//     }
//     if (erSelvstendigNæringsdrivende === YesOrNo.NO && erFrilanser === YesOrNo.NO) {
//         return RejectReason.erIkkeSelvstendigEllerFrilanser;
//     }
//     return undefined;
// };
