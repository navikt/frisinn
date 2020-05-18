import React from 'react';
import { DateRange, sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import { AvsluttetSelskap } from '../../../types/AvsluttetSelskap';
import { soknadQuestionText } from '../../soknadQuestionText';
import AvsluttetSelskapForm from './AvsluttetSelskapForm';
import AvsluttetSelskapList from './AvsluttetSelskapList';
import { maxAvsluttetDate, minAvsluttetDate } from './avsluttetSelskapUtils';

interface Props<FieldNames> {
    name: FieldNames;
    maxDate: Date;
    periode?: DateRange;
    validate?: FormikValidateFunction;
}

function AvsluttetSelskapListAndDialog<FieldNames>({
    name,
    validate,
    periode = {
        from: minAvsluttetDate,
        to: maxAvsluttetDate,
    },
}: Props<FieldNames>) {
    const labels: ModalFormAndListLabels = {
        addLabel: 'Legg inn selskap som er avsluttet',
        modalTitle: 'Informasjon om avsluttet selskap',
        listTitle: soknadQuestionText.selvstendigAvsluttaSelskaper(periode),
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
                    <AvsluttetSelskapForm foretak={item} periode={periode} onSubmit={onSubmit} onCancel={onCancel} />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <AvsluttetSelskapList foretak={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default AvsluttetSelskapListAndDialog;
