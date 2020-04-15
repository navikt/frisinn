import React from 'react';
import { ApplicationEssentials } from '../types/ApplicationEssentials';

export interface ApplicationContextData {
    applicationEssentials: ApplicationEssentials;
    resetApplication: () => void;
}

export const ApplicationContext = React.createContext<ApplicationContextData | undefined>(undefined);
