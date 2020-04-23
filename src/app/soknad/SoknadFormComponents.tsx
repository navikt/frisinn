import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { SoknadFormData, SoknadFormField } from '../types/SoknadFormData';

const SoknadFormComponents = getTypedFormComponents<SoknadFormField, SoknadFormData>();

export default SoknadFormComponents;
