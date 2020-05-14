import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { HistoriskFortak } from '../../../types/HistoriskeForetak';

interface Props {
    foretak: HistoriskFortak[];
    onEdit?: (foretak: HistoriskFortak) => void;
    onDelete?: (foretak: HistoriskFortak) => void;
}

const HistoriskForetakList = ({ foretak = [], onDelete, onEdit }: Props) => {
    const getDateTitleString = (f: HistoriskFortak) =>
        `${prettifyDate(f.opprettetDato)} - ${prettifyDate(f.avsluttetDato)}: ${f.navn}`;

    const renderLabel = (uttak: HistoriskFortak): React.ReactNode => {
        const title = getDateTitleString(uttak);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(uttak)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };

    return (
        <ItemList<HistoriskFortak>
            getItemId={(uttak) => uttak.id}
            getItemTitle={(uttak) => getDateTitleString(uttak)}
            items={foretak.filter((f) => f.id !== undefined)}
            labelRenderer={renderLabel}
            onDelete={onDelete}
            onEdit={onEdit}
        />
    );
};

export default HistoriskForetakList;
