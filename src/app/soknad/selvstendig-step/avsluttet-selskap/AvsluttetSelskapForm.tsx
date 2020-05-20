import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import { Systemtittel } from 'nav-frontend-typografi';
import { AvsluttetSelskap, isAvsluttetSelskap } from '../../../types/AvsluttetSelskap';
import { apiStringDateToDate, DateRange } from '../../../utils/dateUtils';
import { validateDateInRange } from '../../../validation/fieldValidations';
import { minAvsluttetDate } from './avsluttetSelskapUtils';
import ExpandableInfo from '../../../components/expandable-content/ExpandableInfo';

interface Props {
    foretak?: Partial<AvsluttetSelskap>;
    periode: DateRange;
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

const AvsluttetSelskapForm = ({ foretak: initialValues = {}, periode, onSubmit, onCancel }: Props) => {
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
                    const avsluttetDateRange: DateRange = {
                        from: opprettetDato || periode.from,
                        to: periode.to,
                    };
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                            <Systemtittel tag="h1">Informasjon om selskap som er avsluttet</Systemtittel>
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
                                    dateLimitations={{ maksDato: periode.to }}
                                    showYearSelector={true}
                                    dayPickerProps={{ initialMonth: apiStringDateToDate('2018-08-01') }}
                                    fullscreenOverlay={true}
                                    validate={validateRequiredField}
                                    description={
                                        <ExpandableInfo title="Hvilken dato skal jeg legge inn her?">
                                            Hvis du har et enkeltpersonsforetak (ENK), skal du legge inn datoen du
                                            registrerte foretaket.
                                            <p>
                                                Hvis du har et ansvarlig selskap (ANS/DA), skal du legge inn datoen
                                                selskapet ble registrert. Dersom du fikk en rolle i selskapet på et
                                                senere tidspunkt, er det denne datoen du skal legge inn.
                                            </p>
                                        </ExpandableInfo>
                                    }
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
                                    description={
                                        <ExpandableInfo title="Jeg har sluttet i et ansvarlig selskap (ANS/DA), men selskapet er aktivt">
                                            Når du ikke lenger er med i et aktivt ANS/DA-selskap, legger du inn datoen
                                            din rolle i selskapet ble avsluttet.
                                        </ExpandableInfo>
                                    }
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
