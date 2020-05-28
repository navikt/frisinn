export enum Feature {
    'PERSISTENCE' = 'PERSISTENCE',
    'ARBEIDSTAKERINNTEKT' = 'ARBEIDSTAKERINNTEKT',
    'ANDREGANGSSOKNAD' = 'ANDREGANGSSOKNAD',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
