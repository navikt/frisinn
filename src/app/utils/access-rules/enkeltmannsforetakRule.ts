import { AccessRule, AccessRuleNames, AccessRuleResult } from '../../types/AccessRule';
import { getHarEnkeltmannsforetak } from '../../api/api';

async function verifyHarEnkeltmannsforetak(): Promise<AccessRuleResult> {
    const result = await getHarEnkeltmannsforetak();
    const passes = result.data.harEnkeltmannsforetak === true;
    return {
        rule: AccessRuleNames.harEnkeltmannsforetak,
        passes,
        info: passes ? undefined : 'Har ikke enkeltmannsforetak',
    };
}

export const enkeltmannsforetakRule = (): AccessRule => {
    return {
        name: AccessRuleNames.harEnkeltmannsforetak,
        check: () => verifyHarEnkeltmannsforetak(),
    };
};
