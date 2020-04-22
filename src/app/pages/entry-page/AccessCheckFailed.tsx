import React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { AccessCheckResult } from '../../types/AccessCheck';

interface Props {
    results: AccessCheckResult[];
}

const AccessCheckFailed = ({ results }: Props) => {
    const failingChecks: AccessCheckResult[] = results.filter((result) => {
        if (result.passes) {
            return false;
        }
        return true;
    });
    return (
        <>
            <AlertStripeAdvarsel>
                Du kan ikke sende bruke denne søknaden fordi:
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
