import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { ApplicationFormData, ApplicationFormField } from '../types/ApplicationFormData';

const ApplicationFormComponents = getTypedFormComponents<ApplicationFormField, ApplicationFormData>();

export default ApplicationFormComponents;
