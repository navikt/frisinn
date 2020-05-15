import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import AvvikletSelskapForm from './AvvikletSelskapForm';
import AvvikletSelskapList from './AvvikletSelskapList';
import { AvvikletSelskap } from '../../../types/AvvikletSelskap';

interface Props<FieldNames> {
    name: FieldNames;
    maxDate: Date;
    validate?: FormikValidateFunction;
}

function AvvikletSelskapListAndDialog<FieldNames>({ name, validate, maxDate }: Props<FieldNames>) {
    const labels: ModalFormAndListLabels = {
        addLabel: 'Legg til tidligere selskap',
        modalTitle: 'Tidligere selskap',
        listTitle: 'Tidligere selskap',
    };
    return (
        <>
            <FormikModalFormAndList<FieldNames, AvvikletSelskap>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={(a, b) => sortItemsByFom({ fom: a.opprettetDato }, { fom: b.opprettetDato })}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <AvvikletSelskapForm foretak={item} maxDate={maxDate} onSubmit={onSubmit} onCancel={onCancel} />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <AvvikletSelskapList foretak={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default AvvikletSelskapListAndDialog;
