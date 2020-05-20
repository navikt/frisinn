import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { AvsluttetSelskap } from '../../../types/AvsluttetSelskap';

interface Props {
    foretak: AvsluttetSelskap[];
    onEdit?: (foretak: AvsluttetSelskap) => void;
    onDelete?: (foretak: AvsluttetSelskap) => void;
}

const AvsluttetSelskapList = ({ foretak = [], onDelete, onEdit }: Props) => {
    const getDateTitleString = (f: AvsluttetSelskap) =>
        `${prettifyDate(f.opprettetDato)} - ${prettifyDate(f.avsluttetDato)}: ${f.navn}`;

    const renderLabel = (uttak: AvsluttetSelskap): React.ReactNode => {
        const title = getDateTitleString(uttak);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(uttak)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };

    return (
        <ItemList<AvsluttetSelskap>
            getItemId={(uttak) => uttak.id}
            getItemTitle={(uttak) => getDateTitleString(uttak)}
            items={foretak.filter((f) => f.id !== undefined)}
            labelRenderer={renderLabel}
            onDelete={onDelete}
            onEdit={onEdit}
        />
    );
};

export default AvsluttetSelskapList;
