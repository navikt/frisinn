export enum Feature {
    'PERSISTENCE' = 'PERSISTENCE',
    'AVVIKLEDE_SELSKAPER' = 'AVVIKLEDE_SELSKAPER',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
