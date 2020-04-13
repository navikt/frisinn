import React from 'react';
import { ApplicantProfile } from '../types/ApplicantProfile';
import { ApplicationEssentials } from '../types/ApplicationEssentials';

export interface ApplicationContextData {
    applicationEssentials: ApplicationEssentials;
    applicantProfile?: ApplicantProfile;
    setApplicantProfile: (profile: ApplicantProfile) => void;
    resetApplication: () => void;
}

export const ApplicationContext = React.createContext<ApplicationContextData | undefined>(undefined);
