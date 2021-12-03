export enum Feature {
    'PERSISTENCE' = 'PERSISTENCE',
    'INKLUDER_KONTONUMMER' = 'INKLUDER_KONTONUMMER',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
