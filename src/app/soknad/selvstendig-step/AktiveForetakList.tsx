import React from 'react';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { Foretak } from '../../types/SoknadEssentials';

interface Props {
    foretak: Foretak[];
}

const AktiveForetakList = ({ foretak = [] }: Props) => {
    const getItemTitle = ({ organisasjonsnummer, navn }: Foretak): string => {
        return `${organisasjonsnummer} - ${navn}`;
    };
    const renderLabel = (f: Foretak): React.ReactNode => {
        return <>{getItemTitle(f)}</>;
    };

    return (
        <ItemList<Foretak>
            getItemId={(f) => f.organisasjonsnummer}
            getItemTitle={getItemTitle}
            items={foretak}
            labelRenderer={renderLabel}
        />
    );
};

export default AktiveForetakList;
