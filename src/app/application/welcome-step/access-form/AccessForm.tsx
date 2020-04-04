import React from 'react';
import { AccessRule, AccessRuleResult } from '../../../types/AccessRule';
import { Undertittel } from 'nav-frontend-typografi';

interface Props {
    accessRules: AccessRule[];
    results: AccessRuleResult[];
}

const AccessForm = ({ accessRules, results }: Props) => {
    return (
        <div>
            <Undertittel>Tilgangskontroller:</Undertittel>
            <ul>
                {accessRules.map((rule) => {
                    const result = results.find((r: AccessRuleResult) => r.rule === rule.name);
                    return (
                        <li key={rule.name}>
                            {rule.name}: {result ? <span>{result.passes ? 'ok' : result.info || 'IKD'}</span> : ''}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AccessForm;
