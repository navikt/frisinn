export const getEnvironmentVariable = (variableName: string) => (window as any).appSettings[variableName];

export const isRunningInDevEnvironment = () => (window as any).appSettings['APP_VERSION'] === 'dev';
