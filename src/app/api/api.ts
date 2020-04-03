import axios from 'axios';
import axiosConfig from '../config/axiosConfig';
import { ApplicationApiData } from '../types/ApplicationApiData';
import { ResourceType } from '../types/ResourceType';
import { getApiUrlByResourceType } from '../utils/apiUtils';

export const getApplicantData = () => axios.get(getApiUrlByResourceType(ResourceType.APPLICANT), axiosConfig);

export const sendApplication = (data: ApplicationApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_APPLICATION), data, axiosConfig);
