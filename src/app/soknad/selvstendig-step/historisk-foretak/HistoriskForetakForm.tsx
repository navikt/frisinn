import React from 'react';
import { useIntl } from 'react-intl';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { isHistoriskForetak, HistoriskFortak } from './types';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { validateDateInRange } from '../../../validation/fieldValidations';
import { DateRange, apiStringDateToDate } from '../../../utils/dateUtils';

interface Props {
    foretak?: Partial<HistoriskFortak>;
    onSubmit: (values: HistoriskFortak) => void;
    onCancel: () => void;
}

enum FieldName {
    opprettetDato = 'opprettetDato',
    avsluttetDato = 'avsluttetDato',
    navn = 'navn',
}

type FormValues = Partial<HistoriskFortak>;

const Form = getTypedFormComponents<FieldName, FormValues>();

const HistoriskForetakForm = ({ foretak: initialValues = {}, onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isHistoriskForetak(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('HistoriskForetak: Formvalues is not a valid HistoriskForetak on submit.');
        }
    };

    const avsluttetDateRange: DateRange = {
        from: apiStringDateToDate('2018-01-01'),
        to: apiStringDateToDate('2020-03-13'),
    };
    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={() => (
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
                                dateLimitations={{ maksDato: avsluttetDateRange.to }}
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
                                dateLimitations={{ minDato: avsluttetDateRange.from, maksDato: avsluttetDateRange.to }}
                                dayPickerProps={{ initialMonth: apiStringDateToDate('2018-08-01') }}
                                fullscreenOverlay={true}
                                validate={validateDateInRange(avsluttetDateRange)}
                            />
                        </FormBlock>
                    </Form.Form>
                )}
            />
        </>
    );
};

export default HistoriskForetakForm;
