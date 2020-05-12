import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import HistoriskForetakForm from './HistoriskForetakForm';
import HistoriskForetakList from './HistoriskForetakList';
import { HistoriskFortak } from './types';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
}

function HistoriskForetakListAndDialog<FieldNames>({ name, validate }: Props<FieldNames>) {
    const labels: ModalFormAndListLabels = {
        addLabel: 'Legg til tidligere selskap',
        modalTitle: 'Tidligere selskap',
        listTitle: 'Tidligere selskap',
    };
    return (
        <>
            <FormikModalFormAndList<FieldNames, HistoriskFortak>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={(a, b) => sortItemsByFom({ fom: a.opprettetDato }, { fom: b.opprettetDato })}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <HistoriskForetakForm foretak={item} onSubmit={onSubmit} onCancel={onCancel} />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <HistoriskForetakList foretak={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default HistoriskForetakListAndDialog;
