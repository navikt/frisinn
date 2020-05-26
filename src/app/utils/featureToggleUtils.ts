export enum Feature {
    'PERSISTENCE' = 'PERSISTENCE',
    'AVSLUTTA_SELSKAPER' = 'AVSLUTTA_SELSKAPER',
    'STARTET_PAA_SOKNAD' = 'STARTET_PAA_SOKNAD',
    'ARBEIDSTAKERINNTEKT' = 'ARBEIDSTAKERINNTEKT',
    'ANDREGANGSSOKNAD' = 'ANDREGANGSSOKNAD',
    'SIMULER_JUNI' = 'SIMULER_JUNI',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};

export const isJuni = isFeatureEnabled(Feature.SIMULER_JUNI);
