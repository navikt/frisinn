import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { AvvikletSelskap } from '../../../types/AvvikletSelskap';

interface Props {
    foretak: AvvikletSelskap[];
    onEdit?: (foretak: AvvikletSelskap) => void;
    onDelete?: (foretak: AvvikletSelskap) => void;
}

const AvvikletSelskapList = ({ foretak = [], onDelete, onEdit }: Props) => {
    const getDateTitleString = (f: AvvikletSelskap) =>
        `${prettifyDate(f.opprettetDato)} - ${prettifyDate(f.avsluttetDato)}: ${f.navn}`;

    const renderLabel = (uttak: AvvikletSelskap): React.ReactNode => {
        const title = getDateTitleString(uttak);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(uttak)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };

    return (
        <ItemList<AvvikletSelskap>
            getItemId={(uttak) => uttak.id}
            getItemTitle={(uttak) => getDateTitleString(uttak)}
            items={foretak.filter((f) => f.id !== undefined)}
            labelRenderer={renderLabel}
            onDelete={onDelete}
            onEdit={onEdit}
        />
    );
};

export default AvvikletSelskapList;
