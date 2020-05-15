import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import { Systemtittel } from 'nav-frontend-typografi';
import { AvsluttetSelskap, isAvsluttetSelskap } from '../../../types/AvsluttetSelskap';
import { apiStringDateToDate } from '../../../utils/dateUtils';
import { validateDateInRange } from '../../../validation/fieldValidations';
import { getAvsluttetDateRange, getAvsluttetSelskapMaksOpprettetDato, minAvsluttetDate } from './avsluttetSelskapUtils';

interface Props {
    maxDate: Date;
    foretak?: Partial<AvsluttetSelskap>;
    onSubmit: (values: AvsluttetSelskap) => void;
    onCancel: () => void;
}

enum FieldName {
    opprettetDato = 'opprettetDato',
    avsluttetDato = 'avsluttetDato',
    navn = 'navn',
}

type FormValues = Partial<AvsluttetSelskap>;

const Form = getTypedFormComponents<FieldName, FormValues>();

const AvsluttetSelskapForm = ({ maxDate, foretak: initialValues = {}, onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isAvsluttetSelskap(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('AvsluttaSelskap: Formvalues is not a valid AvsluttaSelskap on submit.');
        }
    };

    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={({ values: { opprettetDato } }) => {
                    const maxOpprettetDato = getAvsluttetSelskapMaksOpprettetDato(maxDate);
                    const avsluttetDateRange = getAvsluttetDateRange(maxDate, opprettetDato);
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                            <Systemtittel tag="h1">Informasjon om selskap</Systemtittel>
                            <FormBlock>
                                <Form.Input
                                    name={FieldName.navn}
                                    label={'Navn på selskapet'}
                                    validate={validateRequiredField}
                                />
                            </FormBlock>

                            <FormBlock>
                                <Form.DatePicker
                                    name={FieldName.opprettetDato}
                                    label="Når ble selskapet opprettet?"
                                    dateLimitations={{ maksDato: maxOpprettetDato }}
                                    showYearSelector={true}
                                    dayPickerProps={{ initialMonth: apiStringDateToDate('2018-08-01') }}
                                    fullscreenOverlay={true}
                                    validate={validateRequiredField}
                                />
                            </FormBlock>

                            <FormBlock>
                                <Form.DatePicker
                                    name={FieldName.avsluttetDato}
                                    label="Når ble selskapet avsluttet?"
                                    showYearSelector={true}
                                    dateLimitations={{
                                        minDato: avsluttetDateRange.from,
                                        maksDato: avsluttetDateRange.to,
                                    }}
                                    dayPickerProps={{
                                        initialMonth:
                                            moment.max(moment(opprettetDato), moment(minAvsluttetDate)).toDate() ||
                                            apiStringDateToDate('2019-01-01'),
                                    }}
                                    fullscreenOverlay={true}
                                    validate={validateDateInRange(avsluttetDateRange)}
                                />
                            </FormBlock>
                        </Form.Form>
                    );
                }}
            />
        </>
    );
};

export default AvsluttetSelskapForm;
