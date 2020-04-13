import React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { AccessCheckResult } from '../../types/AccessCheck';
import { AccessChecks } from './EntryPage';
import { ApplicantProfile } from '../../types/ApplicantProfile';
import { Krav } from '../../types/Krav';
import { Undertittel } from 'nav-frontend-typografi';

interface Props {
    canUseApplicaton: boolean;
    accessChecks: AccessChecks;
    profile: ApplicantProfile;
}

const AccessCheckResultList = ({ canUseApplicaton, accessChecks, profile }: Props) => {
    const results = Object.keys(accessChecks).map((k) => accessChecks[k]);
    const isFrilanserOrSelvstendig = accessChecks.frilanser.passes || accessChecks.selvstendig.passes;
    const failingChecks: AccessCheckResult[] = results.filter((result) => {
        if (result.passes) {
            return false;
        }
        if (result.checkName === Krav.frilanser || result.checkName === Krav.selvstendig) {
            return false;
        }
        return true;
    });
    return (
        <>
            {canUseApplicaton && (
                <>
                    <Undertittel>Du kan sende inn søknad som</Undertittel>
                    <ul>
                        {profile.isSelvstendig && <li>Selvstendig næringsdrivende</li>}
                        {profile.isFrilanser && <li>Frilanser</li>}
                    </ul>
                </>
            )}
            {canUseApplicaton === false && !isFrilanserOrSelvstendig && (
                <>
                    <AlertStripeAdvarsel>
                        Du kan ikke bruke denne søknaden fordi du ikke er registrert som selvstendig næringsdrivende
                        eller frilanser
                    </AlertStripeAdvarsel>
                </>
            )}
            {canUseApplicaton === false && isFrilanserOrSelvstendig && (
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
            )}
        </>
    );
};

export default AccessCheckResultList;
