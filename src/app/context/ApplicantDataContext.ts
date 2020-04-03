import React from 'react';
import { ApplicantData } from '../types/ApplicantData';

export const ApplicantDataContext = React.createContext<ApplicantData | undefined>(undefined);

export const ApplicantDataContextProvider = ApplicantDataContext.Provider;
