export type AccessRuleCheck = () => Promise<AccessRuleResult>;

export enum AccessRuleNames {
    'gyldigAlder' = 'gyldigAlder',
    'harEnkeltmannsforetak' = 'harEnkeltmannsforetak',
}

export interface AccessRuleResult {
    rule: string;
    passes: boolean;
    info?: string;
}

export interface AccessRule {
    name: string;
    check: AccessRuleCheck;
}
