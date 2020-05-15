import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import { Systemtittel } from 'nav-frontend-typografi';
import { AvvikletSelskap, isAvvikletSelskap } from '../../../types/AvvikletSelskap';
import { apiStringDateToDate } from '../../../utils/dateUtils';
import { validateDateInRange } from '../../../validation/fieldValidations';
import {
    getAvsluttetDateRange,
    getAvvikletSelskapMaksOpprettetDato,
    avvikletSelskapMinAvvikletDate,
} from './avvikletSelskapUtils';

interface Props {
    maxDate: Date;
    foretak?: Partial<AvvikletSelskap>;
    onSubmit: (values: AvvikletSelskap) => void;
    onCancel: () => void;
}

enum FieldName {
    opprettetDato = 'opprettetDato',
    avsluttetDato = 'avsluttetDato',
    navn = 'navn',
}

type FormValues = Partial<AvvikletSelskap>;

const Form = getTypedFormComponents<FieldName, FormValues>();

const AvvikletSelskapForm = ({ maxDate, foretak: initialValues = {}, onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isAvvikletSelskap(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('AvvikletSelskap: Formvalues is not a valid AvvikletSelskap on submit.');
        }
    };

    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={({ values: { opprettetDato } }) => {
                    const maxOpprettetDato = getAvvikletSelskapMaksOpprettetDato(maxDate);
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
                                    label="Når ble selskapet avviklet?"
                                    showYearSelector={true}
                                    dateLimitations={{
                                        minDato: avsluttetDateRange.from,
                                        maksDato: avsluttetDateRange.to,
                                    }}
                                    dayPickerProps={{
                                        initialMonth:
                                            moment
                                                .max(moment(opprettetDato), moment(avvikletSelskapMinAvvikletDate))
                                                .toDate() || apiStringDateToDate('2019-01-01'),
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

export default AvvikletSelskapForm;
