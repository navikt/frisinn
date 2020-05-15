import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import AvsluttetSelskapForm from './AvsluttetSelskapForm';
import AvsluttetSelskapList from './AvsluttetSelskapList';
import { AvsluttetSelskap } from '../../../types/AvsluttetSelskap';

interface Props<FieldNames> {
    name: FieldNames;
    maxDate: Date;
    validate?: FormikValidateFunction;
}

function AvsluttetSelskapListAndDialog<FieldNames>({ name, validate, maxDate }: Props<FieldNames>) {
    const labels: ModalFormAndListLabels = {
        addLabel: 'Legg til tidligere selskap',
        modalTitle: 'Tidligere selskap',
        listTitle: 'Tidligere selskap',
    };
    return (
        <>
            <FormikModalFormAndList<FieldNames, AvsluttetSelskap>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={(a, b) => sortItemsByFom({ fom: a.opprettetDato }, { fom: b.opprettetDato })}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <AvsluttetSelskapForm foretak={item} maxDate={maxDate} onSubmit={onSubmit} onCancel={onCancel} />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <AvsluttetSelskapList foretak={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default AvsluttetSelskapListAndDialog;
