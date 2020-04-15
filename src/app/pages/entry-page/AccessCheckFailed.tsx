import React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { AccessCheckResult } from '../../types/AccessCheck';
import { AccessChecks } from './EntryPage';

interface Props {
    accessChecks: AccessChecks;
}

const AccessCheckFailed = ({ accessChecks }: Props) => {
    const results = Object.keys(accessChecks).map((k) => accessChecks[k]);
    const failingChecks: AccessCheckResult[] = results.filter((result) => {
        if (result.passes) {
            return false;
        }
        return true;
    });
    return (
        <>
            <AlertStripeAdvarsel>
                Du kan ikke sende inn denne søknaden fordi:
                <ul>
                    {failingChecks.map((r) => (
                        <li key={r.checkName}>{r.info}</li>
                    ))}
                </ul>
            </AlertStripeAdvarsel>
        </>
    );
};

export default AccessCheckFailed;
